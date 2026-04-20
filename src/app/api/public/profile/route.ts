import { NextResponse } from "next/server";
import { supabasePublic as supabase } from "@/config/db";
import { Skill } from "@/types/skill";
import { Project } from "@/types/project";
import { SocialLink } from "@/types/socialLink";
import { WorkExperience } from "@/types/experience";

export async function GET() {
  try {
    const { data: profile, error } = await supabase
      .from("portfolio_profile")
      .select(`
        *,
        skills (*),
        projects (*),
        social_links (*),
        work_experience (*, responsibilities:work_experience_responsibilities(*)),
        certificates (*)
      `)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("No active profile found:", error);
      return NextResponse.json(null);
    }

    // Sort skills, projects and social links by order
    if (profile.skills) {
      profile.skills.sort((a: Skill, b: Skill) => (a.order || 0) - (b.order || 0));
    }
    if (profile.projects) {
      profile.projects.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0));
    }
    if (profile.social_links) {
      profile.social_links.sort((a: SocialLink, b: SocialLink) => (a.order || 0) - (b.order || 0));
    }
    if (profile.work_experience) {
      profile.work_experience.sort((a: WorkExperience, b: WorkExperience) => (a.order || 0) - (b.order || 0));
      profile.work_experience.forEach((exp: WorkExperience) => {
        if (exp.responsibilities) {
          exp.responsibilities.sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0));
        }
      });
    }
    if (profile.certificates) {
      profile.certificates.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch active public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
