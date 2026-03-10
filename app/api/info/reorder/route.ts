import { NextResponse } from "next/server";
import { prisma } from "@/config/db";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    // Update orders in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.info.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error("Failed to reorder info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
