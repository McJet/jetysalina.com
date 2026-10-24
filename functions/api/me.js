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
