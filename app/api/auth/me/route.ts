
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
