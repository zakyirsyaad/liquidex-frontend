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
import { useMetrics } from "@/hook/useMetrics";

export const description = "Price Comparison Chart";
const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function CurrentPrice() {
  const filteredData = useExchangeStore((s) => s.filteredData);
  const data = filteredData;
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);
  const currentPrice = selectedData?.internal_pricing;

  // Get price change from metrics
  const { percentageChanges, metrics } = useMetrics(
    selectedData?.exchange || "",
    selectedData?.pair || ""
  );

  const priceChange = percentageChanges?.price_change || 0;
  let priceChangeText = "0.00%";
  let priceChangeColor = "text-gray-400";

  if (priceChange !== 0) {
    priceChangeText = `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(2)}%`;
    priceChangeColor =
      priceChange > 0
        ? "text-green-600"
        : priceChange < 0
        ? "text-red-600"
        : "text-gray-400";
  }

  // Transform metrics data for chart
  const chartData = React.useMemo(() => {
    if (!metrics || metrics.length === 0) return [];

    return metrics.map((metric, index) => ({
      time: `T${index + 1}`,
      price: metric.current_price,
    }));
  }, [metrics]);

  return (
    <Card className="grid grid-cols-2">
      <div className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex gap-1 items-center font-normal">
            <DollarSign
              size={30}
              className="text-primary-foreground bg-[#F3EE8D] p-1.5 rounded"
            />
            <p>Current Price</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <p className="text-xl font-medium">
            {currentPrice !== undefined ? `$${currentPrice.toFixed(8)}` : "-"}
          </p>
          <span className={`text-lg font-medium ${priceChangeColor}`}>
            {priceChangeText}
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
                formatter={(value) => [`$${Number(value).toFixed(8)}`, "Price"]}
              />
            }
          />
          <defs>
            <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="price"
            type="monotone"
            fill="url(#fillPrice)"
            fillOpacity={0.4}
            stroke="#F3EE8D"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
