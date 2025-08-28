import { create } from "zustand";
import { ExchangeType } from "@/lib/config/WalletConfig";

export type ExchangeData = {
  exchange: string;
  pair: string;
  generated_volume: number;
  balance_usdt: number;
  balance_token: number;
  deployed_buy: number;
  deployed_sell: number;
  estimated_fee: number; // renamed from estimated_fee
  internal_pricing: number;
  mm_depth_plus_2: number; // MM Depth (buy)
  mm_depth_minus_2: number; // MM Depth (sell)
  organic_depth_plus_2: number; // Organic Depth (buy)
  organic_depth_minus_2: number; // Organic Depth (sell)
  spread: number;
  avg_24h_price: number;
  volume_24h_statistic: string[];
  spread_24h_statistic: number[];
  mm_depth_minus_2_24h_statistic: number[]; // updated from depth_minus_2_24h_statistic
  mm_depth_plus_2_24h_statistic: number[]; // updated from depth_plus_2_24h_statistic
  organic_depth_buy_24h_statistic: number[]; // new field
  organic_depth_sell_24h_statistic: number[]; // new field
  usdt_balance_24h_statistic: number[];
  token_balance_24h_statistic: number[];
};

export type DashboardStore = {
  data: ExchangeData[];
  bbaData: ExchangeData[];
  setData: (d: ExchangeData[]) => void;
  setBBAData: (d: ExchangeData[]) => void;
  selectedExchange: string | null;
  setSelectedExchange: (e: string | null) => void;
  selectedDataSource: "KOM" | "BBA";
  setSelectedDataSource: (source: "KOM" | "BBA") => void;
  getCurrentData: () => ExchangeData[];
  // Wallet access control
  walletAccess: {
    hasKOMAccess: boolean;
    hasBBAAccess: boolean;
    accessibleExchanges: ExchangeType[];
  };
  setWalletAccess: (access: {
    hasKOMAccess: boolean;
    hasBBAAccess: boolean;
    accessibleExchanges: ExchangeType[];
  }) => void;
  // Get filtered data based on wallet access
  getAccessibleData: () => ExchangeData[];
  getAccessibleDataSource: () => "KOM" | "BBA" | null;
};

export const useExchangeStore = create<DashboardStore>((set, get) => ({
  data: [],
  bbaData: [],
  setData: (d) => set({ data: d }),
  setBBAData: (d) => set({ bbaData: d }),
  selectedExchange: null,
  setSelectedExchange: (e) => set({ selectedExchange: e }),
  selectedDataSource: "KOM",
  setSelectedDataSource: (source) => set({ selectedDataSource: source }),
  getCurrentData: () => {
    const state = get();
    return state.selectedDataSource === "KOM" ? state.data : state.bbaData;
  },
  // Wallet access control
  walletAccess: {
    hasKOMAccess: false,
    hasBBAAccess: false,
    accessibleExchanges: [],
  },
  setWalletAccess: (access) => set({ walletAccess: access }),
  // Get filtered data based on wallet access
  getAccessibleData: () => {
    const state = get();
    const { hasKOMAccess, hasBBAAccess } = state.walletAccess;

    if (hasKOMAccess && hasBBAAccess) {
      // User has access to both, return current selected data
      return state.getCurrentData();
    } else if (hasKOMAccess) {
      // User only has KOM access
      return state.data;
    } else if (hasBBAAccess) {
      // User only has BBA access
      return state.bbaData;
    }

    // No access
    return [];
  },
  getAccessibleDataSource: () => {
    const state = get();
    const { hasKOMAccess, hasBBAAccess } = state.walletAccess;

    if (hasKOMAccess && hasBBAAccess) {
      // User has access to both, return current selection
      return state.selectedDataSource;
    } else if (hasKOMAccess) {
      // User only has KOM access
      return "KOM";
    } else if (hasBBAAccess) {
      // User only has BBA access
      return "BBA";
    }

    // No access
    return null;
  },
}));
