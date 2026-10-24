import { displayNameProblem } from "../../../server/displayNames.js";

// Sets or changes the caller's display name. Body: { "displayName": "Jet" }
export async function onRequestPut(context) {
  const user = context.data.user;
  if (!user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  // The body is whatever the caller sent, which may not be JSON at all.
  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  const displayName = body?.displayName;
  const problem = displayNameProblem(displayName);
  if (problem) {
    return Response.json({ error: problem }, { status: 400 });
  }

  try {
    await context.env.DB.prepare("UPDATE users SET display_name = ? WHERE id = ?")
      .bind(displayName, user.id)
      .run();
  } catch (error) {
    // No "is it taken?" SELECT beforehand: two people could both pass that
    // check at once. The UNIQUE column is the only real guarantee, so we
    // just try, and treat its refusal as "taken".
    if (String(error.message).includes("UNIQUE constraint failed")) {
      return Response.json({ error: "That name is taken" }, { status: 409 });
    }
    throw error;
  }

  return Response.json({ displayName });
}
