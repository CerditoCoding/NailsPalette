import { SITE_URL } from "@/lib/site";

/** Datos estructurados (schema.org) de la marca, para que buscadores como
 * Google puedan mostrar el nombre/logo/redes en resultados enriquecidos.
 * Se usa "Organization" y no "LocalBusiness" porque no hay una dirección
 * física pública que listar — se vende y se coordina el envío online. */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nails Palette",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    sameAs: ["https://www.instagram.com/nails_palette_/"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Datos estructurados de un producto puntual, para la página de detalle. */
export function ProductJsonLd({
  name,
  description,
  image,
  price,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price,
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
