import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import { saveFile, deleteFile } from "@/lib/storage";
import { handleApiError, errorResponses, successResponse } from "@/utils/apiErrorHandler";
import { profileSchema } from "@/lib/validation";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return errorResponses.unauthorized();
    }

    let payload;
    try {
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch {
      return errorResponses.unauthorized("Invalid token");
    }

    const userId = payload.id as string;
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const image = formData.get("image") as File | null;

    // Validate using Zod
    const validationResult = profileSchema.safeParse({
      name,
      email,
      password: password || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validationResult.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message
        })) 
      }, { status: 400 });
    }

    // Fetch current user to get old image path
    const { data: currentUser, error: fetchError } = await supabase
      .from("users")
      .select("image")
      .eq("id", userId)
      .single();

    if (fetchError || !currentUser) {
      return errorResponses.notFound("User not found");
    }

    const updateData: any = {};
    
    let emailChanged = false;
    let passwordChanged = false;

    if (name && name !== payload.name) {
      updateData.name = name;
    }

    if (email && email !== payload.email) {
      updateData.email = email;
      emailChanged = true;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      passwordChanged = true;
    }

    if (image) {
      // Delete old image if it exists
      if (currentUser.image) {
        await deleteFile(currentUser.image);
      }
      
      const imagePath = await saveFile(image, "profiles");
      updateData.image = imagePath;
    }

    // If nothing changed in the payload, just bypass the DB update to prevent PostgREST PGRST116
    let updatedUser: any = currentUser;
    if (Object.keys(updateData).length > 0) {
      const { data, error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (updateError || !data) {
        console.error("Failed to update user:", updateError);
        return errorResponses.internalServerError("Failed to update user");
      }
      updatedUser = data;
    } else {
      // Re-fetch full user data if we skipped update since currentUser only had image
      const { data } = await supabase.from("users").select("*").eq("id", userId).single();
      if (data) updatedUser = data;
    }

    const responseData = {
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name || name,
        email: updatedUser.email || email,
        image: updatedUser.image,
      },
      logoutRequired: emailChanged || passwordChanged,
    };

    const response = successResponse(responseData);

    if (emailChanged || passwordChanged) {
      response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
    }

    return response;

  } catch (error) {
    return handleApiError(error);
  }
}
