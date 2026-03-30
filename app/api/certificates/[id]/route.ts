import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile } from "@/lib/storage";
import { validateOrRespond } from "@/lib/validationMiddleware";
import { certificateUpdateSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Find existing certificate
    const { data: existing, error: fetchError } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Validate request data
    const validated = await validateOrRespond(formData, certificateUpdateSchema);
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { title, issuer, date_issued, credential_id, credential_url } = validated;
    const imageFile = formData.get("image_url");

    let imagePath = existing.image_url;
    // Check if imageFile is a new File
    if (imageFile && typeof imageFile !== "string" && imageFile instanceof Blob && imageFile.size > 0) {
      imagePath = await saveFile(imageFile as File, "projects");
    }

    const { data: updated, error: updateError } = await supabase
      .from("certificates")
      .update({
        title,
        issuer,
        date_issued,
        credential_id,
        credential_url,
        image_url: imagePath,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
