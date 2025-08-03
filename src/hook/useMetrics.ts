import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getPercentageChanges } from "@/lib/percentageCalculator";
import { ExchangeMetric, PercentageChanges } from "@/lib/type";

export function useMetrics(exchange: string, pair: string) {
  const [metrics, setMetrics] = useState<ExchangeMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [percentageChanges, setPercentageChanges] =
    useState<PercentageChanges | null>(null);

  useEffect(() => {
    if (!exchange || !pair) return;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("exchange_metrics")
          .select("*")
          .eq("exchange", exchange)
          .eq("pair", pair)
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          )
          .order("created_at", { ascending: true });

        if (error) throw error;

        setMetrics(data || []);
        setPercentageChanges(getPercentageChanges(data || []));
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [exchange, pair]);

  return { metrics, loading, percentageChanges };
}
