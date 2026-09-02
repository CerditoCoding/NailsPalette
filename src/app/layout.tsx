import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Nails Palette | Uñas Press On en Argentina — Envíos a Todo el País";
const DESCRIPTION =
  "Uñas press on hechas a mano en Argentina. Diseños únicos, reutilizables y fáciles de aplicar. Comprá online con envíos a todo el país.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Nails Palette",
  },
  description: DESCRIPTION,
  // El meta tag "keywords" ya no influye en el posicionamiento de Google
  // (lo ignora hace más de una década) — se deja igual por si algún
  // buscador o directorio menor todavía lo lee. El trabajo real de
  // palabras clave pasa por el title/description de arriba y por el
  // contenido visible de cada página.
  keywords: [
    "press on",
    "uñas press on",
    "uñas postizas",
    "press on nails argentina",
    "envíos a todo el país",
    "uñas reutilizables",
    "nail art argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Nails Palette",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    // TODO: reemplazar por una foto real de un set de uñas cuando haya
    // una lista para usar como imagen de portada — por ahora usa el logo.
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#ec4899",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationJsonLd />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
