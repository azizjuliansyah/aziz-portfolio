import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile } from "@/lib/storage";
import { validateOrRespond, validateRequest } from "@/lib/validationMiddleware";
import { projectSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    let query = supabase
      .from("projects")
      .select("*, project_images(*)")
      .order("order", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data: projects, error } = await query;

    if (error) throw error;
    
    // Map project_images to images to match previous prisma shape
    const formattedProjects = projects?.map((p: any) => ({
      ...p,
      images: p.project_images
    })) || [];
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Validate request data
    const validated = await validateOrRespond(formData, projectSchema);
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { title, info, link, overview, narrative, core_engine, development_stack, database_stack, thumbnail } = validated;
    const profileId = formData.get("profileId") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const galleryFiles = formData.getAll("images") as File[];

    let thumbnailPath = "";
    if (thumbnailFile && thumbnailFile.size > 0 && typeof thumbnailFile !== "string") {
      thumbnailPath = await saveFile(thumbnailFile, "projects");
    }

    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("projects")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const maxOrderValue = maxOrderData?.[0]?.order ?? -1;
    const nextOrder = maxOrderValue + 1;

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({
        title,
        info,
        link,
        overview,
        narrative,
        core_engine,
        development_stack,
        database_stack,
        thumbnail: thumbnailPath,
        order: nextOrder,
        profile_id: profileId || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Handle gallery images
    let images = [];
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
        const { data: insertedImages, error: imagesError } = await supabase
          .from("project_images")
          .insert(galleryData)
          .select();
          
        if (imagesError) throw imagesError;
        images = insertedImages || [];
      }
    }

    const finalProject = { ...project, images };

    return NextResponse.json(finalProject, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
