import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "Falta MERCADOPAGO_ACCESS_TOKEN. Agregala en .env.local y reiniciá el servidor.",
      },
      { status: 500 },
    );
  }

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

  const origin = new URL(request.url).origin;
  const returnPath = body.imageId
    ? `${origin}/detalle/${body.imageId}`
    : origin;
  const isLocal =
    origin.includes("localhost") || origin.includes("127.0.0.1");

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
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
        ...(isLocal
          ? {}
          : {
              back_urls: {
                success: `${returnPath}?donacion=ok`,
                failure: `${returnPath}?donacion=error`,
                pending: `${returnPath}?donacion=pending`,
              },
              auto_return: "approved" as const,
            }),
      },
    });

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
