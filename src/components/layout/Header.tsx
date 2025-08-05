import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useExchangeStore } from "@/store/exchangeStore";
import { RealTimeIndicator } from "../ui/RealTimeIndicator";

interface HeaderProps {
  exchanges: string[];
  realTimeStatus?: {
    isEnabled: boolean;
    isLoading: boolean;
    lastUpdate: Date | null;
    error: string | null;
  };
}

export default function Header({ exchanges, realTimeStatus }: HeaderProps) {
  const selectedExchange = useExchangeStore((state) => state.selectedExchange);
  const setSelectedExchange = useExchangeStore(
    (state) => state.setSelectedExchange
  );
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Image
          src={"/LIQUIDEX 1.svg"}
          alt="Liquidex logo"
          width={100}
          height={100}
          priority={true}
        />
        <section className="space-x-3">
          {exchanges.map((exchange) => (
            <Button
              key={exchange}
              className={
                selectedExchange === exchange
                  ? "rounded-full bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none"
                  : "bg-card rounded-full text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none"
              }
              size={"lg"}
              onClick={() => setSelectedExchange(exchange)}
            >
              {exchange}
            </Button>
          ))}
        </section>
      </div>

      {realTimeStatus && <RealTimeIndicator {...realTimeStatus} />}
    </header>
  );
}
