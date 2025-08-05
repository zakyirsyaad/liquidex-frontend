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
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 w-full md:w-auto">
        <Image
          src={"/LIQUIDEX 1.svg"}
          alt="Liquidex logo"
          width={80}
          height={80}
          className="md:w-[100px] md:h-[100px]"
          priority={true}
        />
        <section className="flex flex-wrap gap-2 md:space-x-3">
          {exchanges.map((exchange) => (
            <Button
              key={exchange}
              className={
                selectedExchange === exchange
                  ? "rounded-full bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none text-sm md:text-base"
                  : "bg-card rounded-full text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none text-sm md:text-base"
              }
              size={"sm"}
              onClick={() => setSelectedExchange(exchange)}
            >
              {exchange}
            </Button>
          ))}
        </section>
      </div>

      {realTimeStatus && (
        <div className="w-full md:w-auto">
          <RealTimeIndicator {...realTimeStatus} />
        </div>
      )}
    </header>
  );
}
