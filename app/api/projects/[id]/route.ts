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
    const info = formData.get("info") as string;
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const galleryFiles = formData.getAll("images") as File[];
    const removedImages = formData.getAll("removedImages") as string[];

    const currentProject = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!currentProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let thumbnailPath = currentProject.thumbnail;
    if (thumbnailFile && thumbnailFile.size > 0 && typeof thumbnailFile !== "string") {
      if (currentProject.thumbnail) {
        await deleteFile(currentProject.thumbnail);
      }
      thumbnailPath = await saveFile(thumbnailFile, "projects");
    }

    // Handle removed images
    if (removedImages.length > 0) {
      for (const imagePath of removedImages) {
        await deleteFile(imagePath);
        await prisma.projectImage.deleteMany({
          where: { name: imagePath, project_id: id },
        });
      }
    }

    // Handle new gallery images
    if (galleryFiles.length > 0) {
      const galleryData = [];
      for (const file of galleryFiles) {
        if (file && file.size > 0 && typeof file !== "string") {
          const path = await saveFile(file, "projects");
          galleryData.push({
            name: path,
            project_id: id,
          });
        }
      }

      if (galleryData.length > 0) {
        await prisma.projectImage.createMany({
          data: galleryData,
        });
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        info,
        link,
        description,
        thumbnail: thumbnailPath,
      },
      include: { images: true },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete thumbnail
    if (project.thumbnail) {
      await deleteFile(project.thumbnail);
    }

    // Delete gallery images
    for (const image of project.images) {
      await deleteFile(image.name);
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
