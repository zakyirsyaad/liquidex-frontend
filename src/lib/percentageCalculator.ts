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
    mm_depth_plus_2_change: calculatePercentageChange(
      current.mm_depth_plus_2,
      previous.mm_depth_plus_2
    ),
    mm_depth_minus_2_change: calculatePercentageChange(
      current.mm_depth_minus_2,
      previous.mm_depth_minus_2
    ),
    organic_depth_plus_2_change: calculatePercentageChange(
      current.organic_depth_plus_2,
      previous.organic_depth_plus_2
    ),
    organic_depth_minus_2_change: calculatePercentageChange(
      current.organic_depth_minus_2,
      previous.organic_depth_minus_2
    ),
  };
}
