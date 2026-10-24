import { Google } from "arctic";

// Behind Vite's dev proxy, request.url says :8788, but the browser (and
// Google's registered redirect) is on :5173. PUBLIC_ORIGIN is set only in
// .dev.vars; preview and production have no proxy, so request.url is right.
export function publicOrigin(context) {
  return context.env.PUBLIC_ORIGIN ?? new URL(context.request.url).origin;
}

// Both the login start and the callback must build the client with the exact
// same redirect URI, or Google rejects the code exchange.
export function createGoogle(context) {
  return new Google(
    context.env.GOOGLE_CLIENT_ID,
    context.env.GOOGLE_CLIENT_SECRET,
    `${publicOrigin(context)}/api/auth/google/callback`,
  );
}

// Short-lived cookies that carry the login attempt across the trip to Google.
// Path=/api/auth: only sent to auth routes, not every request.
// SameSite=Lax (not Strict): the browser comes back from google.com, and
// Strict cookies are dropped on requests arriving from another site.
const OAUTH_COOKIE_ATTRIBUTES =
  "Path=/api/auth; HttpOnly; Secure; SameSite=Lax";

export const STATE_COOKIE = "google_oauth_state";
export const VERIFIER_COOKIE = "google_code_verifier";

export function oauthCookie(name, value) {
  return `${name}=${value}; ${OAUTH_COOKIE_ATTRIBUTES}; Max-Age=600`;
}

// Max-Age=0 tells the browser to delete the cookie now.
export function clearOauthCookie(name) {
  return `${name}=; ${OAUTH_COOKIE_ATTRIBUTES}; Max-Age=0`;
}
