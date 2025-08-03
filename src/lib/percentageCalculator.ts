import { ExchangeMetric, PercentageChanges } from "./type";

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getPercentageChanges(
  metrics: ExchangeMetric[]
): PercentageChanges | null {
  if (metrics.length < 2) return null;

  const current = metrics[metrics.length - 1];
  const previous = metrics[0]; // 24 jam yang lalu

  return {
    price_change: calculatePercentageChange(
      current.current_price,
      previous.current_price
    ),
    volume_change: calculatePercentageChange(
      current.last_vol_24h,
      previous.last_vol_24h
    ),
    depth_plus_change: calculatePercentageChange(
      current.depth_plus,
      previous.depth_plus
    ),
    depth_minus_change: calculatePercentageChange(
      current.depth_minus,
      previous.depth_minus
    ),
  };
}
