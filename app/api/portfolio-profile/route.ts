import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function GET() {
  try {
    const { data: profiles, error } = await supabase
      .from("portfolio_profile")
      .select("*")
      .order("updated_at", { ascending: false });
      
    if (error) throw error;
      
    return NextResponse.json(profiles || []);
  } catch (error) {
    console.error("Failed to fetch public profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const payload = {
        name,
        title: "New Public Profile", // Default placeholder
        bio: "",
        email: "",
        phone: "",
        location: "",
        updated_at: new Date().toISOString()
    };

    const { data, error: insertError } = await supabase
      .from("portfolio_profile")
      .insert(payload)
      .select()
      .single();
      
    if (insertError) throw insertError;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
