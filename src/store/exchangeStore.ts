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
