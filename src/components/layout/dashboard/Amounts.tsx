import React from "react";
import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";
import { useMetrics } from "@/hook/useMetrics";

export default function Amounts() {
  const getCurrentData = useExchangeStore((s) => s.getCurrentData);
  const data = getCurrentData();
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Get depth changes from metrics
  const { percentageChanges } = useMetrics(
    selectedData?.exchange || "",
    selectedData?.pair || ""
  );

  const [isRefreshingMMBuy, setIsRefreshingMMBuy] = React.useState(false);
  const [isRefreshingMMSell, setIsRefreshingMMSell] = React.useState(false);
  const [isRefreshingOrganicBuy, setIsRefreshingOrganicBuy] =
    React.useState(false);
  const [isRefreshingOrganicSell, setIsRefreshingOrganicSell] =
    React.useState(false);

  const handleRefreshMMBuy = async () => {
    setIsRefreshingMMBuy(true);
    // Simulate API call or data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshingMMBuy(false);
  };

  const handleRefreshMMSell = async () => {
    setIsRefreshingMMSell(true);
    // Simulate API call or data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshingMMSell(false);
  };

  const handleRefreshOrganicBuy = async () => {
    setIsRefreshingOrganicBuy(true);
    // Simulate API call or data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshingOrganicBuy(false);
  };

  const handleRefreshOrganicSell = async () => {
    setIsRefreshingOrganicSell(true);
    // Simulate API call or data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshingOrganicSell(false);
  };

  return (
    <Card className="grid grid-cols-6 bg-card p-6 rounded-md">
      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Pair</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.pair ?? "-"}
        </p>
      </div>

      {/* <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Vol</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.generated_volume?.toLocaleString() ?? "-"}
        </p>
      </div> */}
      {/* <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg. Price 24H</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {selectedData?.avg_24h_price?.toLocaleString() ?? "-"}
        </p>
      </div> */}

      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">MM Depth Plus +2%</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.mm_depth_plus_2_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.mm_depth_plus_2_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.mm_depth_plus_2_change || 0) > 0
              ? "+"
              : (percentageChanges?.mm_depth_plus_2_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(percentageChanges?.mm_depth_plus_2_change || 0).toFixed(
              2
            )}
            %)
          </span>
          <button
            onClick={handleRefreshMMBuy}
            disabled={isRefreshingMMBuy}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingMMBuy ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.mm_depth_plus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">MM Depth Minus -2%</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.mm_depth_minus_2_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.mm_depth_minus_2_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.mm_depth_minus_2_change || 0) > 0
              ? "+"
              : (percentageChanges?.mm_depth_minus_2_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(percentageChanges?.mm_depth_minus_2_change || 0).toFixed(
              2
            )}
            %)
          </span>
          <button
            onClick={handleRefreshMMSell}
            disabled={isRefreshingMMSell}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingMMSell ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.mm_depth_minus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Organic Depth +2%</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.organic_depth_plus_2_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.organic_depth_plus_2_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.organic_depth_plus_2_change || 0) > 0
              ? "+"
              : (percentageChanges?.organic_depth_plus_2_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(
              percentageChanges?.organic_depth_plus_2_change || 0
            ).toFixed(2)}
            %)
          </span>
          <button
            onClick={handleRefreshOrganicBuy}
            disabled={isRefreshingOrganicBuy}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingOrganicBuy ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.organic_depth_plus_2?.toFixed(2) ?? "-"}
        </p>
      </div>

      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Organic Depth -2%</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.organic_depth_minus_2_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.organic_depth_minus_2_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.organic_depth_minus_2_change || 0) > 0
              ? "+"
              : (percentageChanges?.organic_depth_minus_2_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(
              percentageChanges?.organic_depth_minus_2_change || 0
            ).toFixed(2)}
            %)
          </span>
          <button
            onClick={handleRefreshOrganicSell}
            disabled={isRefreshingOrganicSell}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingOrganicSell ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.organic_depth_minus_2?.toFixed(2) ?? "-"}
        </p>
      </div>
      <div className="text-center">
        <h1 className="text-lg">Est. Daily Fee</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {selectedData?.estimated_fee?.toLocaleString() ?? "-"}
        </p>
      </div>
    </Card>
  );
}
