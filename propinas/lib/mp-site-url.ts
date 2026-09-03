export function getPublicBaseUrl(request: Request) {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, "")}`;
  }

  return new URL(request.url).origin;
}

export function isLocalUrl(url: string) {
  return url.includes("localhost") || url.includes("127.0.0.1");
}
