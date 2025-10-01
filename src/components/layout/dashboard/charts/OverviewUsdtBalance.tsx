import React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ResponsiveChart } from "@/components/ui/ResponsiveChart";
import { useExchangeStore } from "@/store/exchangeStore";

export const description = "Total USDT Balance 24h Chart";

export default function OverviewUsdtBalance() {
  const getFilteredOverviewData = useExchangeStore(
    (s) => s.getFilteredOverviewData
  );
  const overviewData = getFilteredOverviewData();

  // Transform combined usdt balance data for chart
  const chartData = React.useMemo(() => {
    if (!overviewData?.combined_usdt_balance_24h_statistic) {
      return [];
    }

    // Use actual data from combined_usdt_balance_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (
      let i = 0;
      i < overviewData.combined_usdt_balance_24h_statistic.length;
      i++
    ) {
      const time = new Date(
        now.getTime() -
          ((overviewData.combined_usdt_balance_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            overviewData.combined_usdt_balance_24h_statistic.length
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

    return overviewData.combined_usdt_balance_24h_statistic.map(
      (balance, index) => ({
        time: timeLabels[index],
        usdt_balance: parseFloat(balance.toString()),
      })
    );
  }, [overviewData]);

  if (!overviewData) {
    return (
      <ResponsiveChart title="Total USDT Balance">
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </ResponsiveChart>
    );
  }

  return (
    <ResponsiveChart title="Total USDT Balance">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Combined balance across {overviewData.exchange_count} exchanges
        </p>
      </div>
      <AreaChart
        data={chartData}
        width={800}
        height={400}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="fillTotalUsdtBalance" x1="0" y1="0" x2="0" y2="1">
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
            `${value.toLocaleString()} USDT`,
            "Total Balance",
          ]}
        />
        <Area
          dataKey="usdt_balance"
          type="monotone"
          fill="url(#fillTotalUsdtBalance)"
          stroke="#F3EE8D"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveChart>
  );
}
