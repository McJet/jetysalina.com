import { playerId, readJson } from "../../../server/runs.js";

// Matches the browser's cap. Also keeps the statement well under D1's limit
// of 100 bound parameters (each ID is one, plus the owner).
export const MAX_CLAIM = 50;

// A player takes ownership of the finished guest runs this browser played:
// before logging in, or before choosing a display name.
// Body: { "ids": ["…", "…"] }
export async function onRequestPost(context) {
  const ownerId = playerId(context.data.user);
  if (!ownerId) {
    return Response.json(
      { error: "Log in and choose a display name first" },
      { status: 401 },
    );
  }

  const body = await readJson(context.request);
  const ids = body?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > MAX_CLAIM ||
    !ids.every((id) => typeof id === "string")
  ) {
    return Response.json(
      { error: `Expected { ids: [...] } with 1-${MAX_CLAIM} run IDs` },
      { status: 400 },
    );
  }

  // One statement checks every rule for every run: nobody owns it yet, and it
  // ended by cash out or bust (open runs become theirs when they finish;
  // abandoned runs never count). IDs that don't qualify, or no longer exist,
  // simply don't match. Two claims racing: each run goes to only one of them.
  const placeholders = ids.map(() => "?").join(", ");
  const result = await context.env.DB.prepare(
    `UPDATE runs SET user_id = ?
     WHERE id IN (${placeholders})
       AND user_id IS NULL AND status IN ('cashed_out', 'busted')`,
  )
    .bind(ownerId, ...ids)
    .run();

  return Response.json({ claimed: result.meta.changes });
}
