import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function GET() {
  try {
    // 1. Get the active profile
    const { data: activeProfile, error: profileError } = await supabase
      .from("portfolio_profile")
      .select("id, name")
      .eq("is_active", true)
      .single();

    if (profileError || !activeProfile) {
      return NextResponse.json({
        totalProjects: 0,
        totalSkills: 0,
        totalSocialLinks: 0,
        activeProfileName: "No Active Profile"
      });
    }

    // 2. Get counts filtered by active profile
    const [
      { count: totalProjects },
      { count: totalSkills },
      { count: totalSocialLinks }
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("profile_id", activeProfile.id),
      supabase.from("skills").select("*", { count: "exact", head: true }).eq("profile_id", activeProfile.id),
      supabase.from("social_links").select("*", { count: "exact", head: true }).eq("profile_id", activeProfile.id)
    ]);

    return NextResponse.json({
      totalProjects: totalProjects || 0,
      totalSkills: totalSkills || 0,
      totalSocialLinks: totalSocialLinks || 0,
      activeProfileName: activeProfile.name,
      activeProfileId: activeProfile.id
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

