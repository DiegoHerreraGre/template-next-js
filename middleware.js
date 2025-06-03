import { NextResponse } from "next/server";

export function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const decodedPath = decodeURIComponent(path);

  const suspiciousPatterns = [
    "../",
    "..%2f",
    "..%2F",
    "..\\",
    "..%5c",
    "..%5C",
    "%252e%252e%252f",
    "%252e%252e%255c",
    "%c0%ae%c0%ae%c0%af",
    "%e0%80%ae%e0%80%ae%e0%80%af",
    "/etc/",
    "/var/",
    "/bin/",
    "/proc/",
    "/sys/",
    "/dev/",
    "/root/",
    "/home/",
    "/tmp/",
    "passwd",
    "shadow",
    "hosts",
    ".env",
    ".git",
    ".ssh",
    "file://",
    "file:///",
    "ftp://",
    "%00",
    "\\0",
    "\x00",
    "<script",
    "javascript:",
    "vbscript:",
    "data:text/html",
    "union select",
    "drop table",
    "exec(",
    "xp_cmdshell",
  ];

  const pathTraversalRegex =
    /(\.\.[\/\\])|(%2e%2e[%2f%5c])|(%252e%252e%25[2f5][cf])/i;
  const excessiveDotsRegex = /\.{3,}/;
  const suspiciousCharsRegex = /[\x00-\x1f\x7f-\x9f]/; // Control characters

  const checks = {
    pathTraversal: pathTraversalRegex.test(decodedPath.toLowerCase()),
    suspiciousPattern: suspiciousPatterns.some((pattern) =>
      decodedPath.toLowerCase().includes(pattern.toLowerCase())
    ),
    excessiveSegments: path.split("/").length > 15, // Aumentado de 10 a 15
    multipleDots: excessiveDotsRegex.test(path),
    controlChars: suspiciousCharsRegex.test(decodedPath),
    excessiveLength: path.length > 2048,
    multipleEncoding: /%25[0-9a-f]{2}/i.test(path),
  };

  const isBlocked = Object.values(checks).some((check) => check);

  if (isBlocked) {
    if (process.env.NODE_ENV === "development") {
      console.warn("🚨 Blocked suspicious request:", {
        path: path,
        decodedPath: decodedPath,
        ip: request.ip || "unknown",
        userAgent: request.headers.get("user-agent"),
        checks: Object.entries(checks)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        timestamp: new Date().toISOString(),
      });
    }
    const response = NextResponse.redirect(
      new URL("/error?code=403&reason=security", request.url)
    );
    response.headers.set("X-Security-Block", "path-traversal-protection");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
