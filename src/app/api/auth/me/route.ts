import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { supabaseAdmin as supabase } from "@/config/db";
import { env } from "@/lib/env";

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    // Fetch fresh user data from DB to ensure profile updates (avatar/name) persist
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, image")
      .eq("id", payload.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
