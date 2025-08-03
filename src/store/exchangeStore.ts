import { create } from "zustand";

export type ExchangeData = {
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

export type DashboardStore = {
  data: ExchangeData[];
  setData: (d: ExchangeData[]) => void;
  selectedExchange: string | null;
  setSelectedExchange: (e: string | null) => void;
};

export const useExchangeStore = create<DashboardStore>((set) => ({
  data: [],
  setData: (d) => set({ data: d }),
  selectedExchange: null,
  setSelectedExchange: (e) => set({ selectedExchange: e }),
}));
