const SIZE = 10;

// Highest Score: the best cashed-out runs by every Player. Busts don't count
// here (they have their own board, Largest bust). Banned players are hidden.
export async function onRequestGet(context) {
  // `runs.user_id IS NOT NULL` is implied by the JOIN, but SQLite only uses a
  // partial index when the WHERE clause visibly matches the index's own
  // WHERE, so it's spelled out for idx_runs_global_score.
  const { results } = await context.env.DB.prepare(
    `SELECT users.display_name, runs.score, runs.rounds_survived, runs.ended_at
     FROM runs JOIN users ON users.id = runs.user_id
     WHERE runs.status = 'cashed_out' AND runs.user_id IS NOT NULL
       AND users.banned = 0
     ORDER BY runs.score DESC, runs.ended_at
     LIMIT ?`,
  )
    .bind(SIZE)
    .all();

  return Response.json(
    results.map((row) => ({
      displayName: row.display_name,
      score: row.score,
      roundsSurvived: row.rounds_survived,
      endedAt: row.ended_at,
    })),
  );
}
