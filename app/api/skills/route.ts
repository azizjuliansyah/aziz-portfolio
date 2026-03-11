import { NextResponse } from "next/server";
import { supabase } from "@/config/db";
import { saveFile } from "@/lib/storage";

export async function GET() {
  try {
    const { data: skills, error } = await supabase
      .from("skills")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    let imagePath = "";
    if (file && file.size > 0) {
      imagePath = await saveFile(file, "skills");
    }

    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("skills")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const maxOrderValue = maxOrderData?.[0]?.order ?? -1;
    const nextOrder = maxOrderValue + 1;

    const { data: skill, error: insertError } = await supabase
      .from("skills")
      .insert({
        title,
        image: imagePath,
        description,
        order: nextOrder,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Failed to create skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
