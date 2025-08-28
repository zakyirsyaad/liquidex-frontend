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

export const description = "MM Depth and Organic Depth 24h Chart";

const chartConfig = {
  mm_depth_sell: {
    label: "MM Depth Sell (Token)",
    color: "#EF4444",
  },
  mm_depth_buy: {
    label: "MM Depth Buy ($)",
    color: "#10B981",
  },
  organic_depth_sell: {
    label: "Organic Depth Sell (Token)",
    color: "#F59E0B",
  },
  organic_depth_buy: {
    label: "Organic Depth Buy ($)",
    color: "#3B82F6",
  },
};

export default function Depths() {
  const getCurrentData = useExchangeStore((s) => s.getCurrentData);
  const data = getCurrentData();
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
      !selectedData?.mm_depth_buy_24h_statistic ||
      !selectedData?.mm_depth_sell_24h_statistic ||
      !selectedData?.organic_depth_buy_24h_statistic ||
      !selectedData?.organic_depth_sell_24h_statistic
    ) {
      return [];
    }

    // Use actual data from depth statistics
    const timeLabels: string[] = [];
    const now = new Date();
    const length = Math.max(
      selectedData.mm_depth_buy_24h_statistic.length,
      selectedData.mm_depth_sell_24h_statistic.length,
      selectedData.organic_depth_buy_24h_statistic.length,
      selectedData.organic_depth_sell_24h_statistic.length
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
      mm_depth_sell: selectedData.mm_depth_sell_24h_statistic[index] || 0, // MM Sell depth (positive, above zero)
      mm_depth_buy: -(selectedData.mm_depth_buy_24h_statistic[index] || 0), // MM Buy depth (negative, below zero)
      organic_depth_sell:
        selectedData.organic_depth_sell_24h_statistic[index] || 0, // Organic Sell depth (positive, above zero)
      organic_depth_buy: -(
        selectedData.organic_depth_buy_24h_statistic[index] || 0
      ), // Organic Buy depth (negative, below zero)
    }));
  }, [selectedData]);

  return (
    <ResponsiveChart title="Depths">
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.mm_depth_sell_change
              ? `${percentageChanges.mm_depth_sell_change.toFixed(2)}%`
              : "0%"}{" "}
            MM Sell (Token)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.mm_depth_buy_change
              ? `${percentageChanges.mm_depth_buy_change.toFixed(2)}%`
              : "0%"}{" "}
            MM Buy ($)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.organic_depth_sell_change
              ? `${percentageChanges.organic_depth_sell_change.toFixed(2)}%`
              : "0%"}{" "}
            Organic Sell (Token)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            {percentageChanges?.organic_depth_buy_change
              ? `${percentageChanges.organic_depth_buy_change.toFixed(2)}%`
              : "0%"}{" "}
            Organic Buy ($)
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-video h-[500px] w-full"
      >
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillMMSellDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillMMBuyDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient
              id="fillOrganicSellDepth"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient
              id="fillOrganicBuyDepth"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
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
              name === "mm_depth_sell"
                ? "MM Sell (Token)"
                : name === "mm_depth_buy"
                ? "MM Buy ($)"
                : name === "organic_depth_sell"
                ? "Organic Sell (Token)"
                : "Organic Buy ($)",
            ]}
          />
          <Legend
            wrapperStyle={{
              color: "#9CA3AF",
              fontSize: "12px",
            }}
          />
          <Area
            dataKey="mm_depth_sell"
            type="monotone"
            fill="url(#fillMMSellDepth)"
            stroke="#EF4444"
            strokeWidth={2}
            name="MM Sell (Token)"
          />
          <Area
            dataKey="mm_depth_buy"
            type="monotone"
            fill="url(#fillMMBuyDepth)"
            stroke="#10B981"
            strokeWidth={2}
            name="MM Buy ($)"
          />
          <Area
            dataKey="organic_depth_sell"
            type="monotone"
            fill="url(#fillOrganicSellDepth)"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Organic Sell (Token)"
          />
          <Area
            dataKey="organic_depth_buy"
            type="monotone"
            fill="url(#fillOrganicBuyDepth)"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Organic Buy ($)"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveChart>
  );
}
