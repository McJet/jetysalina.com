import { getCookie } from "../../../server/cookies.js";
import {
  SESSION_COOKIE,
  deleteSession,
  clearSessionCookie,
} from "../../../server/sessions.js";

// POST, not GET: any page can make your browser GET a URL (an <img> tag
// pointing here would log you out). SameSite=Lax cookies aren't sent on
// POSTs from other sites, so only this site can log you out.
export async function onRequestPost(context) {
  const token = getCookie(context.request, SESSION_COOKIE);
  // Deleting the row is what actually logs out. Clearing the cookie alone
  // would leave the session valid for anyone who had copied the token.
  if (token) await deleteSession(context.env.DB, token);

  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}
