export async function onRequestGet(context) {
  try {
    await context.env.DB.prepare("SELECT 1").first();
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, db: false }, { status: 503 });
  }
  return Response.json({ ok: true, db: true, time: new Date().toISOString() });
}
