/**
 * Envío de mails transaccionales (confirmación de pedido, cambios de
 * estado) vía Resend. Es opcional: si `RESEND_API_KEY`/`RESEND_FROM_EMAIL`
 * no están cargadas, no hace nada (en silencio, sin loguear, porque ese es
 * el estado normal mientras no se consigue un dominio propio verificado).
 * Mismo patrón de apagado gracioso que `src/lib/micorreo.ts`.
 */
import { Resend } from "resend";
import { renderOrderEmailHtml } from "@/lib/emailTemplates";

type EmailConfig = { client: Resend; from: string };

function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return null;
  return { client: new Resend(apiKey), from };
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://nails-palette.vercel.app";
}

/** Nunca tira: si falla el envío, solo loguea. Un mail que falla no debe
 * romper la creación del pedido ni el cambio de estado. */
export async function sendOrderEmail(params: {
  to: string;
  subject: string;
  heading: string;
  orderNumber?: number;
  bodyLines: string[];
  ctaLabel: string;
  ctaUrl: string;
  closingLine?: string;
  statusBadge?: { label: string; bg: string; color: string };
}): Promise<void> {
  const config = getEmailConfig();
  if (!config) return;

  try {
    await config.client.emails.send({
      from: config.from,
      to: params.to,
      subject: params.subject,
      html: renderOrderEmailHtml(params),
    });
  } catch (err) {
    console.error("[Email] no se pudo enviar el mail:", err);
  }
}
