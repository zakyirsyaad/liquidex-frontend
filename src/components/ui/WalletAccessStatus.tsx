import React from "react";
import { WalletAccess } from "@/hook/useWalletAccess";
import { CheckCircle, XCircle, AlertCircle, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";
import { Button } from "./button";

interface WalletAccessStatusProps {
  walletAccess: WalletAccess;
}

export default function WalletAccessStatus({
  walletAccess,
}: WalletAccessStatusProps) {
  const { disconnect } = useDisconnect();

  if (!walletAccess.isConnected) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-500">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Wallet Not Connected</span>
        </div>
        <p className="text-sm text-yellow-400/80 mt-2">
          Connect your wallet to view exchange data
        </p>
      </div>
    );
  }

  if (walletAccess.accessibleExchanges.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-500">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Access Denied</span>
        </div>
        <p className="text-sm text-red-400/80 mt-2">
          Your wallet does not have access to any exchange data
        </p>
        <div className="mt-3 p-3 bg-red-500/5 rounded border border-red-500/10">
          <p className="text-xs text-red-400/60">
            Wallet: {walletAccess.currentWallet}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            onClick={() => disconnect()}
            variant="outline"
            size="sm"
            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Access Granted</span>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-400/80">KOM Access:</span>
          {walletAccess.hasKOMAccess ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-400/80">BBA Access:</span>
          {walletAccess.hasBBAAccess ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="pt-2 border-t border-green-500/20">
          <p className="text-xs text-green-400/60">
            Connected: {walletAccess.currentWallet?.slice(0, 6)}...
            {walletAccess.currentWallet?.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}
