import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile } from "@/lib/storage";
import { validateOrRespond } from "@/lib/validationMiddleware";
import { socialLinkSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    let query = supabase
      .from("social_links")
      .select("*")
      .order("order", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data: socialLinks, error } = await query;

    if (error) throw error;
    
    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Validate request data
    const validated = await validateOrRespond(formData, socialLinkSchema);
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { name, link, image } = validated;
    const profileId = formData.get("profileId") as string;
    const file = formData.get("image") as File | null;

    let imagePath = "";
    if (file && file.size > 0) {
      imagePath = await saveFile(file, "social-links");
    }

    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("social_links")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const maxOrderValue = maxOrderData?.[0]?.order ?? -1;
    const nextOrder = maxOrderValue + 1;

    const { data: socialLink, error: insertError } = await supabase
      .from("social_links")
      .insert({
        name,
        image: imagePath,
        link,
        order: nextOrder,
        profile_id: profileId || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error) {
    console.error("Failed to create social link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
