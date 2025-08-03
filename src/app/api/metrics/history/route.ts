import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get("exchange");
    const pair = searchParams.get("pair");
    const hours = searchParams.get("hours") || "24";

    if (!exchange || !pair) {
      return NextResponse.json(
        { error: "Exchange and pair are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("exchange_metrics")
      .select("*")
      .eq("exchange", exchange)
      .eq("pair", pair)
      .gte(
        "created_at",
        new Date(Date.now() - parseInt(hours) * 60 * 60 * 1000).toISOString()
      )
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
