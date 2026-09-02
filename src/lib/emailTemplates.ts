import { formatOrderNumber } from "@/lib/orderStatus";

/**
 * Shell de mail transaccional con estilos inline (nada de clases de
 * Tailwind ni degradés CSS: los clientes de mail no los soportan de forma
 * confiable). No hay ningún logo en formato imagen en el proyecto, así que
 * se usa una banda de color sólido con el nombre de la marca como isotipo.
 */
export function renderOrderEmailHtml(params: {
  heading: string;
  /** Si se pasa, se muestra "Pedido #00007" debajo del título. */
  orderNumber?: number;
  bodyLines: string[];
  ctaLabel: string;
  ctaUrl: string;
  /** Línea opcional que aparece después del botón, antes de la firma. */
  closingLine?: string;
  /** Si alguna línea de bodyLines/closingLine trae el token "{{status}}",
   * se reemplaza por este badge con el mismo color que su equivalente en
   * el admin, para que el estado resalte del resto del texto. */
  statusBadge?: { label: string; bg: string; color: string };
}): string {
  const { heading, orderNumber, bodyLines, ctaLabel, ctaUrl, closingLine, statusBadge } = params;

  const badgeHtml = statusBadge
    ? `<span style="display:inline-block;padding:2px 12px;border-radius:999px;background-color:${statusBadge.bg};color:${statusBadge.color};font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.3px;">${escapeHtml(statusBadge.label)}</span>`
    : "";

  const paragraph = (line: string) => {
    const escaped = escapeHtml(line);
    const withBadge = statusBadge ? escaped.split("{{status}}").join(badgeHtml) : escaped;
    return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">${withBadge}</p>`;
  };

  const bodyHtml = bodyLines.map(paragraph).join("");
  const closingHtml = closingLine ? paragraph(closingLine) : "";
  const orderNumberHtml =
    orderNumber != null
      ? `<p style="margin:0 0 16px;font-size:13px;font-weight:bold;color:#ec4899;text-transform:uppercase;letter-spacing:0.4px;">Pedido #${formatOrderNumber(orderNumber)}</p>`
      : "";

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px 12px;background-color:#fdf2f8;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background-color:#ec4899;padding:28px 24px;text-align:center;">
          <span style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">💅 Nails Palette</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:#18181b;">${escapeHtml(heading)}</h1>
          ${orderNumberHtml}
          ${bodyHtml}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr>
              <td style="border-radius:999px;background-color:#ec4899;">
                <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(ctaLabel)}</a>
              </td>
            </tr>
          </table>
          ${closingHtml}
          <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">Nails Palette.</p>
          <p style="margin:16px 0 0;padding-top:16px;border-top:1px solid #f4f4f5;font-size:12px;font-style:italic;color:#c1c1c6;">
            Este es un mensaje automático, por favor no respondas a este correo.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
