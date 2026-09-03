import { Payment } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/mercadopago-client";
import { getSupabaseAdminServerClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseImageId(
  metadata: Record<string, unknown> | null | undefined,
  externalReference: string | null | undefined,
) {
  const fromMeta = metadata?.image_id;
  if (typeof fromMeta === "string" && UUID_RE.test(fromMeta)) {
    return fromMeta;
  }

  const fromRef = externalReference?.split(":")[0];
  if (fromRef && UUID_RE.test(fromRef)) return fromRef;
  return null;
}

export async function saveMercadoPagoPayment(paymentId: string) {
  const client = getMercadoPagoClient();
  const paymentApi = new Payment(client);
  const payment = await paymentApi.get({
    id: /^\d+$/.test(paymentId) ? Number(paymentId) : paymentId,
  });

  const status = String(payment.status ?? "");
  const amount = Number(payment.transaction_amount ?? 0);
  const metadata = (payment.metadata ?? null) as
    | Record<string, unknown>
    | null;
  const imageId = parseImageId(metadata, payment.external_reference);

  const paymentExtra = payment as typeof payment & { preference_id?: string };

  const supabase = getSupabaseAdminServerClient();
  const { error } = await supabase.from("donations").upsert(
    {
      mp_payment_id: String(payment.id),
      mp_preference_id: paymentExtra.preference_id
        ? String(paymentExtra.preference_id)
        : null,
      image_id: imageId,
      amount,
      currency: payment.currency_id || "ARS",
      status,
      payer_email: payment.payer?.email || null,
      payment_type: payment.payment_type_id || null,
      raw: JSON.parse(JSON.stringify(payment)) as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "mp_payment_id" },
  );

  if (error) {
    throw new Error(error.message);
  }

  return { status, amount, paymentId: String(payment.id) };
}
