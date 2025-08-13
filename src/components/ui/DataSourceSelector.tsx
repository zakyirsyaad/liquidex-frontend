import React from "react";
import { Button } from "./button";
import { WalletAccess } from "@/hook/useWalletAccess";
import { Database, TrendingUp } from "lucide-react";

interface DataSourceSelectorProps {
  selectedDataSource: "KOM" | "BBA";
  onDataSourceChange: (source: "KOM" | "BBA") => void;
  walletAccess: WalletAccess;
}

export default function DataSourceSelector({
  selectedDataSource,
  onDataSourceChange,
  walletAccess,
}: DataSourceSelectorProps) {
  // If user only has access to one data source, show it as selected
  if (walletAccess.accessibleExchanges.length === 1) {
    const singleSource = walletAccess.accessibleExchanges[0];
    return (
      <div className="bg-card rounded-lg px-4 py-3 border border-[#F3EE8D]/20">
        <div className="flex items-center gap-2 text-[#F3EE8D]">
          <Database className="w-4 h-4" />
          <span className="text-sm font-medium">Single Access Mode</span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-muted-foreground">
            You have access to:{" "}
          </span>
          <span className="text-[#F3EE8D] font-medium">
            {singleSource} Data Only
          </span>
        </div>
      </div>
    );
  }

  // If user has access to both, show selector
  if (walletAccess.hasKOMAccess && walletAccess.hasBBAAccess) {
    return (
      <div className="bg-card rounded-lg px-4 py-3 border border-[#F3EE8D]/20">
        <div className="flex items-center gap-2 text-[#F3EE8D] mb-3">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Data Source Selector</span>
        </div>
        <div className="flex gap-2">
          <Button
            className={
              selectedDataSource === "KOM"
                ? "rounded bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none text-sm"
                : "bg-card rounded text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none text-sm"
            }
            size={"sm"}
            onClick={() => onDataSourceChange("KOM")}
          >
            KOM Data
          </Button>
          <Button
            className={
              selectedDataSource === "BBA"
                ? "rounded bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none text-sm"
                : "bg-card rounded text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none text-sm"
            }
            size={"sm"}
            onClick={() => onDataSourceChange("BBA")}
          >
            BBA Data
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Click to switch between data sources
        </div>
      </div>
    );
  }

  return null;
}
