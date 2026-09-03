export function formatArs(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseDonationAmount(value: string | null | undefined) {
  if (!value) return null;
  const amount = Number(value);
  if (amount !== 1000 && amount !== 2000 && amount !== 3000) return null;
  return amount;
}
