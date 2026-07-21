/**
 * Calculates the total number of clients who accelerated their business.
 * Base count: 154 clients on 2026-07-21.
 * Increases by 2 every day automatically.
 */
export function getAcceleratedClientsCount(): number {
  const baseCount = 154;
  const baseDate = new Date("2026-07-21T00:00:00Z").getTime();
  const now = new Date().getTime();
  const diffDays = Math.max(0, Math.floor((now - baseDate) / (1000 * 60 * 60 * 24)));
  return baseCount + (diffDays * 2);
}
