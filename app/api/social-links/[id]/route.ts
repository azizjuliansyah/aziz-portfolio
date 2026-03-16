import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile, deleteFile } from "@/lib/storage";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const link = formData.get("link") as string;
    const file = formData.get("image") as File | null;

    const { data: currentLink, error: fetchError } = await supabase
      .from("social_links")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentLink) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 });
    }

    let imagePath = currentLink.image;

    if (file && file.size > 0 && typeof file !== "string") {
      if (currentLink.image) {
        await deleteFile(currentLink.image);
      }
      imagePath = await saveFile(file, "social-links");
    }

    const { data: socialLink, error: updateError } = await supabase
      .from("social_links")
      .update({
        name,
        image: imagePath,
        link,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error("Failed to update social link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const { data: socialLink, error: fetchError } = await supabase
      .from("social_links")
      .select("image")
      .eq("id", id)
      .single();

    if (!fetchError && socialLink?.image) {
      await deleteFile(socialLink.image);
    }

    const { error: deleteError } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Social link deleted successfully" });
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
