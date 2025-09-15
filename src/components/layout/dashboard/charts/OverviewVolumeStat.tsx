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
import { ResponsiveChart } from "@/components/ui/ResponsiveChart";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "24h Total Volume Statistic Chart";

const chartConfig = {
  volume: {
    label: "Total Volume",
    color: "#F3EE8D",
  },
} satisfies ChartConfig;

export default function OverviewVolumeStat() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  // Transform combined volume data for chart
  const chartData = React.useMemo(() => {
    if (!overviewData?.combined_volume_24h_statistic) {
      return [];
    }

    // Use actual data from combined_volume_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (
      let i = 0;
      i < overviewData.combined_volume_24h_statistic.length;
      i++
    ) {
      const time = new Date(
        now.getTime() -
          ((overviewData.combined_volume_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            overviewData.combined_volume_24h_statistic.length
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

    return overviewData.combined_volume_24h_statistic.map((volume, index) => ({
      time: timeLabels[index],
      volume: parseFloat(volume),
    }));
  }, [overviewData]);

  if (!overviewData) {
    return (
      <ResponsiveChart title="24h Total Volume Statistic">
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </ResponsiveChart>
    );
  }

  return (
    <ResponsiveChart title="24h Total Volume Statistic">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Combined volume across {overviewData.exchange_count} exchanges
        </p>
      </div>
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={chartData}
          width={800}
          height={400}
          className="w-full h-auto"
        >
          <defs>
            <linearGradient id="fillTotalVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF" }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            domain={[0, "dataMax + dataMax * 0.2"]}
            tickFormatter={(value) => Math.round(value).toLocaleString()}
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
              "Total Volume",
            ]}
          />
          <Area
            dataKey="volume"
            type="monotone"
            fill="url(#fillTotalVolume)"
            stroke="#F3EE8D"
            strokeWidth={2}
            fillOpacity={0.8}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveChart>
  );
}
