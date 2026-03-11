import { NextResponse } from "next/server";
import { supabase } from "@/config/db";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    // Update orders sequentially since Supabase JS client lacks single-transaction multi-row update out of the box
    for (const item of items) {
      const { error } = await supabase
        .from("skills")
        .update({ order: item.order })
        .eq("id", item.id);
        
      if (error) throw error;
    }

    return NextResponse.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Failed to reorder skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
