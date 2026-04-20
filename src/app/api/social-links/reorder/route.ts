import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    for (const item of items) {
      const { error } = await supabase
        .from("social_links")
        .update({ order: item.order })
        .eq("id", item.id);
        
      if (error) throw error;
    }

    return NextResponse.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Failed to reorder social links:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
