import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartColumnBig } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "An area chart with gradient fill";
const staticChartData = [
  { month: "January", volume: 186 },
  { month: "February", volume: 305 },
  { month: "March", volume: 237 },
  { month: "April", volume: 73 },
  { month: "May", volume: 209 },
  { month: "June", volume: 214 },
];
const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function LastVol() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);
  const lastVol = selectedData?.generated_volume;
  const volChange = 123;
  let volChangeText = "-";
  let volChangeColor = "text-gray-400";
  if (typeof volChange === "number") {
    volChangeText = `${volChange > 0 ? "+" : ""}${volChange.toFixed()}%`;
    volChangeColor =
      volChange > 0
        ? "text-green-600"
        : volChange < 0
        ? "text-red-600"
        : "text-gray-400";
  }

  return (
    <Card className="grid grid-cols-2">
      <div className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center font-normal">
            <ChartColumnBig
              size={30}
              className="bg-[#F3EE8D] text-primary-foreground p-1.5 rounded"
            />
            <p>Last 24H Vol</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <p className="text-xl font-medium">
            {lastVol !== undefined ? `$${lastVol.toLocaleString()}` : "-"}
          </p>
          <span className={`text-lg font-medium ${volChangeColor}`}>
            {volChangeText}
          </span>
        </CardContent>
      </div>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={staticChartData}>
          <CartesianGrid vertical={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="volume"
            type="natural"
            fill="url(#fillVolume)"
            fillOpacity={0.4}
            stroke="var(--chart-1)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
