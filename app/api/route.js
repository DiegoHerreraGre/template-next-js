import PermisionMiddleware from "@/middleware/permisions.middleware";

export async function GET(request) {
  return PermisionMiddleware(request);
}

export async function POST(request) {
  return PermisionMiddleware(request);
}

export async function PUT(request) {
  return PermisionMiddleware(request);
}

export async function DELETE(request) {
  return PermisionMiddleware(request);
}

export async function PATCH(request) {
  return PermisionMiddleware(request);
}

export async function OPTIONS(request) {
  return PermisionMiddleware(request);
}

export async function HEAD(request) {
  return PermisionMiddleware(request);
}
