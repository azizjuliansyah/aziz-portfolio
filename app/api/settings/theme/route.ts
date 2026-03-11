import { NextResponse } from "next/server";
import { supabase } from "@/config/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("theme, enable_global_theme")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      theme: settings?.theme || "system",
      enableGlobalTheme: settings?.enable_global_theme || false,
    });
  } catch (error) {
    console.error("Global theme GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Verify admin access
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { theme, enableGlobalTheme } = body;

    // Update global app theme (we assume single row in app_settings)
    const { data: settings } = await supabase.from("app_settings").select("id").limit(1).single();
    
    // Construct payload dynamically based on what was passed
    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (theme !== undefined) updatePayload.theme = theme;
    if (enableGlobalTheme !== undefined) updatePayload.enable_global_theme = enableGlobalTheme;

    if (settings?.id) {
       const { error } = await supabase
         .from("app_settings")
         .update(updatePayload)
         .eq("id", settings.id);
       if (error) throw error;
    } else {
       // Just in case it's completely empty
       const insertPayload = { ...updatePayload };
       if (!insertPayload.theme) insertPayload.theme = "system";
       if (insertPayload.enable_global_theme === undefined) insertPayload.enable_global_theme = false;
       
       const { error } = await supabase
         .from("app_settings")
         .insert(insertPayload);
       if (error) throw error;
    }

    return NextResponse.json({ message: "Global settings updated successfully" });

  } catch (error) {
    console.error("Global theme update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
