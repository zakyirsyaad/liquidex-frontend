import React from "react";
import { useExchangeStore } from "@/store/exchangeStore";
import { PercentageIndicator } from "@/components/ui/PercentageIndicator";
import { Card } from "@/components/ui/card";

export default function OverviewPercentageChanges() {
  const getFilteredOverviewData = useExchangeStore(
    (s) => s.getFilteredOverviewData
  );
  const overviewData = getFilteredOverviewData();

  if (!overviewData) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">24h Average Changes</h3>
        <p className="text-gray-500">No data available</p>
      </Card>
    );
  }

  // Calculate average percentage changes based on combined data
  // For overview, we'll show simplified indicators based on the combined statistics
  const calculateAverageChange = (statistics: number[]) => {
    if (!statistics || statistics.length < 2) return 0;
    const first = statistics[0];
    const last = statistics[statistics.length - 1];
    if (first === 0) return 0; // Avoid division by zero
    return ((last - first) / first) * 100;
  };

  const priceChange = calculateAverageChange(
    overviewData.combined_spread_24h_statistic
  );
  const volumeChange = calculateAverageChange(
    overviewData.combined_volume_24h_statistic.map((v) => parseFloat(v))
  );
  const mmDepthPlusChange = calculateAverageChange(
    overviewData.combined_mm_depth_plus_2_24h_statistic
  );
  const mmDepthMinusChange = calculateAverageChange(
    overviewData.combined_mm_depth_minus_2_24h_statistic
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3">24h Average Changes</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Across {overviewData.exchange_count} exchanges
      </p>
      <div className="space-y-2">
        <PercentageIndicator value={priceChange} label="Avg Price" />
        <PercentageIndicator value={volumeChange} label="Avg Volume" />
        <PercentageIndicator value={mmDepthPlusChange} label="Avg Depth +" />
        <PercentageIndicator value={mmDepthMinusChange} label="Avg Depth -" />
      </div>
    </Card>
  );
}
