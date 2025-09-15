import React from "react";
import OverviewCurrentPrice from "./indicators/OverviewCurrentPrice";
import OverviewDeployedOrder from "./indicators/OverviewDeployedOrder";
import OverviewLastVol from "./indicators/OverviewLastVol";
import OverviewSpread from "./indicators/OverviewSpread";
import OverviewCurrentInventory from "./indicators/OverviewCurrentInventory";
// import OverviewPercentageChanges from "./indicators/OverviewPercentageChanges";

export default function OverviewIndicators() {
  return (
    <section className="grid 2xl:grid-cols-3 gap-3">
      <div className=" 2xl:col-span-2 grid grid-cols-3 gap-3">
        <OverviewCurrentPrice />
        <OverviewDeployedOrder />
        <OverviewLastVol />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <OverviewSpread />
        <OverviewCurrentInventory />
        {/* <OverviewPercentageChanges /> */}
      </div>
    </section>
  );
}
