export function onRequestGet(context) {
  return Response.json({
    ok: true,
    time: new Date().toISOString(),
  });
}
