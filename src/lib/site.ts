/** URL pública del sitio, usada tanto para armar links en los mails
 * (`getSiteUrl()` en `src/lib/email.ts`) como para `metadataBase` y las URLs
 * absolutas de SEO (OpenGraph, canonical, sitemap). Única fuente de verdad
 * para no tener el mismo fallback duplicado en dos lugares. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nailspalette.com.ar";
