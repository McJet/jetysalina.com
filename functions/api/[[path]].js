export function onRequest() {
  return Response.json(
    {
      error: "Not Found",
    },
    {
      status: 404,
    },
  );
}
