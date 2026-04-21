import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { WorkExperience } from "@/types";
import { validateOrRespond } from "@/lib/validationMiddleware";
import { workExperienceSchema } from "@/lib/validation";

interface ResponsibilityInput {
  responsibility: string;
  id?: string;
}

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
      experiences.forEach((exp: WorkExperience) => {
        if (exp.responsibilities) {
          exp.responsibilities.sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0));
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

    // Validate request data
    const validated = await validateOrRespond(body, workExperienceSchema);
    if (validated instanceof NextResponse) {
      return validated; // Return validation error response
    }

    // Extract validated data
    const { company_name, position, start_date, end_date, profile_id } = validated;
    const { profileId, responsibilities } = body; // Keep these for backward compatibility

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
        profile_id: profile_id || profileId || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    if (responsibilities && Array.isArray(responsibilities)) {
      const respInserts = responsibilities.map((r: ResponsibilityInput, idx: number) => ({
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
