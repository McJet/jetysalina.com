const SIZE = 10;

// The caller's own best cashed-out runs, ranked like the Global board.
// Shown even to a banned player: the ban hides them from others, not from
// themselves.
export async function onRequestGet(context) {
  const user = context.data.user;
  if (!user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { results } = await context.env.DB.prepare(
    `SELECT score, rounds_survived, ended_at FROM runs
     WHERE user_id = ? AND status = 'cashed_out'
     ORDER BY score DESC, ended_at
     LIMIT ?`,
  )
    .bind(user.id, SIZE)
    .all();

  return Response.json(
    results.map((row) => ({
      score: row.score,
      roundsSurvived: row.rounds_survived,
      endedAt: row.ended_at,
    })),
  );
}
