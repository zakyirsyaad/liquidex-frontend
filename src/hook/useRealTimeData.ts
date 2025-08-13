import { useEffect, useState, useRef, useCallback } from "react";
import { useExchangeStore } from "@/store/exchangeStore";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";
import { useWalletAccess } from "./useWalletAccess";

interface UseRealTimeDataOptions {
  interval?: number; // polling interval in milliseconds
  enabled?: boolean; // whether real-time updates are enabled
}

export function useRealTimeData(options: UseRealTimeDataOptions = {}) {
  const { interval = 30000, enabled = true } = options; // default 30 seconds
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

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
          setData(komJson);

          // Auto-save KOM metrics to Supabase
          try {
            await saveMetricsToSupabase(komJson);
          } catch (saveError) {
            console.error("Failed to save KOM metrics:", saveError);
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
          setBBAData(bbaJson);

          // Auto-save BBA metrics to Supabase
          try {
            await saveMetricsToSupabase(bbaJson);
          } catch (saveError) {
            console.error("Failed to save BBA metrics:", saveError);
          }
        }
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [
    setData,
    setBBAData,
    walletAccess.hasKOMAccess,
    walletAccess.hasBBAAccess,
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

  // Set up polling
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
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    enabled,
    interval,
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
    refetch: fetchData,
    walletAccess,
  };
}
