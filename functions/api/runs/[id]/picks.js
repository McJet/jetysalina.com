import { isValidBox, rollRound } from "../../../../server/game.js";
import {
  conflict,
  loadRun,
  notFound,
  playerId,
  readJson,
  runView,
} from "../../../../server/runs.js";

// Picks a box. Body: { "round": 3, "box": 2 }
// `round` is the round the player is looking at (rounds survived + 1).
export async function onRequestPost(context) {
  const db = context.env.DB;
  const user = context.data.user;
  const row = await loadRun(db, context.params.id, user);
  if (!row) return notFound();

  const body = await readJson(context.request);
  if (!isValidBox(body?.box) || !Number.isInteger(body?.round)) {
    return Response.json({ error: "Expected { round, box }" }, { status: 400 });
  }
  if (row.status !== "open" || body.round !== row.rounds_survived + 1) {
    return conflict(runView(row));
  }

  // The round is rolled now, as the pick arrives. Nothing was decided before
  // this line, so there was nothing for the browser to peek at.
  const boxes = rollRound();
  const points = boxes[body.box];
  const busted = points === 0;
  const now = Date.now();

  // Each update only applies if the run is still exactly as we read it
  // (open, same round). A duplicate of this request finds rounds_survived or
  // status already changed, matches 0 rows, and gets a 409 below.
  const result = busted
    ? await db
        .prepare(
          `UPDATE runs SET status = 'busted', ended_at = ?, user_id = COALESCE(user_id, ?)
           WHERE id = ? AND status = 'open' AND rounds_survived = ?`,
        )
        // COALESCE: a guest who logged in partway owns the run once it ends.
        .bind(now, playerId(user), row.id, row.rounds_survived)
        .run()
    : await db
        .prepare(
          `UPDATE runs SET score = score + ?, rounds_survived = rounds_survived + 1
           WHERE id = ? AND status = 'open' AND rounds_survived = ?`,
        )
        .bind(points, row.id, row.rounds_survived)
        .run();

  if (result.meta.changes === 0) {
    return conflict(runView(await loadRun(db, row.id, user)));
  }

  const updated = await loadRun(db, row.id, user);
  return Response.json({ run: runView(updated), boxes, picked: body.box });
}
