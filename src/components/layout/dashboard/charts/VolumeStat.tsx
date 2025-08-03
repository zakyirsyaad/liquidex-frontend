import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "24h Volume Statistic Chart";

const chartConfig = {
  volume: {
    label: "Volume",
    color: "#F3EE8D",
  },
} satisfies ChartConfig;

export default function VolumeStat() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

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
    <Card className="p-6">
      <h1 className="text-xl font-medium">24h Volume Statistic</h1>
      <ChartContainer config={chartConfig}>
        <AreaChart data={chartData} width={800} height={500}>
          <defs>
            <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
            labelStyle={{ color: "#9CA3AF" }}
            formatter={(value: number) => [
              `${value.toLocaleString()}`,
              "Volume",
            ]}
          />
          <Area
            dataKey="volume"
            type="monotone"
            fill="url(#fillSpread)"
            stroke="#F3EE8D"
            strokeWidth={2}
            fillOpacity={0.8}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
