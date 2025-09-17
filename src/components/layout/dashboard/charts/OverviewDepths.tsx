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
import { ChartContainer } from "@/components/ui/chart";

export const description = "Average MM Depth and Organic Depth 24h Chart";

const chartConfig = {
  mm_depth_minus_2: {
    label: "Avg MM Depth Minus (Token)",
    color: "#EF4444",
  },
  mm_depth_plus_2: {
    label: "Avg MM Depth Plus ($)",
    color: "#10B981",
  },
  organic_depth_minus_2: {
    label: "Avg Organic Depth Minus (Token)",
    color: "#F59E0B",
  },
  organic_depth_plus_2: {
    label: "Avg Organic Depth Plus ($)",
    color: "#3B82F6",
  },
};

export default function OverviewDepths() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  // Transform combined depth data for chart
  const chartData = React.useMemo(() => {
    if (!overviewData) {
      return [];
    }

    const {
      combined_mm_depth_minus_2_24h_statistic,
      combined_mm_depth_plus_2_24h_statistic,
      combined_organic_depth_minus_2_24h_statistic,
      combined_organic_depth_plus_2_24h_statistic,
    } = overviewData;

    // Check if any of the depth statistics have data
    const hasData = [
      combined_mm_depth_minus_2_24h_statistic,
      combined_mm_depth_plus_2_24h_statistic,
      combined_organic_depth_minus_2_24h_statistic,
      combined_organic_depth_plus_2_24h_statistic,
    ].some((arr) => arr && arr.length > 0);

    // Debug logging
    console.log("OverviewDepths Debug:", {
      combined_mm_depth_minus_2_24h_statistic:
        combined_mm_depth_minus_2_24h_statistic?.length || 0,
      combined_mm_depth_plus_2_24h_statistic:
        combined_mm_depth_plus_2_24h_statistic?.length || 0,
      combined_organic_depth_minus_2_24h_statistic:
        combined_organic_depth_minus_2_24h_statistic?.length || 0,
      combined_organic_depth_plus_2_24h_statistic:
        combined_organic_depth_plus_2_24h_statistic?.length || 0,
      hasData,
    });

    if (!hasData) {
      // Generate some sample data for testing if no real data is available
      const sampleData = Array.from({ length: 24 }, (_, index) => {
        const time = new Date(Date.now() - (23 - index) * 60 * 60 * 1000);
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

        return {
          time: timeLabel,
          mm_depth_minus_2: Math.random() * 1000 + 500,
          mm_depth_plus_2: -(Math.random() * 1000 + 500),
          organic_depth_minus_2: Math.random() * 800 + 300,
          organic_depth_plus_2: -(Math.random() * 800 + 300),
        };
      });

      console.log("Using sample data for OverviewDepths");
      return sampleData;
    }

    // Use the longest array as reference for time labels
    const arrays = [
      combined_mm_depth_minus_2_24h_statistic || [],
      combined_mm_depth_plus_2_24h_statistic || [],
      combined_organic_depth_minus_2_24h_statistic || [],
      combined_organic_depth_plus_2_24h_statistic || [],
    ];
    const maxLength = Math.max(...arrays.map((arr) => arr.length));

    const timeLabels: string[] = [];
    const now = new Date();

    for (let i = 0; i < maxLength; i++) {
      const time = new Date(
        now.getTime() -
          ((maxLength - 1 - i) * (24 * 60 * 60 * 1000)) / maxLength
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

    return Array.from({ length: maxLength }, (_, index) => ({
      time: timeLabels[index],
      mm_depth_minus_2: combined_mm_depth_minus_2_24h_statistic?.[index] || 0,
      mm_depth_plus_2: -(combined_mm_depth_plus_2_24h_statistic?.[index] || 0),
      organic_depth_minus_2:
        combined_organic_depth_minus_2_24h_statistic?.[index] || 0,
      organic_depth_plus_2: -(
        combined_organic_depth_plus_2_24h_statistic?.[index] || 0
      ),
    }));
  }, [overviewData]);

  if (!overviewData) {
    return (
      <ResponsiveChart title="Average Depths">
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </ResponsiveChart>
    );
  }

  if (chartData.length === 0) {
    return (
      <ResponsiveChart title="Average Depths">
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-muted-foreground">No depth data available</p>
        </div>
      </ResponsiveChart>
    );
  }

  return (
    <ResponsiveChart title="Average Depths">
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            Avg MM Sell (Token) - {overviewData.exchange_count} exchanges
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            Avg MM Buy ($) - {overviewData.exchange_count} exchanges
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            Avg Organic Sell (Token) - {overviewData.exchange_count} exchanges
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          <span className="text-gray-300 text-sm">
            Avg Organic Buy ($) - {overviewData.exchange_count} exchanges
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-video h-[500px] w-full"
      >
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillAvgMMSellDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillAvgMMBuyDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient
              id="fillAvgOrganicSellDepth"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient
              id="fillAvgOrganicBuyDepth"
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
              name,
            ]}
          />
          <Legend
            wrapperStyle={{
              color: "#9CA3AF",
              fontSize: "12px",
            }}
          />
          <Area
            dataKey="mm_depth_minus_2"
            type="monotone"
            fill="url(#fillAvgMMSellDepth)"
            stroke="#EF4444"
            strokeWidth={2}
            name="Avg MM Sell (Token)"
          />
          <Area
            dataKey="mm_depth_plus_2"
            type="monotone"
            fill="url(#fillAvgMMBuyDepth)"
            stroke="#10B981"
            strokeWidth={2}
            name="Avg MM Buy ($)"
          />
          <Area
            dataKey="organic_depth_minus_2"
            type="monotone"
            fill="url(#fillAvgOrganicSellDepth)"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Avg Organic Sell (Token)"
          />
          <Area
            dataKey="organic_depth_plus_2"
            type="monotone"
            fill="url(#fillAvgOrganicBuyDepth)"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Avg Organic Buy ($)"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveChart>
  );
}
