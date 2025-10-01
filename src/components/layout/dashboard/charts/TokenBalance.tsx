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

export const description = "Token Balance 24h Chart";

export default function TokenBalance() {
  const filteredData = useExchangeStore((s) => s.filteredData);
  const data = filteredData;
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Transform token_balance_24h_statistic data for chart
  const chartData = React.useMemo(() => {
    if (!selectedData?.token_balance_24h_statistic) {
      return [];
    }

    // Use actual data from token_balance_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (let i = 0; i < selectedData.token_balance_24h_statistic.length; i++) {
      const time = new Date(
        now.getTime() -
          ((selectedData.token_balance_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            selectedData.token_balance_24h_statistic.length
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

    return selectedData.token_balance_24h_statistic.map((balance, index) => ({
      time: timeLabels[index],
      token_balance: parseFloat(balance.toString()),
    }));
  }, [selectedData]);

  return (
    <ResponsiveChart title="Token Balance">
      <AreaChart
        data={chartData}
        width={800}
        height={400}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="fillTokenBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          stroke="#9CA3AF"
          tick={{ fill: "#9CA3AF", fontSize: 8 }}
          axisLine={{ stroke: "#374151" }}
          tickLine={{ stroke: "#374151" }}
          interval="preserveStartEnd"
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#9CA3AF"
          tick={{ fill: "#9CA3AF", fontSize: 8 }}
          axisLine={{ stroke: "#374151" }}
          tickLine={{ stroke: "#374151" }}
          // domain={[0, 25000000]}
          // ticks={[0, 15000000, 17500000, 20000000, 22500000, 25000000]}
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
            `${value.toLocaleString()} KOM`,
            "Balance",
          ]}
        />
        <Area
          dataKey="token_balance"
          type="monotone"
          fill="url(#fillTokenBalance)"
          stroke="#F3EE8D"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveChart>
  );
}
