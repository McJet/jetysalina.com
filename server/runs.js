// Shared pieces of the /api/runs endpoints.

const GUEST_RUN_LIFETIME_MS = 24 * 60 * 60 * 1000;

// Only someone with a display name can own runs. Anyone else, logged in or
// not, plays as a guest (see CONTEXT.md).
export function playerId(user) {
  return user?.displayName ? user.id : null;
}

// What the browser is told about a run. Never includes anything it could use
// to predict a pick; there is nothing stored to predict anyway.
export function runView(row) {
  return {
    id: row.id,
    status: row.status,
    score: row.score,
    roundsSurvived: row.rounds_survived,
    owned: row.user_id !== null,
  };
}

// Loads a run the caller is allowed to act on, or null.
// A guest run: anyone holding its ID (the ID is the secret).
// A player's run: only that player. A wrong owner gets the same null as a
// missing run, so nobody can probe which IDs exist.
export async function loadRun(db, id, user) {
  const row = await db.prepare("SELECT * FROM runs WHERE id = ?").bind(id).first();
  if (!row) return null;
  if (row.user_id !== null && row.user_id !== user?.id) return null;
  return row;
}

// Removes guest runs nobody claimed. Pages Functions can't run on a timer, so
// this rides along with starting a run. The partial index on started_at means
// it reads only old guest runs.
export function deleteOldGuestRuns(db) {
  return db
    .prepare("DELETE FROM runs WHERE user_id IS NULL AND started_at < ?")
    .bind(Date.now() - GUEST_RUN_LIFETIME_MS);
}

// Request bodies are whatever the caller sent. null if it isn't JSON.
export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function notFound() {
  return Response.json({ error: "Run not found" }, { status: 404 });
}

// The run moved on since the caller last looked: a duplicate pick, another
// tab, or a stale page. The browser should reload the run and carry on.
export function conflict(run) {
  return Response.json({ error: "Run has changed", run }, { status: 409 });
}
