/**
 * Cliente de la API pública "MiCorreo" de Correo Argentino
 * (https://api.correoargentino.com.ar/micorreo/v1) para cotizar envíos en
 * vivo por código postal.
 *
 * Es opcional: si las variables de entorno no están cargadas, `quoteShipping`
 * devuelve `null` y quien llama debe recurrir al sistema de zonas manuales
 * (`ShippingZone`) como respaldo. Así el sitio nunca se rompe por falta de
 * credenciales, y en cuanto se cargan las variables en producción empieza a
 * cotizar en vivo sin tocar código.
 */

type MiCorreoConfig = {
  baseUrl: string;
  user: string;
  password: string;
  customerId: string;
  originPostalCode: string;
};

type MiCorreoPackage = {
  weight: number;
  height: number;
  width: number;
  length: number;
};

export type ShippingQuote = { label: string; price: number };

const DEFAULT_BASE_URL = "https://api.correoargentino.com.ar/micorreo/v1";

// Token cacheado en memoria del proceso: evita pedir uno nuevo en cada
// request mientras la función serverless siga "caliente". Es solo una
// optimización best-effort, no persiste entre cold starts.
let cachedToken: { token: string; expiresAt: number } | null = null;
const TOKEN_TTL_MS = 20 * 60 * 1000;

function getConfig(): MiCorreoConfig | null {
  const user = process.env.MICORREO_USER;
  const password = process.env.MICORREO_PASSWORD;
  const customerId = process.env.MICORREO_CUSTOMER_ID;
  const originPostalCode = process.env.MICORREO_ORIGIN_POSTAL_CODE;

  if (!user || !password || !customerId || !originPostalCode) return null;

  return {
    baseUrl: process.env.MICORREO_BASE_URL || DEFAULT_BASE_URL,
    user,
    password,
    customerId,
    originPostalCode,
  };
}

function getPackageDimensions(): MiCorreoPackage {
  // Paquete tipo "sobre" fijo para todos los pedidos: los press on nails
  // pesan y miden prácticamente lo mismo sin importar el producto.
  return {
    weight: Number(process.env.MICORREO_PACKAGE_WEIGHT_G) || 300,
    height: Number(process.env.MICORREO_PACKAGE_HEIGHT_CM) || 3,
    width: Number(process.env.MICORREO_PACKAGE_WIDTH_CM) || 20,
    length: Number(process.env.MICORREO_PACKAGE_LENGTH_CM) || 25,
  };
}

async function getToken(config: MiCorreoConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${config.user}:${config.password}`).toString("base64");
  const res = await fetch(`${config.baseUrl}/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    throw new Error(`MiCorreo: no se pudo autenticar (status ${res.status})`);
  }

  const data = (await res.json()) as { token: string };
  cachedToken = { token: data.token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return data.token;
}

/** Cotiza un envío a domicilio por CP contra la API de MiCorreo.
 * Devuelve `null` si no está configurada o si la llamada falla, para que
 * quien la use pueda recurrir al sistema de zonas manuales sin romperse. */
export async function quoteShipping(postalCodeDestination: string): Promise<ShippingQuote | null> {
  const config = getConfig();
  if (!config) return null;

  try {
    const token = await getToken(config);
    const res = await fetch(`${config.baseUrl}/rates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: config.customerId,
        postalCodeOrigin: config.originPostalCode,
        postalCodeDestination,
        deliveredType: "D",
        dimensions: getPackageDimensions(),
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      rates?: { productName?: string; price?: number }[];
    };
    const rate = data.rates?.[0];
    if (!rate || typeof rate.price !== "number") return null;

    return { label: rate.productName ?? "Correo Argentino", price: Math.round(rate.price) };
  } catch {
    return null;
  }
}
