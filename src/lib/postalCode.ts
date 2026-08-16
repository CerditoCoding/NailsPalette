/** Extrae la parte numérica de un código postal argentino, ya sea el
 * formato viejo ("1425") o el CPA nuevo ("C1425DJP"). Devuelve null si
 * no se puede interpretar. */
export function parsePostalCodeNumber(input: string): number | null {
  const match = input.match(/\d{3,4}/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}
