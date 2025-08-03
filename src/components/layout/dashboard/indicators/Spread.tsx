import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useExchangeStore } from "@/store/exchangeStore";

export default function Spread() {
  const data = useExchangeStore((s) => s.data);
  const selected = useExchangeStore((s) => s.selectedExchange);
  const selectedData = data.find((d) => d.exchange === selected);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <DollarSign
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />

          <p>Spread %</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium">
          {selectedData?.spread.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
