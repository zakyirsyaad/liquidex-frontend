import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      exchange,
      pair,
      current_price,
      last_vol_24h,
      mm_depth_buy,
      mm_depth_sell,
      organic_depth_buy,
      organic_depth_sell,
    } = body;

    const { data, error } = await supabase
      .from("exchange_metrics")
      .insert([
        {
          exchange,
          pair,
          current_price,
          last_vol_24h,
          mm_depth_buy,
          mm_depth_sell,
          organic_depth_buy,
          organic_depth_sell,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error saving metrics:", error);
    return NextResponse.json(
      { error: "Failed to save metrics" },
      { status: 500 }
    );
  }
}
