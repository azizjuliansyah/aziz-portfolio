import { NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { saveFile } from "@/lib/storage";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const info = formData.get("info") as string;
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const galleryFiles = formData.getAll("images") as File[];

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    let thumbnailPath = "";
    if (thumbnailFile && thumbnailFile.size > 0 && typeof thumbnailFile !== "string") {
      thumbnailPath = await saveFile(thumbnailFile, "projects");
    }

    const maxOrder = await prisma.project.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max?.order ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        title,
        info,
        link,
        description,
        thumbnail: thumbnailPath,
        order: nextOrder,
      },
    });

    // Handle gallery images
    if (galleryFiles.length > 0) {
      const galleryData = [];
      for (const file of galleryFiles) {
        if (file && file.size > 0 && typeof file !== "string") {
          const path = await saveFile(file, "projects");
          galleryData.push({
            name: path,
            project_id: project.id,
          });
        }
      }

      if (galleryData.length > 0) {
        await prisma.projectImage.createMany({
          data: galleryData,
        });
      }
    }

    const finalProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { images: true },
    });

    return NextResponse.json(finalProject, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
