function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

// wa.me solo acepta dígitos (sin "+", espacios ni guiones), así que
// normalizamos acá sin importar cómo se haya cargado la env var.
export const WHATSAPP_NUMBER = onlyDigits(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000"
);

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link to a specific phone number (e.g. to contact a customer), not the business number. */
export function buildWhatsappLinkTo(phone: string, message: string) {
  return `https://wa.me/${onlyDigits(phone)}?text=${encodeURIComponent(message)}`;
}
