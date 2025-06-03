export default async function PermisionMiddleware(request) {
  const allowedIPs = ["127.0.0.1", "localhost:3000"];
  const ip =
    request.headers.get("x-forwarded-for") || request.connection.remoteAddress;
  if (!allowedIPs.includes(ip)) {
    return new Response(JSON.stringify({ message: "Acceso no autorizado" }), {
      status: 403,
    });
  }
  return new Response(JSON.stringify({ message: "Acceso autorizado" }), {
    status: 200,
  });
}
