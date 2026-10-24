import { deleteOldGuestRuns, playerId, runView } from "../../../server/runs.js";

// Starts a run. A player's previous open run, if any, is Abandoned.
export async function onRequestPost(context) {
  const db = context.env.DB;
  const ownerId = playerId(context.data.user);
  const now = Date.now();
  const id = crypto.randomUUID();

  // db.batch runs these as one transaction: all of them happen, or none do.
  // Without it, a failure between "abandon the old run" and "insert the new
  // one" would leave the player with no open run and a lost one.
  const statements = [deleteOldGuestRuns(db)];
  if (ownerId) {
    statements.push(
      db
        .prepare(
          "UPDATE runs SET status = 'abandoned', ended_at = ? WHERE user_id = ? AND status = 'open'",
        )
        .bind(now, ownerId),
    );
  }
  statements.push(
    db
      .prepare("INSERT INTO runs (id, user_id, started_at) VALUES (?, ?, ?)")
      .bind(id, ownerId, now),
  );

  try {
    await db.batch(statements);
  } catch (error) {
    // Two starts raced (two tabs): both abandoned nothing, then both inserted
    // an open run. idx_runs_one_open_per_player refuses the second.
    if (String(error.message).includes("UNIQUE constraint failed")) {
      return Response.json(
        { error: "A run was just started somewhere else" },
        { status: 409 },
      );
    }
    throw error;
  }

  return Response.json(
    runView({ id, user_id: ownerId, status: "open", score: 0, rounds_survived: 0 }),
    { status: 201 },
  );
}
