import { NextResponse } from "next/server";
import { supabasePublic as supabase } from "@/config/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: project, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_images (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Project not found:", error);
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
