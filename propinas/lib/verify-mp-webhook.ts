import { createHmac, timingSafeEqual } from "crypto";

export function verifyMercadoPagoWebhook(request: Request) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  if (!xSignature || !xRequestId) return false;

  const url = new URL(request.url);
  const dataId =
    url.searchParams.get("data.id") || url.searchParams.get("id") || "";

  let ts = "";
  let hash = "";
  for (const part of xSignature.split(",")) {
    const [key, value] = part.split("=").map((item) => item.trim());
    if (key === "ts") ts = value ?? "";
    if (key === "v1") hash = value ?? "";
  }

  if (!ts || !hash || !dataId) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(hash, "utf8");
  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}
