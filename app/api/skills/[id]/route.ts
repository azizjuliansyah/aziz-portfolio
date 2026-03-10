import { NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { saveFile, deleteFile } from "@/lib/storage";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;

    // Fetch current skill to check for old image
    const currentSkill = await prisma.skill.findUnique({ where: { id } });
    if (!currentSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let imagePath = currentSkill.image;

    // If a new file is uploaded
    if (file && file.size > 0 && typeof file !== "string") {
      // Delete old file if it exists
      if (currentSkill.image) {
        await deleteFile(currentSkill.image);
      }
      imagePath = await saveFile(file);
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        title,
        image: imagePath,
        description,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Failed to update skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Fetch skill to get image path for deletion
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (skill?.image) {
      await deleteFile(skill.image);
    }

    await prisma.skill.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
