"use client";
import React from "react";
import Header from "../Header";
import Indicators from "./Indicators";
import Amounts from "./Amounts";
import SpreadBid from "./charts/SpreadBid";
import VolumeStat from "./charts/VolumeStat";
import Depths from "./charts/Depths";
import UsdtBalance from "./charts/UsdtBalance";
import TokenBalance from "./charts/TokenBalance";
import { useRealTimeData } from "@/hook/useRealTimeData";
import { useExchangeStore } from "@/store/exchangeStore";

export default function Dashboard() {
  const selectedExchange = useExchangeStore((state) => state.selectedExchange);
  const setSelectedExchange = useExchangeStore(
    (state) => state.setSelectedExchange
  );
  const data = useExchangeStore((state) => state.data);

  // Real-time data with default settings
  const { isLoading, lastUpdate, error } = useRealTimeData({
    interval: 30000, // 30 seconds
    enabled: true,
  });

  const exchanges = React.useMemo(
    () => (data ? Array.from(new Set(data.map((item) => item.exchange))) : []),
    [data]
  );

  React.useEffect(() => {
    if (!selectedExchange && exchanges.length > 0) {
      setSelectedExchange(exchanges[0]);
    }
  }, [exchanges, selectedExchange, setSelectedExchange]);

  return (
    <main className="px-4 py-6 md:px-8 lg:px-12 xl:px-20 xl:py-10 space-y-4 md:space-y-5">
      <Header
        exchanges={exchanges}
        realTimeStatus={{
          isEnabled: true,
          isLoading,
          lastUpdate,
          error,
        }}
      />

      <Indicators />
      <Amounts />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <SpreadBid />
        <VolumeStat />
      </section>
      <Depths />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <UsdtBalance />
        <TokenBalance />
      </section>
    </main>
  );
}
