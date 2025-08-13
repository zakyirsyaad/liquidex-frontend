import React from "react";
import {
  Card,
  //   CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function SignIn() {
  return (
    <main className="mx-auto h-screen max-w-lg flex justify-center items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Liquidex Dashboard</CardTitle>
          <CardDescription>
            To access the Liquidex dashboard and view your trading metrics,
            please connect your Web3 wallet using the button above.
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto">
          <ConnectButton />
        </CardContent>
        <CardFooter>
          <p className="text-center text-xs text-gray-400 w-full">
            Your wallet connection is required for security and to access your
            personalized data
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
