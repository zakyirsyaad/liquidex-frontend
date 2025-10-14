import { useEffect, useState, useRef, useCallback } from "react";
import { useExchangeStore, ExchangeData } from "@/store/exchangeStore";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";
import { useWalletAccess } from "./useWalletAccess";

interface OptimizedRealTimeDataOptions {
  baseInterval?: number; // base polling interval in milliseconds
  maxInterval?: number; // maximum polling interval
  minInterval?: number; // minimum polling interval
  enabled?: boolean;
  adaptiveInterval?: boolean; // enable adaptive interval based on data changes
}

export function useOptimizedRealTimeData(
  options: OptimizedRealTimeDataOptions = {}
) {
  const {
    baseInterval = 30000,
    maxInterval = 120000,
    minInterval = 10000,
    enabled = true,
    adaptiveInterval = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] = useState(baseInterval);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataHashRef = useRef<string>("");
  const consecutiveNoChangeRef = useRef(0);
  const lastFetchTimeRef = useRef<number>(0);

  const setData = useExchangeStore((state) => state.setData);
  const setBBAData = useExchangeStore((state) => state.setBBAData);
  const setWalletAccess = useExchangeStore((state) => state.setWalletAccess);

  // Get wallet access
  const walletAccess = useWalletAccess();

  // Update wallet access in store when it changes
  useEffect(() => {
    setWalletAccess({
      hasKOMAccess: walletAccess.hasKOMAccess,
      hasBBAAccess: walletAccess.hasBBAAccess,
      accessibleExchanges: walletAccess.accessibleExchanges,
    });
  }, [walletAccess, setWalletAccess]);

  // Simple hash function for data comparison
  const getDataHash = useCallback((data: unknown[]): string => {
    if (!data || data.length === 0) return "";
    return JSON.stringify(
      data.map((item) => {
        const record = item as Record<string, unknown>;
        return {
          // Only include key fields that indicate data changes
          exchange: record.exchange,
          timestamp: record.timestamp || record.created_at,
          price: record.current_price,
          volume: record.volume_24h,
          balance: record.usdt_balance,
        };
      })
    );
  }, []);

  // Adaptive interval calculation
  const calculateNextInterval = useCallback(
    (hasDataChanged: boolean): number => {
      if (!adaptiveInterval) return baseInterval;

      if (hasDataChanged) {
        // Data changed, reset to base interval and reset consecutive counter
        consecutiveNoChangeRef.current = 0;
        return baseInterval;
      } else {
        // No data change, increase interval gradually
        consecutiveNoChangeRef.current++;

        // Exponential backoff with cap
        const multiplier = Math.min(
          Math.pow(1.5, consecutiveNoChangeRef.current),
          4
        );
        const newInterval = Math.min(baseInterval * multiplier, maxInterval);

        return Math.max(newInterval, minInterval);
      }
    },
    [adaptiveInterval, baseInterval, maxInterval, minInterval]
  );

  const fetchData = useCallback(async () => {
    const startTime = Date.now();

    try {
      setIsLoading(true);
      setError(null);

      // Rate limiting - prevent too frequent requests
      if (startTime - lastFetchTimeRef.current < minInterval) {
        console.log("Rate limiting: skipping fetch request");
        return;
      }
      lastFetchTimeRef.current = startTime;

      let hasDataChanged = false;

      // Only fetch data based on wallet access
      if (walletAccess.hasKOMAccess) {
        const komRes = await fetch("/api/liquidex", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!komRes.ok) {
          throw new Error(`KOM HTTP error! status: ${komRes.status}`);
        }

        const komJson = await komRes.json();

        if (komJson && Array.isArray(komJson)) {
          const newHash = getDataHash(komJson);
          const oldHash = lastDataHashRef.current;

          if (newHash !== oldHash) {
            console.log("KOM Data changed - updating");
            hasDataChanged = true;
            lastDataHashRef.current = newHash;

            // Transform field names to match ExchangeData type
            const transformedData = komJson.map(
              (item: Record<string, unknown>) => ({
                ...item,
                mm_depth_minus_2_24h_statistic:
                  item.depth_minus_2_24h_statistic || [],
                mm_depth_plus_2_24h_statistic:
                  item.depth_plus_2_24h_statistic || [],
                organic_depth_minus_2_24h_statistic:
                  item.organic_depth_minus_2_24h_statistic || [],
                organic_depth_plus_2_24h_statistic:
                  item.organic_depth_plus_2_24h_statistic || [],
              })
            ) as ExchangeData[];

            setData(transformedData);

            // Auto-save KOM metrics to Supabase
            try {
              await saveMetricsToSupabase(transformedData);
            } catch (saveError) {
              console.error("Failed to save KOM metrics:", saveError);
            }
          } else {
            console.log("KOM Data unchanged - skipping update");
          }
        }
      }

      if (walletAccess.hasBBAAccess) {
        const bbaRes = await fetch("/api/liquidex/bba", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!bbaRes.ok) {
          throw new Error(`BBA HTTP error! status: ${bbaRes.status}`);
        }

        const bbaJson = await bbaRes.json();

        if (bbaJson && Array.isArray(bbaJson)) {
          const newHash = getDataHash(bbaJson);

          if (newHash !== lastDataHashRef.current) {
            console.log("BBA Data changed - updating");
            hasDataChanged = true;
            lastDataHashRef.current = newHash;

            // Transform field names to match ExchangeData type
            const transformedData = bbaJson.map(
              (item: Record<string, unknown>) => ({
                ...item,
                mm_depth_minus_2_24h_statistic:
                  item.depth_minus_2_24h_statistic || [],
                mm_depth_plus_2_24h_statistic:
                  item.depth_plus_2_24h_statistic || [],
                organic_depth_minus_2_24h_statistic:
                  item.organic_depth_minus_2_24h_statistic || [],
                organic_depth_plus_2_24h_statistic:
                  item.organic_depth_plus_2_24h_statistic || [],
              })
            ) as ExchangeData[];

            setBBAData(transformedData);

            // Auto-save BBA metrics to Supabase
            try {
              await saveMetricsToSupabase(transformedData);
            } catch (saveError) {
              console.error("Failed to save BBA metrics:", saveError);
            }
          } else {
            console.log("BBA Data unchanged - skipping update");
          }
        }
      }

      // Update interval based on data changes
      const nextInterval = calculateNextInterval(hasDataChanged);
      if (nextInterval !== currentInterval) {
        setCurrentInterval(nextInterval);
        console.log(`Adaptive interval updated: ${nextInterval}ms`);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");

      // On error, increase interval to reduce server load
      const errorInterval = Math.min(currentInterval * 2, maxInterval);
      setCurrentInterval(errorInterval);
    } finally {
      setIsLoading(false);
    }
  }, [
    setData,
    setBBAData,
    walletAccess,
    getDataHash,
    calculateNextInterval,
    currentInterval,
    maxInterval,
    minInterval,
  ]);

  // Initial fetch
  useEffect(() => {
    if (
      walletAccess.isConnected &&
      (walletAccess.hasKOMAccess || walletAccess.hasBBAAccess)
    ) {
      fetchData();
    }
  }, [
    fetchData,
    walletAccess.isConnected,
    walletAccess.hasKOMAccess,
    walletAccess.hasBBAAccess,
  ]);

  // Set up adaptive polling
  useEffect(() => {
    if (
      !enabled ||
      !walletAccess.isConnected ||
      (!walletAccess.hasKOMAccess && !walletAccess.hasBBAAccess)
    ) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      fetchData();
    }, currentInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    enabled,
    currentInterval,
    fetchData,
    walletAccess.isConnected,
    walletAccess.hasKOMAccess,
    walletAccess.hasBBAAccess,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    lastUpdate,
    error,
    currentInterval,
    refetch: fetchData,
    walletAccess,
  };
}
