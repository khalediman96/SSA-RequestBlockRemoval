/** Demo helper: days since block start (dd/mm/yyyy). */
export function daysSinceBlockStart(blockStart: string, ref = new Date()): string | null {
  const m = blockStart.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const start = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const diff = Math.floor((ref.getTime() - start.getTime()) / 86400000);
  if (diff < 0) return null;
  return `(${diff} days)`;
}