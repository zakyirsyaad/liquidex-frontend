import { supabase } from "./supabase";
import { ExchangeData } from "@/store/exchangeStore";

export async function saveMetricsToSupabase(exchangeData: ExchangeData[]) {
  try {
    const metricsToInsert = exchangeData.map((exchange) => ({
      exchange: exchange.exchange,
      pair: exchange.pair,
      current_price: exchange.internal_pricing,
      last_vol_24h: exchange.generated_volume,
      mm_depth_plus_2: exchange.mm_depth_plus_2,
      mm_depth_minus_2: exchange.mm_depth_minus_2,
      organic_depth_plus_2: exchange.organic_depth_plus_2,
      organic_depth_minus_2: exchange.organic_depth_minus_2,
    }));

    const { data, error } = await supabase
      .from("exchange_metrics")
      .insert(metricsToInsert)
      .select();

    if (error) throw error;

    console.log("Metrics saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error saving metrics:", error);
    throw error;
  }
}

// Fungsi untuk menyimpan single metric
export async function saveSingleMetric(exchange: ExchangeData) {
  try {
    const { data, error } = await supabase
      .from("exchange_metrics")
      .insert([
        {
          exchange: exchange.exchange,
          pair: exchange.pair,
          current_price: exchange.internal_pricing,
          last_vol_24h: exchange.generated_volume,
          mm_depth_plus_2: exchange.mm_depth_plus_2,
          mm_depth_minus_2: exchange.mm_depth_minus_2,
          organic_depth_plus_2: exchange.organic_depth_plus_2,
          organic_depth_minus_2: exchange.organic_depth_minus_2,
        },
      ])
      .select();

    if (error) throw error;

    console.log("Single metric saved successfully:", data);
    return data[0];
  } catch (error) {
    console.error("Error saving single metric:", error);
    throw error;
  }
}
