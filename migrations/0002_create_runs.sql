-- Migration number: 0002 	 2026-10-24T16:08:20.876Z
CREATE TABLE runs (
  -- crypto.randomUUID(). For a guest this ID is the only proof the run is
  -- theirs, so it must be unguessable.
  id               TEXT    PRIMARY KEY,

  -- NULL for a guest run (including someone logged in without a display
  -- name). Set when a Player finishes it or Claims it.
  user_id          TEXT    REFERENCES users(id) ON DELETE CASCADE,

  -- CHECK: the database refuses any other value, so a typo like 'busted '
  -- in code fails loudly instead of creating a fifth kind of run.
  status           TEXT    NOT NULL DEFAULT 'open'
                           CHECK (status IN ('open', 'cashed_out', 'busted', 'abandoned')),

  -- A bust keeps the score it had (see CONTEXT.md)
  score            INTEGER NOT NULL DEFAULT 0,
  rounds_survived  INTEGER NOT NULL DEFAULT 0,

  started_at       INTEGER NOT NULL,
  -- NULL while the run is open
  ended_at         INTEGER
);

-- A partial index: it only contains open runs. UNIQUE makes "a player has
-- at most one open run" a rule the database enforces, even if two starts
-- race. Guests' NULL user_ids never collide with each other.
CREATE UNIQUE INDEX idx_runs_one_open_per_player ON runs (user_id) WHERE status = 'open';

-- Lets the "delete guest runs older than a day" cleanup read only old guest
-- runs instead of scanning the whole table.
CREATE INDEX idx_runs_guest_started ON runs (started_at) WHERE user_id IS NULL;
