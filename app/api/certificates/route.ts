import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile } from "@/lib/storage";
import { validateOrRespond } from "@/lib/validationMiddleware";
import { certificateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    let query = supabase
      .from("certificates")
      .select("*")
      .order("order", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data: certificates, error } = await query;

    if (error) throw error;
    
    return NextResponse.json(certificates || []);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Validate request data
    const validated = await validateOrRespond(formData, certificateSchema);
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { title, issuer, date_issued, credential_id, credential_url } = validated;
    const profileId = formData.get("profileId") as string;
    const imageFile = formData.get("image_url") as File | null;

    let imagePath = "";
    if (imageFile && imageFile.size > 0 && typeof imageFile !== "string") {
      imagePath = await saveFile(imageFile, "projects"); // Using projects bucket as requested
    } else {
        return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("certificates")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const maxOrderValue = maxOrderData?.[0]?.order ?? -1;
    const nextOrder = maxOrderValue + 1;

    const { data: certificate, error: insertError } = await supabase
      .from("certificates")
      .insert({
        title,
        issuer,
        date_issued,
        credential_id,
        credential_url,
        image_url: imagePath,
        order: nextOrder,
        profile_id: profileId || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
