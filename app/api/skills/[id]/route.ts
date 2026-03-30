import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile, deleteFile } from "@/lib/storage";
import { validateOrRespond } from "@/lib/validationMiddleware";
import { skillSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Validate request data (partial validation for update)
    const validated = await validateOrRespond(formData, skillSchema.partial());
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { title, image } = validated;
    const file = formData.get("image") as File | null;

    // Fetch current skill to check for old image
    const { data: currentSkill, error: fetchError } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let imagePath = currentSkill.image;

    // If a new file is uploaded
    if (file && file.size > 0 && typeof file !== "string") {
      // Delete old file if it exists
      if (currentSkill.image) {
        await deleteFile(currentSkill.image);
      }
      imagePath = await saveFile(file, "skills");
    }

    const { data: skill, error: updateError } = await supabase
      .from("skills")
      .update({
        title,
        image: imagePath,
        description: "",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Failed to update skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch skill to get image path for deletion
    const { data: skill, error: fetchError } = await supabase
      .from("skills")
      .select("image")
      .eq("id", id)
      .single();

    if (!fetchError && skill?.image) {
      await deleteFile(skill.image);
    }

    const { error: deleteError } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
