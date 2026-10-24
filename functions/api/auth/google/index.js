import { generateState, generateCodeVerifier } from "arctic";
import {
  createGoogle,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  oauthCookie,
} from "../../../../server/oauth.js";

export function onRequestGet(context) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = createGoogle(context).createAuthorizationURL(state, codeVerifier, [
    "openid",
    "email",
  ]);

  // Response.redirect() makes immutable headers, so we can't add cookies to it.
  const headers = new Headers({ Location: url.toString() });
  headers.append("Set-Cookie", oauthCookie(STATE_COOKIE, state));
  headers.append("Set-Cookie", oauthCookie(VERIFIER_COOKIE, codeVerifier));
  return new Response(null, { status: 302, headers });
}
