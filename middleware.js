import { NextResponse } from "next/server";
import { envs } from "@/config/envs.config";

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

    // Headers de seguridad para respuestas bloqueadas
    setSecurityHeaders(response, url, request, true);
    response.headers.set("X-Security-Block", "path-traversal-protection");

    return response;
  }

  const response = NextResponse.next();
  setSecurityHeaders(response, url, request, false);
  return response;
}

/**
 * Configura todos los headers de seguridad incluyendo HSTS
 * @param {NextResponse} response - Respuesta de Next.js
 * @param {URL} url - URL de la request
 * @param {Request} request - Request original
 * @param {boolean} isBlocked - Si la request fue bloqueada
 */
function setSecurityHeaders(response, url, request, isBlocked = false) {
  // Headers base de seguridad
  const baseHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": isBlocked ? "DENY" : "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };

  // Aplicar headers base
  Object.entries(baseHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 🔒 HSTS - Solo en conexiones HTTPS
  const isHTTPS =
    url.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https" ||
    request.headers.get("x-forwarded-ssl") === "on";

  if (isHTTPS) {
    const hstsValue = getHSTSConfig();
    response.headers.set("Strict-Transport-Security", hstsValue);
  }
}

/**
 * Genera la configuración HSTS basada en el entorno
 * @returns {string} Valor del header HSTS
 */
function getHSTSConfig() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  if (isDevelopment) {
    return "max-age=86400"; // 1 día en desarrollo
  }

  if (isProduction) {
    const maxAge = envs.HSTS_MAX_AGE || "31536000";
    const includeSubdomains = envs.HSTS_INCLUDE_SUBDOMAINS !== "false";
    const preload = envs.HSTS_PRELOAD === "true";

    let hstsValue = `max-age=${maxAge}`;

    if (includeSubdomains) {
      hstsValue += "; includeSubDomains";
    }

    if (preload) {
      hstsValue += "; preload";
    }

    return hstsValue;
  }

  return "max-age=300"; // 5 minutos como fallback
}

export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
