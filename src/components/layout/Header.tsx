import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Header({
  selectedExchange,
  setSelectedChange,
}: {
  selectedExchange: string;
  setSelectedChange: (value: string) => void;
}) {
  return (
    <header className="flex items-center gap-10">
      <Image
        src={"/LIQUIDEX 1.svg"}
        alt="Liquidex logo"
        width={100}
        height={100}
        priority={true}
      />
      <section className="space-x-3">
        <Button
          className={
            selectedExchange === "binance"
              ? "rounded-full bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none"
              : "bg-card rounded-full text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none"
          }
          size={"lg"}
          onClick={() => {
            setSelectedChange("binance");
          }}
        >
          Binance
        </Button>
        <Button
          className={
            selectedExchange === "kucoin"
              ? "rounded-full bg-[#F3EE8D]/50 border-2 border-[#F3EE8D] hover:bg-[#F3EE8D]/20 text-[#F3EE8D] transition-none"
              : "bg-card rounded-full text-[#F3EE8D] hover:bg-[#F3EE8D]/20 transition-none"
          }
          size={"lg"}
          onClick={() => {
            setSelectedChange("kucoin");
          }}
        >
          Kucoin
        </Button>
      </section>
    </header>
  );
}
