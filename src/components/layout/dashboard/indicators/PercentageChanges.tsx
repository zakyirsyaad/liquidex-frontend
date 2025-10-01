import React from "react";
import { useMetrics } from "@/hook/useMetrics";
import { useExchangeStore } from "@/store/exchangeStore";
import { PercentageIndicator } from "@/components/ui/PercentageIndicator";
import { Card } from "@/components/ui/card";

export default function PercentageChanges() {
  const selected = useExchangeStore((s) => s.selectedExchange);
  const filteredData = useExchangeStore((s) => s.filteredData);
  const data = filteredData;
  const selectedData = data.find((d) => d.exchange === selected);

  const { percentageChanges, loading } = useMetrics(
    selectedData?.exchange || "",
    selectedData?.pair || ""
  );

  if (!selectedData) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">24h Changes</h3>
        <p className="text-gray-500">Select an exchange to view changes</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">24h Changes</h3>
        <p className="text-gray-500">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3">24h Changes</h3>
      <div className="space-y-2">
        {percentageChanges ? (
          <>
            <PercentageIndicator
              value={percentageChanges.price_change}
              label="Price"
            />
            <PercentageIndicator
              value={percentageChanges.volume_change}
              label="Volume"
            />
            <PercentageIndicator
              value={percentageChanges.mm_depth_plus_2_change}
              label="Depth +"
            />
            <PercentageIndicator
              value={percentageChanges.mm_depth_minus_2_change}
              label="Depth -"
            />
          </>
        ) : (
          <p className="text-gray-500">No historical data available</p>
        )}
      </div>
    </Card>
  );
}
