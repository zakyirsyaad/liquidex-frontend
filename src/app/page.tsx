"use client";
import Dashboard from "@/components/layout/dashboard/Dashboard";
import SignIn from "@/components/layout/SignIn";
import React from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();

  if (!address) {
    return <SignIn />;
  }
  return <Dashboard />;
}
