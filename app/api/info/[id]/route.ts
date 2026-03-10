import { NextResponse } from "next/server";
import { prisma } from "@/config/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await prisma.info.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Info deleted successfully" });
  } catch (error) {
    console.error("Failed to delete info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
