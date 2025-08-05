import React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Legend,
} from "recharts";
import { ResponsiveChart } from "@/components/ui/ResponsiveChart";
import { useExchangeStore } from "@/store/exchangeStore";
import { useMetrics } from "@/hook/useMetrics";
import { ChartContainer } from "@/components/ui/chart";

export const description = "Depth Plus and Minus 24h Chart";

const chartConfig = {
  sell_depth: {
    label: "2% Sell (Token)",
    color: "#EF4444",
  },
  buy_depth: {
    label: "2% Buy ($)",
    color: "#10B981",
  },
};

export default function Depths() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Get depth changes from metrics
  const { percentageChanges } = useMetrics(
    selectedData?.exchange || "",
    selectedData?.pair || ""
  );

  // Transform depth data for chart
  const chartData = React.useMemo(() => {
    if (
      !selectedData?.depth_plus_2_24h_statistic ||
      !selectedData?.depth_minus_2_24h_statistic
    ) {
      return [];
    }

    // Use actual data from depth statistics
    const timeLabels: string[] = [];
    const now = new Date();
    const length = Math.max(
      selectedData.depth_plus_2_24h_statistic.length,
      selectedData.depth_minus_2_24h_statistic.length
    );

    for (let i = 0; i < length; i++) {
      const time = new Date(
        now.getTime() - ((length - 1 - i) * (24 * 60 * 60 * 1000)) / length
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

    return timeLabels.map((time, index) => ({
      time,
      sell_depth: selectedData.depth_minus_2_24h_statistic[index] || 0, // Sell depth (positive, above zero)
      buy_depth: -(selectedData.depth_plus_2_24h_statistic[index] || 0), // Buy depth (negative, below zero)
    }));
  }, [selectedData]);

  return (
    <ResponsiveChart title="Depths">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.depth_minus_change
              ? `${percentageChanges.depth_minus_change.toFixed(2)}%`
              : "0%"}{" "}
            Sell (Token)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.depth_plus_change
              ? `${percentageChanges.depth_plus_change.toFixed(2)}%`
              : "0%"}{" "}
            Buy ($)
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-video h-[500px] w-full"
      >
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillSellDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillBuyDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
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
            tickFormatter={(value) => Math.round(value).toLocaleString()}
          />
          <ReferenceLine y={0} stroke="#F3EE8D" strokeWidth={2} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
            labelStyle={{ color: "#9CA3AF" }}
            formatter={(value: number, name: string) => [
              `${Math.abs(value).toLocaleString()}`,
              name === "sell_depth" ? "2% Sell (Token)" : "2% Buy ($)",
            ]}
          />
          <Legend
            wrapperStyle={{
              color: "#9CA3AF",
              fontSize: "12px",
            }}
          />
          <Area
            dataKey="sell_depth"
            type="monotone"
            fill="url(#fillSellDepth)"
            stroke="#EF4444"
            strokeWidth={2}
            name="Sell (Token)"
          />
          <Area
            dataKey="buy_depth"
            type="monotone"
            fill="url(#fillBuyDepth)"
            stroke="#10B981"
            strokeWidth={2}
            name="Buy ($)"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveChart>
  );
}
