import { useEffect, useState, useRef, useCallback } from "react";
import { useExchangeStore } from "@/store/exchangeStore";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";

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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/liquidex", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json && Array.isArray(json)) {
        setData(json);
        setLastUpdate(new Date());

        // Auto-save metrics to Supabase
        try {
          await saveMetricsToSupabase(json);
        } catch (saveError) {
          console.error("Failed to save metrics:", saveError);
        }
      }
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [setData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up polling
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, interval, fetchData]);

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
  };
}
