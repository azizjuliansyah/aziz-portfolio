import { NextResponse } from "next/server";
import { supabase } from "@/config/db";

export async function GET() {
  try {
    const [
      { count: totalProjects },
      { count: totalSkills },
      { count: totalInfo }
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("info").select("*", { count: "exact", head: true })
    ]);

    return NextResponse.json({
      totalProjects: totalProjects || 0,
      totalSkills: totalSkills || 0,
      totalInfo: totalInfo || 0
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

