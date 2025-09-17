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

export const description = "Total Volume 24h Statistic Chart";
const chartConfig = {
  volume: {
    label: "Total Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function OverviewLastVol() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  const totalVolume = overviewData?.total_generated_volume;

  // Ensure totalVolume is a valid number
  const formattedTotalVolume = React.useMemo(() => {
    if (totalVolume === undefined || totalVolume === null) return null;

    // Convert to number and validate
    const numValue =
      typeof totalVolume === "string"
        ? parseFloat(totalVolume)
        : Number(totalVolume);

    // Check if it's a valid number
    if (isNaN(numValue) || !isFinite(numValue)) return null;

    return numValue;
  }, [totalVolume]);

  // Transform combined volume data for chart
  const chartData = React.useMemo(() => {
    if (
      !overviewData ||
      !overviewData.combined_volume_24h_statistic ||
      overviewData.combined_volume_24h_statistic.length === 0
    ) {
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
      <Card className="grid grid-cols-2">
        <div className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center font-normal">
              <ChartColumnBig
                size={30}
                className="bg-[#F3EE8D] text-primary-foreground p-1.5 rounded"
              />
              <p>Total 24H Volume</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <p className="text-xl font-medium">-</p>
          </CardContent>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="grid grid-cols-2">
      <div className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center font-normal">
            <ChartColumnBig
              size={30}
              className="bg-[#F3EE8D] text-primary-foreground p-1.5 rounded"
            />
            <p>Total 24H Volume</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <p className="text-xl font-medium">
            {formattedTotalVolume !== null
              ? `$${formattedTotalVolume.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "-"}
          </p>
          <span className="text-sm text-muted-foreground">
            ({overviewData?.exchange_count || 0} exchanges)
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
                  "Total Volume",
                ]}
              />
            }
          />
          <defs>
            <linearGradient id="fillTotalVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3EE8D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F3EE8D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="volume"
            type="monotone"
            fill="url(#fillTotalVolume)"
            fillOpacity={0.4}
            stroke="#F3EE8D"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
