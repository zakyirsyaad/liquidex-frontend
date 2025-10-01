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
// Overview components
import OverviewIndicators from "./OverviewIndicators";
import OverviewAmounts from "./OverviewAmounts";
import OverviewSpreadBid from "./charts/OverviewSpreadBid";
import OverviewVolumeStat from "./charts/OverviewVolumeStat";
import OverviewDepths from "./charts/OverviewDepths";
import OverviewUsdtBalance from "./charts/OverviewUsdtBalance";
import OverviewTokenBalance from "./charts/OverviewTokenBalance";
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

  // Get wallet access
  const walletAccess = useWalletAccess();

  // Get data from store
  const data = useExchangeStore((state) => state.data);
  const bbaData = useExchangeStore((state) => state.bbaData);
  const selectedDataSource = useExchangeStore(
    (state) => state.selectedDataSource
  );
  const setFilteredData = useExchangeStore((state) => state.setFilteredData);

  // Get data based on wallet access - use hook's walletAccess directly
  const accessibleData = React.useMemo(() => {
    const { hasKOMAccess, hasBBAAccess } = walletAccess;

    console.log("Dashboard Debug:", {
      walletAccess,
      hasKOMAccess,
      hasBBAAccess,
      dataLength: data?.length || 0,
      bbaDataLength: bbaData?.length || 0,
      selectedDataSource,
    });

    if (hasKOMAccess && hasBBAAccess) {
      // User has access to both, return current selected data
      return selectedDataSource === "KOM" ? data : bbaData;
    } else if (hasKOMAccess) {
      // User only has KOM access
      return data;
    } else if (hasBBAAccess) {
      // User only has BBA access
      return bbaData;
    }

    // No access
    return [];
  }, [walletAccess, data, bbaData, selectedDataSource]);

  const accessibleDataSource = React.useMemo(() => {
    const { hasKOMAccess, hasBBAAccess } = walletAccess;

    if (hasKOMAccess && hasBBAAccess) {
      // User has access to both, return current selection
      return selectedDataSourceStore;
    } else if (hasKOMAccess) {
      // User only has KOM access
      return "KOM";
    } else if (hasBBAAccess) {
      // User only has BBA access
      return "BBA";
    }

    // No access
    return null;
  }, [walletAccess, selectedDataSourceStore]);

  // Effective data source: if both accessible, use store-selected; otherwise clamp to available
  const effectiveDataSource: "KOM" | "BBA" | null =
    walletAccess.hasKOMAccess && walletAccess.hasBBAAccess
      ? selectedDataSourceStore
      : accessibleDataSource;

  // Use accessible data instead of current data
  const displayData = accessibleData;

  // Real-time data with default settings
  const { isLoading, lastUpdate, error } = useRealTimeData({
    interval: 30000, // 30 seconds
    enabled: true,
  });

  const exchanges = React.useMemo(() => {
    const exchangeList = displayData
      ? Array.from(new Set(displayData.map((item) => item.exchange)))
      : [];
    return ["Overview", ...exchangeList];
  }, [displayData]);

  // Auto-select Overview when no exchange is selected
  React.useEffect(() => {
    if (!selectedExchange) {
      setSelectedExchange("Overview");
    }
  }, [selectedExchange, setSelectedExchange]);

  // Auto-select Overview when switching data sources
  React.useEffect(() => {
    setSelectedExchange("Overview");
  }, [effectiveDataSource, setSelectedExchange]);

  // Update filtered data in store when accessible data changes
  React.useEffect(() => {
    setFilteredData(accessibleData);
  }, [accessibleData, setFilteredData]);

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

        {/* Conditional rendering based on selected exchange */}
        {selectedExchange === "Overview" ? (
          <>
            <OverviewIndicators />
            <OverviewAmounts />
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              <OverviewSpreadBid />
              <OverviewVolumeStat />
            </section>
            <OverviewDepths />
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              <OverviewUsdtBalance />
              <OverviewTokenBalance />
            </section>
          </>
        ) : (
          <>
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
          </>
        )}
      </main>
    </AccessControl>
  );
}
