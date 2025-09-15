import React from "react";
import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";

export default function OverviewAmounts() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  if (!overviewData) {
    return (
      <Card className="grid grid-cols-6 bg-card p-6 rounded-md">
        <div className="col-span-6 text-center">
          <p className="text-lg text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="grid grid-cols-6 bg-card p-6 rounded-md">
      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Exchanges</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {overviewData.exchange_count}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {overviewData.exchanges.join(", ")}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg MM Depth +2%</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${overviewData.avg_mm_depth_plus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg MM Depth -2%</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${overviewData.avg_mm_depth_minus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg Organic Depth +2%</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${overviewData.avg_organic_depth_plus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg Organic Depth -2%</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${overviewData.avg_organic_depth_minus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-lg">Total Est. Daily Fee</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {overviewData.total_estimated_fee?.toLocaleString() ?? "-"}
        </p>
      </div>
    </Card>
  );
}
