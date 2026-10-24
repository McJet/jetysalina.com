// The browser sends every cookie in one header: "a=1; b=2; c=3".
export function getCookie(request, name) {
  const header = request.headers.get("Cookie") ?? "";
  for (const pair of header.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}
