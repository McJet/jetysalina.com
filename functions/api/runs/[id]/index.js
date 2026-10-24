import { loadRun, notFound, runView } from "../../../../server/runs.js";

// The run's current state, so a reloaded page can resume an open run.
export async function onRequestGet(context) {
  const row = await loadRun(context.env.DB, context.params.id, context.data.user);
  if (!row) return notFound();
  return Response.json(runView(row));
}
