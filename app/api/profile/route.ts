import { NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import { saveFile } from "@/lib/storage";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let payload;
    try {
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id as string;
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const image = formData.get("image") as File | null;

    const updateData: any = {};
    if (name) updateData.name = name;
    
    let emailChanged = false;
    let passwordChanged = false;

    if (email && email !== payload.email) {
      updateData.email = email;
      emailChanged = true;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      passwordChanged = true;
    }

    if (image) {
      const imagePath = await saveFile(image, "profiles");
      updateData.image = imagePath;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const response = NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
      logoutRequired: emailChanged || passwordChanged,
    });

    if (emailChanged || passwordChanged) {
      response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
    }

    return response;

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
