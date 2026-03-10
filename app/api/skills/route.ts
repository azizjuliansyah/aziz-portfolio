import { NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { saveFile } from "@/lib/storage";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    let imagePath = "";
    if (file && file.size > 0) {
      imagePath = await saveFile(file, "skills");
    }

    const maxOrder = await prisma.skill.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const skill = await prisma.skill.create({
      data: {
        title,
        image: imagePath,
        description,
        order: nextOrder,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Failed to create skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
