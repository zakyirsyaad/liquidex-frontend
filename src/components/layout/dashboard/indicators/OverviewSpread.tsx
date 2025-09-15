import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useExchangeStore } from "@/store/exchangeStore";

export default function OverviewSpread() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  if (!overviewData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-3 items-center font-normal">
            <DollarSign
              size={30}
              className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
            />
            <p>Average Spread %</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-medium">-</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <DollarSign
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />
          <p>Average Spread %</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium">
          {overviewData.avg_spread?.toFixed(4) ?? "-"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Across {overviewData.exchange_count} exchanges
        </p>
      </CardContent>
    </Card>
  );
}
