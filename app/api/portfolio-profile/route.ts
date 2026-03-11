import { NextResponse } from "next/server";
import { supabase } from "@/config/db";
import { saveFile, deleteFile } from "@/lib/storage";

export async function GET() {
  try {
    const { data: profile, error } = await supabase
      .from("portfolio_profile")
      .select("*")
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned, which is fine if empty
      
    return NextResponse.json(profile || null);
  } catch (error) {
    console.error("Failed to fetch public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    
    const avatarFile = formData.get("avatar") as File | null;
    const cvFile = formData.get("cv") as File | null;

    if (!name || !title || !bio) {
      return NextResponse.json({ error: "Name, title, and bio are required" }, { status: 400 });
    }

    // Fetch existing logic 
    const { data: currentProfile, error: fetchError } = await supabase
      .from("portfolio_profile")
      .select("*")
      .limit(1)
      .single();

    let avatarPath = currentProfile?.avatar;
    if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== "string") {
      if (currentProfile?.avatar) {
        await deleteFile(currentProfile.avatar);
      }
      avatarPath = await saveFile(avatarFile, "profiles");
    }

    let cvPath = currentProfile?.cv;
    if (cvFile && cvFile.size > 0 && typeof cvFile !== "string") {
      if (currentProfile?.cv) {
        await deleteFile(currentProfile.cv);
      }
      cvPath = await saveFile(cvFile, "profiles");
    }

    const payload = {
        name,
        title,
        bio,
        email: email || "",
        phone: phone || "",
        location: location || "",
        avatar: avatarPath,
        cv: cvPath,
        updated_at: new Date().toISOString()
    };

    let resultData;

    if (currentProfile?.id) {
       const { data, error: updateError } = await supabase
        .from("portfolio_profile")
        .update(payload)
        .eq("id", currentProfile.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      resultData = data;
    } else {
       const { data, error: insertError } = await supabase
        .from("portfolio_profile")
        .insert(payload)
        .select()
        .single();
        
      if (insertError) throw insertError;
      resultData = data;
    }

    return NextResponse.json(resultData);
  } catch (error) {
    console.error("Failed to update public profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
