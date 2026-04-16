import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { saveFile, deleteFile } from "@/lib/storage";

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
      seo_title: settings?.seo_title,
      seo_description: settings?.seo_description,
      seo_site_name: settings?.seo_site_name,
      seo_type: settings?.seo_type,
      seo_image: settings?.seo_image,
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

    const formData = await request.formData();
    const theme = formData.get("theme") as string;
    const enable_global_theme = formData.get("enable_global_theme") === "true";
    const seo_title = formData.get("seo_title") as string;
    const seo_description = formData.get("seo_description") as string;
    const seo_site_name = formData.get("seo_site_name") as string;
    const seo_type = formData.get("seo_type") as string;
    const seo_image_file = formData.get("seo_image") as File | null;
    let seo_image_url = formData.get("seo_image") as string;

    // Check if settings table row exists
    const { data: existing, error: selectError } = await supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    const updateData: any = {
      theme: theme || existing?.theme || "system",
      enable_global_theme,
      seo_title,
      seo_description,
      seo_site_name,
      seo_type,
    };

    // Handle Image Upload
    if (seo_image_file && typeof seo_image_file !== "string") {
      // Delete old image if it exists
      if (existing?.seo_image) {
        await deleteFile(existing.seo_image);
      }
      const imagePath = await saveFile(seo_image_file, "settings");
      updateData.seo_image = imagePath;
    } else if (typeof seo_image_url === "string") {
       updateData.seo_image = seo_image_url;
    }

    let result;
    if (existing?.id) {
       const { data, error } = await supabase
         .from("app_settings")
         .update(updateData)
         .eq("id", existing.id)
         .select()
         .single();
       if (error) throw error;
       result = data;
    } else {
       const { data, error } = await supabase
         .from("app_settings")
         .insert([{ ...updateData, id: "1" }])
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
