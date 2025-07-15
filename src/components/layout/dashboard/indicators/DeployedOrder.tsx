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
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeployedOrder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center font-normal">
          <Box
            size={30}
            className="bg-[#F3EE8D] p-1.5 rounded text-primary-foreground"
          />
          <p>Deployed Order</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          className="bg-green-900 border border-green-700 hover:bg-green-900 text-primary"
          size={"lg"}
        >
          Buy($) <span>$3000</span>
        </Button>

        <Button
          size={"lg"}
          className="bg-red-900 hover:bg-red-900 text-primary border border-red-700"
        >
          Sell($) <span>$3000</span>
        </Button>
      </CardContent>
    </Card>
  );
}
