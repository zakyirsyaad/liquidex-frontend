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
import { useMetrics } from "@/hook/useMetrics";

export const description = "Volume 24h Statistic Chart";
const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function LastVol() {
  const getCurrentData = useExchangeStore((s) => s.getCurrentData);
  const data = getCurrentData();
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);
  const lastVol = selectedData?.generated_volume;

  // Get volume change from metrics
  const { percentageChanges } = useMetrics(
    selectedData?.exchange || "",
    selectedData?.pair || ""
  );

  const volChange = percentageChanges?.volume_change || 0;
  let volChangeText = "0.00%";
  let volChangeColor = "text-gray-400";

  if (volChange !== 0) {
    volChangeText = `${volChange > 0 ? "+" : ""}${volChange.toFixed(2)}%`;
    volChangeColor =
      volChange > 0
        ? "text-green-600"
        : volChange < 0
        ? "text-red-600"
        : "text-gray-400";
  }

  // Transform volume_24h_statistic data for chart
  const chartData = React.useMemo(() => {
    if (!selectedData?.volume_24h_statistic) {
      return [];
    }

    // Use actual data from volume_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (let i = 0; i < selectedData.volume_24h_statistic.length; i++) {
      const time = new Date(
        now.getTime() -
          ((selectedData.volume_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            selectedData.volume_24h_statistic.length
      );
      const timeLabel =
        time.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
        ": " +
        time.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
      timeLabels.push(timeLabel);
    }

    return selectedData.volume_24h_statistic.map((volume, index) => ({
      time: timeLabels[index],
      volume: parseFloat(volume.toString()),
    }));
  }, [selectedData]);

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
        <AreaChart accessibilityLayer data={chartData} width={400} height={200}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Volume",
                ]}
              />
            }
          />
          <defs>
            <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="volume"
            type="monotone"
            fill="url(#fillVolume)"
            fillOpacity={0.4}
            stroke="#F3EE8D"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
