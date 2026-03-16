import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { saveFile, deleteFile } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { data: profile, error } = await supabase
      .from("portfolio_profile")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
      
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch public profile detail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    
    const avatarFile = formData.get("avatar") as File | null;
    const cvFile = formData.get("cv") as File | null;

    if (!name || !title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    // Fetch current state
    const { data: currentProfile, error: fetchError } = await supabase
      .from("portfolio_profile")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let avatarPath = currentProfile.avatar;
    if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== "string") {
      if (currentProfile.avatar) {
        await deleteFile(currentProfile.avatar);
      }
      avatarPath = await saveFile(avatarFile, "profiles");
    }

    let cvPath = currentProfile.cv;
    if (cvFile && cvFile.size > 0 && typeof cvFile !== "string") {
      if (currentProfile.cv) {
        await deleteFile(currentProfile.cv);
      }
      cvPath = await saveFile(cvFile, "profiles");
    }

    const payload = {
        name,
        title,
        bio: bio || "",
        email: email || "",
        phone: phone || "",
        location: location || "",
        avatar: avatarPath,
        cv: cvPath,
        updated_at: new Date().toISOString()
    };

    const { data, error: updateError } = await supabase
      .from("portfolio_profile")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
      
    if (updateError) throw updateError;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Fetch for file deletion
    const { data: profile, error: fetchError } = await supabase
      .from("portfolio_profile")
      .select("avatar, cv")
      .eq("id", id)
      .single();

    if (profile) {
      if (profile.avatar) await deleteFile(profile.avatar);
      if (profile.cv) await deleteFile(profile.cv);
    }

    const { error: deleteError } = await supabase
      .from("portfolio_profile")
      .delete()
      .eq("id", id);
      
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Failed to delete public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();

    const { data, error } = await supabase
      .from("portfolio_profile")
      .update({ is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to toggle profile active status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
