const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = "session";

function toHex(bytes) {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// The cookie holds the token; the database holds only its SHA-256. A leaked
// sessions table can't be turned back into working cookies.
// (A fast hash is fine here: the token is 256 random bits, so there is
// nothing to guess, unlike a password.)
export async function hashToken(token) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return toHex(digest);
}

// Returns the token for the cookie. The token itself is never stored.
export async function createSession(db, userId) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(await hashToken(token), userId, now + SESSION_LIFETIME_MS, now)
    .run();
  return token;
}

// Looks up the session behind a cookie's token, with its user.
// Returns null if there's no such session or it has expired.
// `renewed` is true when the expiry was pushed back, so the caller
// knows to send a fresh cookie.
export async function validateSession(db, token) {
  const id = await hashToken(token);
  const row = await db
    .prepare(
      `SELECT sessions.expires_at, users.id AS user_id, users.email,
              users.display_name, users.banned
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ?`,
    )
    .bind(id)
    .first();
  if (!row) return null;

  const now = Date.now();
  if (row.expires_at <= now) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
    return null;
  }

  // Sliding expiry, but only once the session is past halfway. Renewing on
  // every request would cost a database write per API call.
  let renewed = false;
  if (row.expires_at - now < SESSION_LIFETIME_MS / 2) {
    await db
      .prepare("UPDATE sessions SET expires_at = ? WHERE id = ?")
      .bind(now + SESSION_LIFETIME_MS, id)
      .run();
    renewed = true;
  }

  return {
    user: {
      id: row.user_id,
      email: row.email,
      displayName: row.display_name,
      banned: row.banned === 1,
    },
    renewed,
  };
}

export async function deleteSession(db, token) {
  await db
    .prepare("DELETE FROM sessions WHERE id = ?")
    .bind(await hashToken(token))
    .run();
}

// Path=/ so it's sent to every /api route, not just /api/auth.
const SESSION_COOKIE_ATTRIBUTES = "Path=/; HttpOnly; Secure; SameSite=Lax";

export function sessionCookie(token) {
  const maxAgeSeconds = SESSION_LIFETIME_MS / 1000;
  return `${SESSION_COOKIE}=${token}; ${SESSION_COOKIE_ATTRIBUTES}; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; ${SESSION_COOKIE_ATTRIBUTES}; Max-Age=0`;
}
