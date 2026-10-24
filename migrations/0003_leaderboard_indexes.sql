-- Migration number: 0003 	 2026-10-24T17:22:54.267Z

-- Global leaderboard: players' cashed-out runs, best score first, earlier
-- run first on a tie. With this index SQLite reads the top rows in order and
-- stops after 10; without it, it reads every run (each one a billed row
-- read) and sorts them all, on every leaderboard view.
CREATE INDEX idx_runs_global_score ON runs (score DESC, ended_at)
  WHERE status = 'cashed_out' AND user_id IS NOT NULL;

-- Personal leaderboard: the same ranking, within one player's runs.
CREATE INDEX idx_runs_personal_score ON runs (user_id, score DESC, ended_at)
  WHERE status = 'cashed_out';
