import React from "react";
import { WalletAccess } from "@/hook/useWalletAccess";
import { Info, Database, TrendingUp, BarChart3 } from "lucide-react";

interface DataAccessInfoProps {
  walletAccess: WalletAccess;
}

export default function DataAccessInfo({ walletAccess }: DataAccessInfoProps) {
  if (walletAccess.accessibleExchanges.length === 0) {
    return null;
  }

  if (walletAccess.accessibleExchanges.length === 1) {
    const singleSource = walletAccess.accessibleExchanges[0];
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-500 mb-3">
          <Database className="w-5 h-5" />
          <span className="font-medium">Single Data Access</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-blue-400/80">
            You have access to{" "}
            <span className="font-medium text-blue-300">{singleSource}</span>{" "}
            data only.
          </p>
          <p className="text-xs text-blue-400/60">
            All charts and indicators will display {singleSource} data
            automatically.
          </p>
        </div>
      </div>
    );
  }

  // User has access to both KOM and BBA
  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-center gap-2 text-green-500 mb-3">
        <TrendingUp className="w-5 h-5" />
        <span className="font-medium">Dual Data Access</span>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">KOM Data</span>
            </div>
            <p className="text-xs text-green-400/70">
              Access to KOM/USDT trading data, charts, and metrics
            </p>
          </div>
          <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">BBA Data</span>
            </div>
            <p className="text-xs text-green-400/70">
              Access to BBA/USDT trading data, charts, and metrics
            </p>
          </div>
        </div>
        <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">How to Switch</span>
          </div>
          <p className="text-xs text-green-400/70">
            Use the data source selector above to switch between KOM and BBA
            data. All charts and indicators will update automatically when you
            switch data sources.
          </p>
        </div>
      </div>
    </div>
  );
}
