export const DEFAULT_THANKS_TITLE = "¡Gracias por tu apoyo!";
export const DEFAULT_THANKS_BODY =
  "Tu donación de {monto} fue recibida correctamente.";
export const DEFAULT_THANKS_MESSAGE = "Gracias por invitarme un café ☕💜";

export function applyThanksPlaceholders(
  text: string,
  amountLabel: string,
) {
  return text
    .replaceAll("{monto}", amountLabel)
    .replaceAll("{amount}", amountLabel);
}
