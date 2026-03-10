import { NextResponse } from "next/server";
import { prisma } from "@/config/db";

export async function GET() {
  try {
    const info = await prisma.info.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(info);
  } catch (error) {
    console.error("Failed to fetch info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, info, description } = body;

    if (!key || !info) {
      return NextResponse.json({ error: "Key and info are required" }, { status: 400 });
    }

    const maxOrder = await prisma.info.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    // Using upsert to handle common info keys easily
    const data = await prisma.info.upsert({
      where: { key },
      update: {
        info,
        description: description || "",
      },
      create: {
        key,
        info,
        description: description || "",
        order: nextOrder,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to save info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
