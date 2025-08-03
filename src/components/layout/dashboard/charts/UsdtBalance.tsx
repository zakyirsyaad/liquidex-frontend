import React from "react";

import { DollarSign, TrendingUp } from "lucide-react";
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

export const description = "USDT Balance 24h Chart";

const chartConfig = {
  usdt_balance: {
    label: "USDT Balance",
    color: "#F3EE8D",
  },
};

export default function UsdtBalance() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Transform usdt_balance_24h_statistic data for chart
  const chartData = React.useMemo(() => {
    if (!selectedData?.usdt_balance_24h_statistic) {
      return [];
    }

    // Use actual data from usdt_balance_24h_statistic
    const timeLabels: string[] = [];
    const now = new Date();

    for (let i = 0; i < selectedData.usdt_balance_24h_statistic.length; i++) {
      const time = new Date(
        now.getTime() -
          ((selectedData.usdt_balance_24h_statistic.length - 1 - i) *
            (24 * 60 * 60 * 1000)) /
            selectedData.usdt_balance_24h_statistic.length
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

    return selectedData.usdt_balance_24h_statistic.map((balance, index) => ({
      time: timeLabels[index],
      usdt_balance: parseFloat(balance.toString()),
    }));
  }, [selectedData]);

  return (
    <Card className="p-6">
      <h1 className="text-xl font-medium">USDT Balance</h1>
      <AreaChart data={chartData} width={800} height={500}>
        <defs>
          <linearGradient id="fillUsdtBalance" x1="0" y1="0" x2="0" y2="1">
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
            `${value.toLocaleString()} USDT`,
            "Balance",
          ]}
        />
        <Area
          dataKey="usdt_balance"
          type="monotone"
          fill="url(#fillUsdtBalance)"
          stroke="#F3EE8D"
          strokeWidth={2}
        />
      </AreaChart>
    </Card>
  );
}
