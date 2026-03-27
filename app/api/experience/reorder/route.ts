import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // Assume items is an array of { id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Update orders sequentially or in parallel
    for (const item of items) {
      await supabase
        .from("work_experience")
        .update({ order: item.order })
        .eq("id", item.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder experiences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
