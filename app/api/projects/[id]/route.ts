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
    const title = formData.get("title") as string;
    const info = formData.get("info") as string;
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const galleryFiles = formData.getAll("images") as File[];
    const removedImages = formData.getAll("removedImages") as string[];

    const { data: currentProjectData, error: fetchError } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("id", id)
      .single();

    if (fetchError || !currentProjectData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const currentProject = {
      ...currentProjectData,
      images: currentProjectData.project_images || []
    };

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
        await supabase
          .from("project_images")
          .delete()
          .eq("name", imagePath)
          .eq("project_id", id);
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
        await supabase
          .from("project_images")
          .insert(galleryData);
      }
    }

    const { data: updatedProjectRaw, error: updateError } = await supabase
      .from("projects")
      .update({
        title,
        info,
        link,
        description,
        thumbnail: thumbnailPath,
      })
      .eq("id", id)
      .select("*, project_images(*)")
      .single();

    if (updateError) throw updateError;
    
    const updatedProject = {
      ...updatedProjectRaw,
      images: updatedProjectRaw.project_images || []
    };

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
    const { id } = await params;

    const { data: projectData, error: fetchError } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("id", id)
      .single();

    if (fetchError || !projectData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const project = {
      ...projectData,
      images: projectData.project_images || []
    };

    // Delete thumbnail
    if (project.thumbnail) {
      await deleteFile(project.thumbnail);
    }

    // Delete gallery images
    for (const image of project.images) {
      await deleteFile(image.name);
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
      
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
