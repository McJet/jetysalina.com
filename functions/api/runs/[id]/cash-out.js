import { rollRound } from "../../../../server/game.js";
import {
  conflict,
  loadRun,
  notFound,
  playerId,
  readJson,
  runView,
} from "../../../../server/runs.js";

// Ends the run and keeps its score. Body: { "round": 3 }
export async function onRequestPost(context) {
  const db = context.env.DB;
  const user = context.data.user;
  const row = await loadRun(db, context.params.id, user);
  if (!row) return notFound();

  const body = await readJson(context.request);
  if (!Number.isInteger(body?.round)) {
    return Response.json({ error: "Expected { round }" }, { status: 400 });
  }
  if (row.status !== "open" || body.round !== row.rounds_survived + 1) {
    return conflict(runView(row));
  }
  if (row.score === 0) {
    return Response.json({ error: "Nothing to cash out yet" }, { status: 400 });
  }

  // Same guard as a pick: a cash-out racing a pick on the same round loses
  // if the pick got there first, and vice versa.
  const result = await db
    .prepare(
      `UPDATE runs SET status = 'cashed_out', ended_at = ?, user_id = COALESCE(user_id, ?)
       WHERE id = ? AND status = 'open' AND rounds_survived = ?`,
    )
    .bind(Date.now(), playerId(user), row.id, row.rounds_survived)
    .run();

  if (result.meta.changes === 0) {
    return conflict(runView(await loadRun(db, row.id, user)));
  }

  // "What was in the boxes?" The run is over, so rolling a round just to
  // show it can't change anything. It is for display only.
  const updated = await loadRun(db, row.id, user);
  return Response.json({ run: runView(updated), boxes: rollRound() });
}
