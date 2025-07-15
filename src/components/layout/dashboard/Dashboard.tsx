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
import { useGetLiquidex } from "@/hook/getLiquidex";
import { ExchangeData, useExchangeStore } from "@/store/exchangeStore";

export default function Dashboard() {
  const selectedExchange = useExchangeStore((state) => state.selectedExchange);
  const setSelectedExchange = useExchangeStore(
    (state) => state.setSelectedExchange
  );
  const setData = useExchangeStore((state) => state.setData);

  const { data } = useGetLiquidex() as unknown as {
    data: ExchangeData[] | undefined;
  };

  const exchanges = React.useMemo(
    () => (data ? Array.from(new Set(data.map((item) => item.exchange))) : []),
    [data]
  );

  React.useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  React.useEffect(() => {
    if (!selectedExchange && exchanges.length > 0) {
      setSelectedExchange(exchanges[0]);
    }
  }, [exchanges, selectedExchange, setSelectedExchange]);

  return (
    <main className="xl:px-20 xl:py-10 space-y-5">
      <Header exchanges={exchanges} />
      <Indicators />
      <Amounts />
      <section className="grid grid-cols-2 gap-5">
        <SpreadBid />
        <VolumeStat />
      </section>
      <Depths />
      <section className="grid grid-cols-2 gap-5">
        <UsdtBalance />
        <TokenBalance />
      </section>
    </main>
  );
}
