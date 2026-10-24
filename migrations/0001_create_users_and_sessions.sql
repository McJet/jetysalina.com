-- Migration number: 0001 	 2026-10-24T02:19:22.551Z
CREATE TABLE users (
  -- crypto.randomUUID(), generated in your code, not by the database
  id            TEXT    PRIMARY KEY,

  -- Google's permanent ID for this person. UNIQUE: one row per Google account
  google_sub    TEXT    NOT NULL UNIQUE,

  -- For you to recognise people in the console. Not unique: it can change
  email         TEXT    NOT NULL,

  -- No NOT NULL: empty (NULL) until they choose one.
  -- UNIQUE + NOCASE: 'Jet' and 'jet' collide, enforced by the database.
  -- SQLite allows any number of NULLs in a UNIQUE column, so many
  -- not-yet-named users don't clash with each other.
  display_name  TEXT    UNIQUE COLLATE NOCASE,

  -- 0 = fine, 1 = banned. You flip this by hand in the D1 console.
  banned        INTEGER NOT NULL DEFAULT 0,

  -- Date.now(): milliseconds since 1970
  created_at    INTEGER NOT NULL
);

CREATE TABLE sessions (
  -- SHA-256 hex of the cookie's token. The token itself is never stored,
  -- so a leaked table can't be used to log in as anyone.
  id TEXT PRIMARY KEY,

  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);