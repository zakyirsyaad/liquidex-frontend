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
import { Box, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CurrentInventory() {
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
          $3000 USDT
        </Button>

        <Button
          size={"lg"}
          className="bg-[#F3EE8D]/20 border-2 border-[#F3EE8D]/30 hover:bg-[#F3EE8D]/20 font-medium text-primary"
        >
          3000 TOKEN
        </Button>
      </CardContent>
    </Card>
  );
}
