/** URL pública del sitio, usada tanto para armar links en los mails
 * (`getSiteUrl()` en `src/lib/email.ts`) como para `metadataBase` y las URLs
 * absolutas de SEO (OpenGraph, canonical, sitemap). Única fuente de verdad
 * para no tener el mismo fallback duplicado en dos lugares.
 *
 * Usa "www" porque en Vercel el dominio apex (nailspalette.com.ar) redirige
 * a www.nailspalette.com.ar — el canonical/OG/JSON-LD tiene que apuntar a la
 * URL que el sitio realmente sirve, no a la que redirige. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nailspalette.com.ar";
