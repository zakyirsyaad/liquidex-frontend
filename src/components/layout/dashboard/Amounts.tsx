import React from "react";
import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";
// import { useMetrics } from "@/hook/useMetrics";

export default function Amounts() {
  const getCurrentData = useExchangeStore((s) => s.getCurrentData);
  const data = getCurrentData();
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  // Get depth changes from metrics
  // const { percentageChanges } = useMetrics(
  //   selectedData?.exchange || "",
  //   selectedData?.pair || ""
  // );

  // const [isRefreshingMinus, setIsRefreshingMinus] = useState(false);
  // const [isRefreshingPlus, setIsRefreshingPlus] = useState(false);

  // const handleRefreshMinus = async () => {
  //   setIsRefreshingMinus(true);
  //   // Simulate API call or data refresh
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   setIsRefreshingMinus(false);
  // };

  // const handleRefreshPlus = async () => {
  //   setIsRefreshingPlus(true);
  //   // Simulate API call or data refresh
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   setIsRefreshingPlus(false);
  // };

  return (
    <Card className="grid grid-cols-4 bg-card p-6 rounded-md">
      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Pair</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.pair ?? "-"}
        </p>
      </div>
      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Vol</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.generated_volume?.toLocaleString() ?? "-"}
        </p>
      </div>
      <div className="text-center border-r-4 border-background">
        <h1 className="text-lg">Avg. Price 24H</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {selectedData?.avg_24h_price?.toLocaleString() ?? "-"}
        </p>
      </div>
      {/* <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Depth</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.depth_minus_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.depth_minus_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.depth_minus_change || 0) > 0
              ? "+"
              : (percentageChanges?.depth_minus_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(percentageChanges?.depth_minus_change || 0).toFixed(2)}%)
          </span>
          <button
            onClick={handleRefreshMinus}
            disabled={isRefreshingMinus}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingMinus ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.depth_minus_2?.toFixed(2) ?? "-"}
        </p>
      </div>
      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Depth</h1>
          <span
            className={`text-sm ${
              (percentageChanges?.depth_plus_change || 0) > 0
                ? "text-green-500"
                : (percentageChanges?.depth_plus_change || 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            (
            {(percentageChanges?.depth_plus_change || 0) > 0
              ? "+"
              : (percentageChanges?.depth_plus_change || 0) < 0
              ? "-"
              : ""}
            {Math.abs(percentageChanges?.depth_plus_change || 0).toFixed(2)}%)
          </span>
          <button
            onClick={handleRefreshPlus}
            disabled={isRefreshingPlus}
            className="hover:opacity-70 transition-opacity"
          >
            <img
              src="/icons/refresh.svg"
              className={`${isRefreshingPlus ? "animate-spin" : ""}`}
              alt="Refresh"
            />
          </button>
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          ${selectedData?.depth_plus_2?.toFixed(2) ?? "-"}
        </p>
      </div> */}
      <div className="text-center">
        <h1 className="text-lg">Est. Daily Fee</h1>
        <p className="text-2xl font-medium text-[#F3EE8D]">
          {selectedData?.estimated_fee?.toLocaleString() ?? "-"}
        </p>
      </div>
    </Card>
  );
}
