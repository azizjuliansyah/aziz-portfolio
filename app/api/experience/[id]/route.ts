import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { company_name, position, start_date, end_date, responsibilities } = await request.json();

    const { data: experience, error: updateError } = await supabase
      .from("work_experience")
      .update({
        company_name,
        position,
        start_date,
        end_date,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // To simplify updates of responsibilities, we delete the old ones and insert the new ones
    if (responsibilities !== undefined) {
      await supabase
        .from("work_experience_responsibilities")
        .delete()
        .eq("experience_id", id);
      
      if (Array.isArray(responsibilities) && responsibilities.length > 0) {
        const respInserts = responsibilities.map((r: any, idx: number) => ({
          experience_id: id,
          responsibility: r.responsibility,
          order: idx
        }));

        const { error: respError } = await supabase
          .from("work_experience_responsibilities")
          .insert(respInserts);
          
        if (respError) throw respError;
      }
    }

    const { data: finalExp } = await supabase
      .from("work_experience")
      .select(`
        *,
        responsibilities:work_experience_responsibilities(*)
      `)
      .eq("id", id)
      .single();

    // Sort responsibilities by order
    if (finalExp && finalExp.responsibilities) {
      finalExp.responsibilities.sort((a: any, b: any) => a.order - b.order);
    }

    return NextResponse.json(finalExp);
  } catch (error) {
    console.error("Failed to update experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { error } = await supabase
      .from("work_experience")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
