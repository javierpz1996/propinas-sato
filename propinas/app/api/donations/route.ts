import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/mercadopago-client";
import { getPublicBaseUrl, isLocalUrl } from "@/lib/mp-site-url";

export async function POST(request: Request) {
  let body: { amount?: number; imageId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const amount = body.amount;
  if (amount !== 1000 && amount !== 2000 && amount !== 3000) {
    return NextResponse.json({ error: "Monto no permitido" }, { status: 400 });
  }

  const imageId = body.imageId?.trim() || "";
  const base = getPublicBaseUrl(request);
  const successUrl = `${base}/gracias?monto=${amount}${
    imageId ? `&imageId=${encodeURIComponent(imageId)}` : ""
  }`;
  const failPath = imageId ? `${base}/detalle/${imageId}` : base;

  let client;
  try {
    client = getMercadoPagoClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falta MERCADOPAGO_ACCESS_TOKEN";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const preference = new Preference(client);
  const notificationUrl = isLocalUrl(base)
    ? undefined
    : `${base}/api/webhooks/mercadopago`;

  const preferenceBody = {
    items: [
      {
        id: `donacion-${amount}`,
        title: `Donación $${amount}`,
        quantity: 1,
        unit_price: amount,
        currency_id: "ARS",
      },
    ],
    statement_descriptor: "DONACION",
    metadata: {
      image_id: imageId || undefined,
      amount: String(amount),
    },
    external_reference: imageId ? `${imageId}:${amount}` : String(amount),
    back_urls: {
      success: successUrl,
      failure: `${failPath}?donacion=error`,
      pending: `${failPath}?donacion=pending`,
    },
    auto_return: "approved" as const,
    ...(notificationUrl ? { notification_url: notificationUrl } : {}),
  };

  try {
    let result;
    try {
      result = await preference.create({ body: preferenceBody });
    } catch (firstErr) {
      if (!isLocalUrl(base)) throw firstErr;
      const { back_urls, auto_return, ...withoutReturn } = preferenceBody;
      void back_urls;
      void auto_return;
      result = await preference.create({ body: withoutReturn });
    }

    const checkoutUrl = result.init_point ?? result.sandbox_init_point;
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Mercado Pago no devolvió un link de pago" },
        { status: 502 },
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al crear el pago";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
