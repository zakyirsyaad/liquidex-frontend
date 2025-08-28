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
  mm_depth_buy: number;
  mm_depth_sell: number;
  organic_depth_buy: number;
  organic_depth_sell: number;
  spread: number;
  avg_24h_price: number;
  volume_24h_statistic: string[];
  spread_24h_statistic: number[];
  mm_depth_buy_24h_statistic: number[];
  mm_depth_sell_24h_statistic: number[];
  organic_depth_buy_24h_statistic: number[];
  organic_depth_sell_24h_statistic: number[];
  usdt_balance_24h_statistic: number[];
  token_balance_24h_statistic: number[];
};

export type ExchangeMetric = {
  id?: number;
  exchange: string;
  pair: string;
  current_price: number;
  last_vol_24h: number;
  mm_depth_buy: number;
  mm_depth_sell: number;
  organic_depth_buy: number;
  organic_depth_sell: number;
  created_at?: string;
};

export type PercentageChanges = {
  price_change: number;
  volume_change: number;
  mm_depth_buy_change: number;
  mm_depth_sell_change: number;
  organic_depth_buy_change: number;
  organic_depth_sell_change: number;
};
