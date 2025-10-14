import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DollarSign } from "lucide-react";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "Average Price Comparison Chart";
const chartConfig = {
  price: {
    label: "Avg Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function OverviewCurrentPrice() {
  const getFilteredOverviewData = useExchangeStore(
    (s) => s.getFilteredOverviewData
  );
  const overviewData = getFilteredOverviewData();

  const averagePrice = overviewData?.avg_internal_pricing;

  // Transform combined spread data for chart (using spread as proxy for price movement)
  const chartData = React.useMemo(() => {
    if (
      !overviewData ||
      !overviewData.combined_spread_24h_statistic ||
      overviewData.combined_spread_24h_statistic.length === 0
    ) {
      return [];
    }

    return overviewData.combined_spread_24h_statistic.map((spread, index) => ({
      time: `T${index + 1}`,
      price: (averagePrice || 0) + (spread || 0) * 0.1, // Use spread as price variation
    }));
  }, [overviewData?.combined_spread_24h_statistic, overviewData, averagePrice]);

  if (!overviewData) {
    return (
      <Card className="grid grid-cols-2">
        <div className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex gap-1 items-center font-normal">
              <DollarSign
                size={30}
                className="text-primary-foreground bg-[#F3EE8D] p-1.5 rounded"
              />
              <p>Average Price</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <p className="text-xl font-medium">-</p>
          </CardContent>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="grid grid-cols-2">
      <div className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex gap-1 items-center font-normal">
            <DollarSign
              size={30}
              className="text-primary-foreground bg-[#F3EE8D] p-1.5 rounded"
            />
            <p>Average Price</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <p className="text-xl font-medium">
            {averagePrice !== undefined ? `$${averagePrice.toFixed(8)}` : "-"}
          </p>
          <span className="text-sm text-muted-foreground">
            ({overviewData.exchange_count} exchanges)
          </span>
        </CardContent>
      </div>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData} width={400} height={200}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value) => [
                  `$${Number(value).toFixed(8)}`,
                  "Avg Price",
                ]}
              />
            }
          />
          <defs>
            <linearGradient id="fillAvgPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="price"
            type="monotone"
            fill="url(#fillAvgPrice)"
            fillOpacity={0.4}
            stroke="#F3EE8D"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
