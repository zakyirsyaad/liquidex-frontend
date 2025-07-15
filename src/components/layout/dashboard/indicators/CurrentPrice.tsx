import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DollarSign } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "An area chart with gradient fill";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function CurrentPrice() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);
  const currentPrice = selectedData?.internal_pricing;
  const priceChange = 5;
  let priceChangeText = "-";
  let priceChangeColor = "text-gray-400";
  if (typeof priceChange === "number") {
    priceChangeText = `${priceChange > 0 ? "+" : ""}${priceChange.toFixed()}%`;
    priceChangeColor =
      priceChange > 0
        ? "text-green-600"
        : priceChange < 0
        ? "text-red-600"
        : "text-gray-400";
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
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="mobile"
            type="natural"
            fill="url(#fillMobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
