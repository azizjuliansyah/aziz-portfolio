import { NextResponse } from "next/server";
import { prisma } from "@/config/db";

export async function GET() {
  try {
    const [totalProjects, totalSkills, totalInfo] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.info.count()
    ]);

    return NextResponse.json({
      totalProjects,
      totalSkills,
      totalInfo
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
