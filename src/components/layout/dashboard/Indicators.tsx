import React from "react";
import CurrentPrice from "./indicators/CurrentPrice";
import DeployedOrder from "./indicators/DeployedOrder";
import LastVol from "./indicators/LastVol";
import Spread from "./indicators/Spread";
import CurrentInventory from "./indicators/CurrentInventory";

export default function Indicators() {
  return (
    <section className="grid grid-cols-3 gap-3">
      <div className=" col-span-2 grid grid-cols-3 gap-3">
        <CurrentPrice />
        <DeployedOrder />
        <LastVol />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Spread />
        <CurrentInventory />
      </div>
    </section>
  );
}
