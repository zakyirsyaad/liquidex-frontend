import { useEffect, useState } from "react";
import { saveMetricsToSupabase } from "@/lib/autoSaveMetrics";

export function useGetKOMData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/liquidex", {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);

      // Auto-save metrics to Supabase
      if (json && Array.isArray(json)) {
        try {
          await saveMetricsToSupabase(json);
        } catch (error) {
          console.error("Failed to save KOM metrics:", error);
        }
      }
    }

    fetchData();
  }, []);

  return { data };
}

export function useGetBBAData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/liquidex/bba", {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);

      // Auto-save metrics to Supabase
      if (json && Array.isArray(json)) {
        try {
          await saveMetricsToSupabase(json);
        } catch (error) {
          console.error("Failed to save BBA metrics:", error);
        }
      }
    }

    fetchData();
  }, []);

  return { data };
}
