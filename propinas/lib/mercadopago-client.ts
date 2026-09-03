import { MercadoPagoConfig } from "mercadopago";

export function getMercadoPagoAccessToken() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "Falta MERCADOPAGO_ACCESS_TOKEN. Agregala en .env.local y en Vercel.",
    );
  }
  return accessToken;
}

export function getMercadoPagoClient() {
  return new MercadoPagoConfig({ accessToken: getMercadoPagoAccessToken() });
}
