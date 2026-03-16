import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    // settingsService expects an array because of data[0] lookup in fetchSettings
    return NextResponse.json([{
      id: settings?.id || "1",
      theme: settings?.theme || "system",
      enable_global_theme: settings?.enable_global_theme ?? false,
    }]);

  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if settings table row exists
    const { data: existing, error: selectError } = await supabase
      .from("app_settings")
      .select("id")
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    let result;
    if (existing?.id) {
       const { data, error } = await supabase
         .from("app_settings")
         .update(body)
         .eq("id", existing.id)
         .select()
         .single();
       if (error) throw error;
       result = data;
    } else {
       const { data, error } = await supabase
         .from("app_settings")
         .insert([{ ...body, id: "1" }])
         .select()
         .single();
       if (error) throw error;
       result = data;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
