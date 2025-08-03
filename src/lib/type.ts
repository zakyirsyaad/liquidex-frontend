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
  depth_plus_2: number;
  depth_minus_2: number;
  spread: number;
  avg_24h_price: number;
  volume_24h_statistic: string[];
  spread_24h_statistic: number[];
  depth_minus_2_24h_statistic: number[];
  depth_plus_2_24h_statistic: number[];
  usdt_balance_24h_statistic: number[];
  token_balance_24h_statistic: number[];
};

export type ExchangeMetric = {
  id?: number;
  exchange: string;
  pair: string;
  current_price: number;
  last_vol_24h: number;
  depth_plus: number;
  depth_minus: number;
  created_at?: string;
};

export type PercentageChanges = {
  price_change: number;
  volume_change: number;
  depth_plus_change: number;
  depth_minus_change: number;
};
