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
  organic_depth_plus_2_24h_statistic: number[]; // new field
  organic_depth_minus_2_24h_statistic: number[]; // new field
  usdt_balance_24h_statistic: number[];
  token_balance_24h_statistic: number[];
};

export type OverviewData = {
  total_usdt_balance: number;
  total_token_balance: number;
  total_deployed_buy: number;
  total_deployed_sell: number;
  total_estimated_fee: number;
  avg_mm_depth_plus_2: number;
  avg_mm_depth_minus_2: number;
  avg_organic_depth_plus_2: number;
  avg_organic_depth_minus_2: number;
  avg_spread: number;
  avg_internal_pricing: number;
  total_generated_volume: number;
  avg_24h_price: number;
  combined_volume_24h_statistic: string[];
  combined_spread_24h_statistic: number[];
  combined_mm_depth_plus_2_24h_statistic: number[];
  combined_mm_depth_minus_2_24h_statistic: number[];
  combined_organic_depth_plus_2_24h_statistic: number[];
  combined_organic_depth_minus_2_24h_statistic: number[];
  combined_usdt_balance_24h_statistic: number[];
  combined_token_balance_24h_statistic: number[];
  exchange_count: number;
  exchanges: string[];
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
  getOverviewData: () => OverviewData | null;
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
  getOverviewData: () => {
    const state = get();
    const data = state.getCurrentData();

    if (!data || data.length === 0) return null;

    // Calculate totals and averages
    const total_usdt_balance = data.reduce((sum, item) => {
      const balance =
        typeof item.balance_usdt === "string"
          ? parseFloat(item.balance_usdt)
          : Number(item.balance_usdt);
      return sum + (isNaN(balance) ? 0 : balance);
    }, 0);
    const total_token_balance = data.reduce((sum, item) => {
      const balance =
        typeof item.balance_token === "string"
          ? parseFloat(item.balance_token)
          : Number(item.balance_token);
      return sum + (isNaN(balance) ? 0 : balance);
    }, 0);
    const total_deployed_buy = data.reduce((sum, item) => {
      const deployed =
        typeof item.deployed_buy === "string"
          ? parseFloat(item.deployed_buy)
          : Number(item.deployed_buy);
      return sum + (isNaN(deployed) ? 0 : deployed);
    }, 0);
    const total_deployed_sell = data.reduce((sum, item) => {
      const deployed =
        typeof item.deployed_sell === "string"
          ? parseFloat(item.deployed_sell)
          : Number(item.deployed_sell);
      return sum + (isNaN(deployed) ? 0 : deployed);
    }, 0);
    const total_estimated_fee = data.reduce((sum, item) => {
      const fee =
        typeof item.estimated_fee === "string"
          ? parseFloat(item.estimated_fee)
          : Number(item.estimated_fee);
      return sum + (isNaN(fee) ? 0 : fee);
    }, 0);
    const total_generated_volume = data.reduce((sum, item) => {
      const volume =
        typeof item.generated_volume === "string"
          ? parseFloat(item.generated_volume)
          : Number(item.generated_volume);
      return sum + (isNaN(volume) ? 0 : volume);
    }, 0);

    // Calculate averages
    const avg_mm_depth_plus_2 =
      data.reduce((sum, item) => sum + item.mm_depth_plus_2, 0) / data.length;
    const avg_mm_depth_minus_2 =
      data.reduce((sum, item) => sum + item.mm_depth_minus_2, 0) / data.length;
    const avg_organic_depth_plus_2 =
      data.reduce((sum, item) => sum + item.organic_depth_plus_2, 0) /
      data.length;
    const avg_organic_depth_minus_2 =
      data.reduce((sum, item) => sum + item.organic_depth_minus_2, 0) /
      data.length;
    const avg_spread =
      data.reduce((sum, item) => sum + item.spread, 0) / data.length;
    const avg_internal_pricing =
      data.reduce((sum, item) => sum + item.internal_pricing, 0) / data.length;
    const avg_24h_price =
      data.reduce((sum, item) => sum + item.avg_24h_price, 0) / data.length;

    // Combine 24h statistics arrays
    const combineArrays = (arrays: (number[] | undefined)[]) => {
      // Filter out undefined/null arrays
      const validArrays = arrays.filter(
        (arr): arr is number[] =>
          arr !== undefined && arr !== null && Array.isArray(arr)
      );

      if (validArrays.length === 0) return [];

      const maxLength = Math.max(...validArrays.map((arr) => arr.length));
      const result: number[] = [];
      for (let i = 0; i < maxLength; i++) {
        let sum = 0;
        let count = 0;
        validArrays.forEach((arr) => {
          if (arr[i] !== undefined) {
            sum += arr[i];
            count++;
          }
        });
        result.push(count > 0 ? sum / count : 0);
      }
      return result;
    };

    const combineStringArrays = (arrays: (string[] | undefined)[]) => {
      // Filter out undefined/null arrays
      const validArrays = arrays.filter(
        (arr): arr is string[] =>
          arr !== undefined && arr !== null && Array.isArray(arr)
      );

      if (validArrays.length === 0) return [];

      const maxLength = Math.max(...validArrays.map((arr) => arr.length));
      const result: string[] = [];
      for (let i = 0; i < maxLength; i++) {
        const values = validArrays
          .map((arr) => arr[i])
          .filter((val) => val !== undefined);
        result.push(values.length > 0 ? values.join(", ") : "");
      }
      return result;
    };

    const combined_volume_24h_statistic = combineStringArrays(
      data.map((item) => item.volume_24h_statistic)
    );
    const combined_spread_24h_statistic = combineArrays(
      data.map((item) => item.spread_24h_statistic)
    );
    const combined_mm_depth_plus_2_24h_statistic = combineArrays(
      data.map((item) => item.mm_depth_plus_2_24h_statistic)
    );
    const combined_mm_depth_minus_2_24h_statistic = combineArrays(
      data.map((item) => item.mm_depth_minus_2_24h_statistic)
    );
    const combined_organic_depth_plus_2_24h_statistic = combineArrays(
      data.map((item) => item.organic_depth_plus_2_24h_statistic)
    );
    const combined_organic_depth_minus_2_24h_statistic = combineArrays(
      data.map((item) => item.organic_depth_minus_2_24h_statistic)
    );
    const combined_usdt_balance_24h_statistic = combineArrays(
      data.map((item) => item.usdt_balance_24h_statistic)
    );
    const combined_token_balance_24h_statistic = combineArrays(
      data.map((item) => item.token_balance_24h_statistic)
    );

    const exchanges = Array.from(new Set(data.map((item) => item.exchange)));

    return {
      total_usdt_balance,
      total_token_balance,
      total_deployed_buy,
      total_deployed_sell,
      total_estimated_fee,
      avg_mm_depth_plus_2,
      avg_mm_depth_minus_2,
      avg_organic_depth_plus_2,
      avg_organic_depth_minus_2,
      avg_spread,
      avg_internal_pricing,
      total_generated_volume,
      avg_24h_price,
      combined_volume_24h_statistic,
      combined_spread_24h_statistic,
      combined_mm_depth_plus_2_24h_statistic,
      combined_mm_depth_minus_2_24h_statistic,
      combined_organic_depth_plus_2_24h_statistic,
      combined_organic_depth_minus_2_24h_statistic,
      combined_usdt_balance_24h_statistic,
      combined_token_balance_24h_statistic,
      exchange_count: exchanges.length,
      exchanges,
    };
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
