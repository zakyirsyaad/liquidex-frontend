import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExchangeStore } from "@/store/exchangeStore";

export default function OverviewCurrentInventory() {
  const getFilteredOverviewData = useExchangeStore(
    (s) => s.getFilteredOverviewData
  );
  const overviewData = getFilteredOverviewData();

  if (!overviewData) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex gap-3 items-center font-normal">
            <Warehouse
              size={30}
              className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
            />
            <p>Total Inventory</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2 text-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <Warehouse
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />
          <p>Total Inventory</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          className="bg-[#F3EE8D]/20 border-2 border-[#F3EE8D]/30 hover:bg-[#F3EE8D]/20 font-medium text-primary"
          size={"lg"}
        >
          ${overviewData.total_usdt_balance.toLocaleString()} USDT
        </Button>

        <Button
          size={"lg"}
          className="bg-[#F3EE8D]/20 border-2 border-[#F3EE8D]/30 hover:bg-[#F3EE8D]/20 font-medium text-primary"
        >
          {overviewData.total_token_balance.toLocaleString()} TOKEN
        </Button>
      </CardContent>
    </Card>
  );
}
