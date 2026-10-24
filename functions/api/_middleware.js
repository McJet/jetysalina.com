import { getCookie } from "../../server/cookies.js";
import {
  SESSION_COOKIE,
  validateSession,
  sessionCookie,
  clearSessionCookie,
} from "../../server/sessions.js";

// Runs before every /api/* handler. Works out who is calling and puts it on
// context.data.user (null for a guest), so no endpoint reads cookies itself.
export async function onRequest(context) {
  const token = getCookie(context.request, SESSION_COOKIE);
  const session = token ? await validateSession(context.env.DB, token) : null;
  context.data.user = session?.user ?? null;

  // Hands the request on to the matching handler and waits for its response.
  const response = await context.next();

  // A cookie whose session is gone (expired, logged out elsewhere, account
  // deleted): tell the browser to drop it. A renewed session: send the
  // cookie again with a fresh Max-Age, so the browser keeps it as long as
  // the database does.
  let setCookie = null;
  if (token && !session) setCookie = clearSessionCookie();
  if (session?.renewed) setCookie = sessionCookie(token);
  if (!setCookie) return response;

  // The handler already decided the cookie (login sets a new one, logout
  // clears it). Its decision wins: browsers apply Set-Cookie headers in
  // order, so a clear appended after a login's new cookie would log the
  // player straight back out.
  const handlerSetCookie = response.headers.getSetCookie();
  if (handlerSetCookie.some((c) => c.startsWith(`${SESSION_COOKIE}=`))) {
    return response;
  }

  // Responses from handlers can have immutable headers; copy before adding.
  const withCookie = new Response(response.body, response);
  withCookie.headers.append("Set-Cookie", setCookie);
  return withCookie;
}
