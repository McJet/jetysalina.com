import { decodeIdToken } from "arctic";
import { getCookie } from "../../../../server/cookies.js";
import {
  createGoogle,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  clearOauthCookie,
} from "../../../../server/oauth.js";
import {
  createSession,
  deleteSession,
  sessionCookie,
  SESSION_COOKIE,
} from "../../../../server/sessions.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = getCookie(request, STATE_COOKIE);
  const codeVerifier = getCookie(request, VERIFIER_COOKIE);

  // Proves this login was started from this browser (stops login CSRF).
  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return Response.json({ error: "Invalid login attempt" }, { status: 400 });
  }

  let claims;
  try {
    const tokens = await createGoogle(context).validateAuthorizationCode(
      code,
      codeVerifier,
    );
    // No signature check needed: this token came straight from Google over
    // HTTPS in a server-to-server request, not from the browser.
    claims = decodeIdToken(tokens.idToken());
  } catch (error) {
    // An expired, reused or forged code. Log it; don't tell the client why.
    console.error(error);
    return Response.json({ error: "Invalid login attempt" }, { status: 400 });
  }

  // Find or create the user in one statement. A separate SELECT then INSERT
  // would race if the same person finished two logins at once.
  // ON CONFLICT also keeps the email current if they changed it at Google.
  const user = await env.DB.prepare(
    `INSERT INTO users (id, google_sub, email, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (google_sub) DO UPDATE SET email = excluded.email
     RETURNING id`,
  )
    .bind(crypto.randomUUID(), claims.sub, claims.email, Date.now())
    .first();

  // Logging in again from this browser replaces its cookie, so its old
  // session would be left valid but unusable. Delete it rather than orphan it.
  const oldToken = getCookie(request, SESSION_COOKIE);
  if (oldToken) await deleteSession(env.DB, oldToken);

  const token = await createSession(env.DB, user.id);

  const headers = new Headers({ Location: "/box-roulette" });
  headers.append("Set-Cookie", sessionCookie(token));
  // The login attempt is over; its cookies are single-use.
  headers.append("Set-Cookie", clearOauthCookie(STATE_COOKIE));
  headers.append("Set-Cookie", clearOauthCookie(VERIFIER_COOKIE));
  return new Response(null, { status: 302, headers });
}
