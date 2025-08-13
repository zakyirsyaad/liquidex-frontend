import React from "react";
import { WalletAccess } from "@/hook/useWalletAccess";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface AccessControlProps {
  walletAccess: WalletAccess;
  children: React.ReactNode;
}

export default function AccessControl({
  walletAccess,
  children,
}: AccessControlProps) {
  const { disconnect } = useDisconnect();

  // If wallet not connected, show connect prompt
  if (!walletAccess.isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Wallet Not Connected
          </h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view exchange data.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  // If wallet connected but no access, show access denied
  if (walletAccess.accessibleExchanges.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-4">
            Your wallet address does not have access to any exchange data.
          </p>
          <div className="bg-card rounded-lg px-4 py-3 border border-[#F3EE8D]/20">
            <p className="text-sm text-muted-foreground">
              Connected wallet:{" "}
              <span className="font-mono text-[#F3EE8D]">
                {walletAccess.currentWallet}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Contact administrator to request access
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => disconnect()}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If wallet has access, show children
  return <>{children}</>;
}
