import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";
import { ChartContainer } from "@/components/ui/chart";

export const description = "Spread Bid Ask Chart";

const chartConfig = {
  spread: {
    label: "Spread",
    color: "#F3EE8D",
  },
};

export default function SpreadBid() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Transform spread_24h_statistic data for chart
  const chartData = React.useMemo(() => {
    if (!selectedData?.spread_24h_statistic) {
      return [];
    }

    // Use actual data from spread_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (let i = 0; i < selectedData.spread_24h_statistic.length; i++) {
      const time = new Date(
        now.getTime() -
          ((selectedData.spread_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            selectedData.spread_24h_statistic.length
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

    return selectedData.spread_24h_statistic.map((spread, index) => ({
      time: timeLabels[index],
      spread: parseFloat(spread.toString()) * 100, // Convert to percentage
    }));
  }, [selectedData]);

  return (
    <Card className="p-6">
      <h1 className="text-xl font-medium">Spread Bid Ask</h1>
      <ChartContainer config={chartConfig}>
        <AreaChart data={chartData} width={800} height={500}>
          <defs>
            <linearGradient id="fillSpread" x1="0" y1="0" x2="0" y2="1">
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
            domain={[0, 2.5]}
            ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
            labelStyle={{ color: "#9CA3AF" }}
            formatter={(value: number) => [`${value.toFixed(4)}%`, "Spread"]}
          />
          <Area
            dataKey="spread"
            type="monotone"
            fill="url(#fillSpread)"
            stroke="#F3EE8D"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
