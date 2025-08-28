export type LiquidexData = {
  exchange: string;
  pair: string;
  generated_volume: number;
  balance_usdt: number;
  balance_token: number;
  deployed_buy: number;
  deployed_sell: number;
  estimated_fee: number;
  internal_pricing: number;
  mm_depth_plus_2: number;
  mm_depth_minus_2: number;
  organic_depth_plus_2: number;
  organic_depth_sell_2: number;
  spread: number;
  avg_24h_price: number;
  volume_24h_statistic: string[];
  spread_24h_statistic: number[];
  mm_depth_plus_2_24h_statistic: number[];
  mm_depth_minus_2_24h_statistic: number[];
  organic_depth_plus_2_24h_statistic: number[];
  organic_depth_minus_2_24h_statistic: number[];
  usdt_balance_24h_statistic: number[];
  token_balance_24h_statistic: number[];
};

export type ExchangeMetric = {
  id?: number;
  exchange: string;
  pair: string;
  current_price: number;
  last_vol_24h: number;
  mm_depth_plus_2: number;
  mm_depth_minus_2: number;
  organic_depth_plus_2: number;
  organic_depth_minus_2: number;
  created_at?: string;
};

export type PercentageChanges = {
  price_change: number;
  volume_change: number;
  mm_depth_plus_2_change: number;
  mm_depth_minus_2_change: number;
  organic_depth_plus_2_change: number;
  organic_depth_minus_2_change: number;
};
