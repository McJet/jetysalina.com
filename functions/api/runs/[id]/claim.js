import { playerId } from "../../../../server/runs.js";

// A player takes ownership of a finished guest run: the one they played
// before logging in, or before choosing a display name.
export async function onRequestPost(context) {
  const ownerId = playerId(context.data.user);
  if (!ownerId) {
    return Response.json(
      { error: "Log in and choose a display name first" },
      { status: 401 },
    );
  }

  // One statement checks every rule: it exists, nobody owns it yet, and it
  // ended by cash out or bust (open runs become theirs when they finish;
  // abandoned runs never count). Two claims racing: only one matches.
  const result = await context.env.DB.prepare(
    `UPDATE runs SET user_id = ?
     WHERE id = ? AND user_id IS NULL AND status IN ('cashed_out', 'busted')`,
  )
    .bind(ownerId, context.params.id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Run can't be claimed" }, { status: 409 });
  }
  return new Response(null, { status: 204 });
}
