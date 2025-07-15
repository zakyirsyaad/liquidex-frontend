import React from "react";
import { Card } from "@/components/ui/card";
import { useExchangeStore } from "@/store/exchangeStore";

export default function Amounts() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  return (
    <Card className="grid grid-cols-6 bg-card p-6 rounded-md">
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
        <p className="text-2xl font-medium text-[#F3EE8D]">$0.95</p>
      </div>
      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Depth (-2%)</h1>
          <img src="/icons/refresh.svg" />
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">$0.95</p>
      </div>
      <div className="text-center border-r-4 border-background">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg">Depth (+2%)</h1>
          <img src="/icons/refresh.svg" />
        </div>
        <p className="text-2xl font-medium text-[#F3EE8D]">$0.95</p>
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
