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

export default function Dashboard() {
  const [selectedExchange, setSelectedExchange] =
    React.useState<string>("binance");

  return (
    <main className="xl:px-20 xl:py-10 space-y-5">
      <Header
        selectedExchange={selectedExchange}
        setSelectedChange={setSelectedExchange}
      />
      <Indicators selectedExchange={selectedExchange} />
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
