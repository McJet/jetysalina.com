import { clearSessionCookie } from "../../server/sessions.js";

// Who am I? The frontend calls this on load to decide between showing
// "Log in" and the player's account.
export function onRequestGet(context) {
  const user = context.data.user;
  if (!user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }
  return Response.json({
    email: user.email,
    displayName: user.displayName,
  });
}

// Deletes the caller's account. ON DELETE CASCADE removes their sessions
// (and, once runs exist, their runs) along with the user row.
export async function onRequestDelete(context) {
  const user = context.data.user;
  if (!user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  await context.env.DB.prepare("DELETE FROM users WHERE id = ?")
    .bind(user.id)
    .run();

  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}
