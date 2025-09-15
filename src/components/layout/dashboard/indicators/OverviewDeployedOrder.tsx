import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExchangeStore } from "@/store/exchangeStore";

export default function OverviewDeployedOrder() {
  const getOverviewData = useExchangeStore((s) => s.getOverviewData);
  const overviewData = getOverviewData();

  if (!overviewData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-3 items-center font-normal">
            <Box
              size={30}
              className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
            />
            <p>Total Deployed Orders</p>
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

  const totalDeployedBuy = overviewData.total_deployed_buy;
  const totalDeployedSell = overviewData.total_deployed_sell;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <Box
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />
          <p>Total Deployed Orders</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          className="bg-green-900 border border-green-700 hover:bg-green-900 text-primary"
          size={"lg"}
        >
          Buy($) <span>${totalDeployedBuy?.toLocaleString()}</span>
        </Button>

        <Button
          size={"lg"}
          className="bg-red-900 hover:bg-red-900 text-primary border border-red-700"
        >
          Sell($) <span>${totalDeployedSell?.toLocaleString()}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
