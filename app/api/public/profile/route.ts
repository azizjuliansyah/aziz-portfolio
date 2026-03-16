import { NextResponse } from "next/server";
import { supabase } from "@/config/db";

export async function GET() {
  try {
    const { data: profile, error } = await supabase
      .from("portfolio_profile")
      .select(`
        *,
        skills (*),
        projects (*),
        social_links (*)
      `)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("No active profile found:", error);
      return NextResponse.json(null);
    }

    // Sort skills, projects and social links by order
    if (profile.skills) {
      profile.skills.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    if (profile.projects) {
      profile.projects.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    if (profile.social_links) {
      profile.social_links.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch active public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
