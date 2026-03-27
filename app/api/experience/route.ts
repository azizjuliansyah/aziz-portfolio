import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    let query = supabase
      .from("work_experience")
      .select(`
        *,
        responsibilities:work_experience_responsibilities(*)
      `)
      .order("order", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data: experiences, error } = await query;

    if (error) throw error;
    
    // Sort responsibilities by order
    if (experiences) {
      experiences.forEach(exp => {
        if (exp.responsibilities) {
          exp.responsibilities.sort((a, b) => a.order - b.order);
        }
      });
    }

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, company_name, position, start_date, end_date, responsibilities } = body;

    if (!company_name || !position) {
      return NextResponse.json({ error: "Company name and position are required" }, { status: 400 });
    }

    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("work_experience")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;

    const maxOrderValue = maxOrderData?.[0]?.order ?? -1;
    const nextOrder = maxOrderValue + 1;

    const { data: experience, error: insertError } = await supabase
      .from("work_experience")
      .insert({
        company_name,
        position,
        start_date,
        end_date,
        order: nextOrder,
        profile_id: profileId || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    if (responsibilities && Array.isArray(responsibilities)) {
      const respInserts = responsibilities.map((r: any, idx: number) => ({
        experience_id: experience.id,
        responsibility: r.responsibility,
        order: idx
      }));

      if (respInserts.length > 0) {
        const { error: respError } = await supabase
          .from("work_experience_responsibilities")
          .insert(respInserts);
        
        if (respError) throw respError;
      }
    }

    // Return the newly created experience with its details
    const { data: finalExp } = await supabase
      .from("work_experience")
      .select(`
        *,
        responsibilities:work_experience_responsibilities(*)
      `)
      .eq("id", experience.id)
      .single();

    return NextResponse.json(finalExp, { status: 201 });
  } catch (error) {
    console.error("Failed to create experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
