import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CurrentPrice from "./indicators/CurrentPrice";
import DeployedOrder from "./indicators/DeployedOrder";
import LastVol from "./indicators/LastVol";
import Spread from "./indicators/Spread";
import CurrentInventory from "./indicators/CurrentInventory";
import Depths from "./charts/Depths";

export default function Indicators({
  selectedExchange,
}: {
  selectedExchange: string;
}) {
  return (
    <section>
      <p>{selectedExchange}</p>
      <section className="flex gap-3">
        <div className="grid grid-cols-3 gap-3">
          <CurrentPrice />
          <DeployedOrder />
          <LastVol />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Spread />
          <CurrentInventory />
        </div>
      </section>
    </section>
  );
}
