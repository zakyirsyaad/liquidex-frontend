import { useAccount } from "wagmi";
import { WALLET_OWNERS, ExchangeType } from "@/lib/config/WalletConfig";

export interface WalletAccess {
  hasKOMAccess: boolean;
  hasBBAAccess: boolean;
  accessibleExchanges: ExchangeType[];
  currentWallet: string | undefined;
  isConnected: boolean;
}

export function useWalletAccess(): WalletAccess {
  const { address, isConnected } = useAccount();

  const hasKOMAccess =
    isConnected && address
      ? WALLET_OWNERS.KOM.some(
          (wallet) => wallet.toLowerCase() === address.toLowerCase()
        )
      : false;

  const hasBBAAccess =
    isConnected && address
      ? WALLET_OWNERS.BBA.some(
          (wallet) => wallet.toLowerCase() === address.toLowerCase()
        )
      : false;

  const accessibleExchanges: ExchangeType[] = [];
  if (hasKOMAccess) accessibleExchanges.push("KOM");
  if (hasBBAAccess) accessibleExchanges.push("BBA");

  return {
    hasKOMAccess,
    hasBBAAccess,
    accessibleExchanges,
    currentWallet: address,
    isConnected,
  };
}
