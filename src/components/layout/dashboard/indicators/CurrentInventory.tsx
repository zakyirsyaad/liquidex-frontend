import React from "react";
import {
  Card,
  // CardAction,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExchangeStore } from "@/store/exchangeStore";

export default function CurrentInventory() {
  const filteredData = useExchangeStore((s) => s.filteredData);
  const data = filteredData;
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <Warehouse
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />
          <p>Current Inventory</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          className="bg-[#F3EE8D]/20 border-2 border-[#F3EE8D]/30 hover:bg-[#F3EE8D]/20 font-medium text-primary"
          size={"lg"}
        >
          ${selectedData?.balance_usdt.toLocaleString()} USDT
        </Button>

        <Button
          size={"lg"}
          className="bg-[#F3EE8D]/20 border-2 border-[#F3EE8D]/30 hover:bg-[#F3EE8D]/20 font-medium text-primary"
        >
          {selectedData?.balance_token.toLocaleString()} TOKEN
        </Button>
      </CardContent>
    </Card>
  );
}
