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
import { useWalletAccess } from "@/hook/useWalletAccess";
import AccessControl from "../AccessControl";
import WalletAccessStatus from "../../ui/WalletAccessStatus";
import DataAccessInfo from "../../ui/DataAccessInfo";

export default function Dashboard() {
  const selectedExchange = useExchangeStore((state) => state.selectedExchange);
  const setSelectedExchange = useExchangeStore(
    (state) => state.setSelectedExchange
  );
  const selectedDataSourceStore = useExchangeStore(
    (state) => state.selectedDataSource
  );
  const setSelectedDataSource = useExchangeStore(
    (state) => state.setSelectedDataSource
  );
  const getAccessibleData = useExchangeStore(
    (state) => state.getAccessibleData
  );
  const getAccessibleDataSource = useExchangeStore(
    (state) => state.getAccessibleDataSource
  );

  // Get wallet access
  const walletAccess = useWalletAccess();

  // Get data based on wallet access
  const accessibleData = getAccessibleData();
  const accessibleDataSource = getAccessibleDataSource();

  // Effective data source: if both accessible, use store-selected; otherwise clamp to available
  const effectiveDataSource: "KOM" | "BBA" | null =
    walletAccess.hasKOMAccess && walletAccess.hasBBAAccess
      ? selectedDataSourceStore
      : accessibleDataSource;

  // Use accessible data instead of current data
  const data = accessibleData;

  // Real-time data with default settings
  const { isLoading, lastUpdate, error } = useRealTimeData({
    interval: 30000, // 30 seconds
    enabled: true,
  });

  const exchanges = React.useMemo(
    () => (data ? Array.from(new Set(data.map((item) => item.exchange))) : []),
    [data]
  );

  // Auto-select first exchange when data source changes or when no exchange is selected
  React.useEffect(() => {
    if (exchanges.length > 0 && !selectedExchange) {
      setSelectedExchange(exchanges[0]);
    }
  }, [exchanges, selectedExchange, setSelectedExchange]);

  // Auto-select first exchange when switching data sources
  React.useEffect(() => {
    if (exchanges.length > 0) {
      setSelectedExchange(exchanges[0]);
    }
  }, [effectiveDataSource, exchanges, setSelectedExchange]);

  return (
    <AccessControl walletAccess={walletAccess}>
      <main className="px-4 py-6 md:px-8 lg:px-12 xl:px-20 xl:py-10 space-y-4 md:space-y-5">
        <Header
          exchanges={exchanges}
          realTimeStatus={{
            isEnabled: true,
            isLoading,
            lastUpdate,
            error,
          }}
          selectedDataSource={effectiveDataSource || "KOM"}
          onDataSourceChange={setSelectedDataSource}
          walletAccess={walletAccess}
        />

        {/* Wallet Access Status */}
        <WalletAccessStatus walletAccess={walletAccess} />

        {/* Data Access Info */}
        <DataAccessInfo walletAccess={walletAccess} />

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
    </AccessControl>
  );
}
