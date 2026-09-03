import { NextResponse } from "next/server";
import { saveMercadoPagoPayment } from "@/lib/save-mercadopago-payment";
import { verifyMercadoPagoWebhook } from "@/lib/verify-mp-webhook";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  if (!verifyMercadoPagoWebhook(request)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payload: {
    type?: string;
    action?: string;
    data?: { id?: string | number };
    topic?: string;
  } = {};

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    payload = {};
  }

  const url = new URL(request.url);
  const paymentId = String(
    payload.data?.id ??
      url.searchParams.get("data.id") ??
      url.searchParams.get("id") ??
      "",
  );
  const type = payload.type || url.searchParams.get("type") || payload.topic;

  if (!paymentId) {
    return NextResponse.json({ received: true });
  }

  const kind = String(type || "");
  if (kind && !kind.includes("payment")) {
    return NextResponse.json({ received: true });
  }

  try {
    await saveMercadoPagoPayment(paymentId);
    return NextResponse.json({ received: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo guardar el pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
