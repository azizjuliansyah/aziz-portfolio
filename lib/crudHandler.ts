import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { ZodSchema } from "zod";

/**
 * Generic CRUD API Handler Configuration
 */
export interface CRUDHandlerConfig<T> {
  tableName: string;
  schema: ZodSchema<T>;
  selectFields?: string;
  // For nested relations (e.g., "project_images(*)")
  relations?: string;
  // Fields that are auto-calculated
  autoFields?: {
    order?: boolean;
  };
}

/**
 * Generic CRUD Handler Factory
 * Creates standardized CRUD operations for any entity
 *
 * @example
 * ```ts
 * const projectHandlers = createCRUDHandler({
 *   tableName: "projects",
 *   schema: projectSchema,
 *   selectFields: "*",
 *   relations: "project_images(*)",
 *   autoFields: { order: true }
 * });
 *
 * export const GET = projectHandlers.getAll;
 * export const POST = projectHandlers.create;
 * ```
 */
export function createCRUDHandler<T extends Record<string, any>>(
  config: CRUDHandlerConfig<T>
) {
  const {
    tableName,
    schema,
    selectFields = "*",
    relations = "",
    autoFields = {},
  } = config;

  const selectClause = relations ? `${selectFields}, ${relations}` : selectFields;

  return {
    /**
     * GET all items with optional profile filtering
     */
    async getAll(request: Request): Promise<NextResponse> {
      try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get("profileId");

        let query = supabase
          .from(tableName)
          .select(selectClause)
          .order("order", { ascending: true });

        if (profileId) {
          query = query.eq("profile_id", profileId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
      } catch (error) {
        console.error(`Failed to fetch ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },

    /**
     * GET single item by ID
     */
    async getById(
      request: Request,
      { params }: { params: Promise<{ id: string }> }
    ): Promise<NextResponse> {
      try {
        const { id } = await params;

        const { data, error } = await supabase
          .from(tableName)
          .select(selectClause)
          .eq("id", id)
          .single();

        if (error || !data) {
          return NextResponse.json(
            { error: `${tableName} not found` },
            { status: 404 }
          );
        }

        return NextResponse.json(data);
      } catch (error) {
        console.error(`Failed to fetch ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },

    /**
     * CREATE new item
     */
    async create(request: Request): Promise<NextResponse> {
      try {
        const formData = await request.formData();

        // Validate using the validation middleware
        const { validateOrRespond } = await import("@/lib/validationMiddleware");
        const validated = await validateOrRespond(formData, schema);

        if (validated instanceof NextResponse) {
          return validated; // Return validation error
        }

        // Calculate order if needed
        let insertData = { ...validated };
        if (autoFields.order) {
          const { data: maxOrderData } = await supabase
            .from(tableName)
            .select("order")
            .order("order", { ascending: false })
            .limit(1);

          const maxOrder = maxOrderData?.[0]?.order ?? -1;
          insertData = { ...insertData, order: maxOrder + 1 };
        }

        // Handle profile_id
        const profileId = formData.get("profileId") as string;
        if (profileId && !insertData.profile_id) {
          insertData = { ...insertData, profile_id: profileId };
        }

        const { data, error } = await supabase
          .from(tableName)
          .insert(insertData)
          .select(selectClause)
          .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
      } catch (error) {
        console.error(`Failed to create ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },

    /**
     * UPDATE existing item
     */
    async update(
      request: Request,
      { params }: { params: Promise<{ id: string }> }
    ): Promise<NextResponse> {
      try {
        const { id } = await params;
        const formData = await request.formData();

        // Validate using the validation middleware (partial for updates)
        const { validateOrRespond } = await import("@/lib/validationMiddleware");
        const validated = await validateOrRespond(formData, schema);

        if (validated instanceof NextResponse) {
          return validated; // Return validation error
        }

        const { data, error } = await supabase
          .from(tableName)
          .update(validated)
          .eq("id", id)
          .select(selectClause)
          .single();

        if (error) throw error;

        return NextResponse.json(data);
      } catch (error) {
        console.error(`Failed to update ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },

    /**
     * DELETE item
     */
    async delete(
      request: Request,
      { params }: { params: Promise<{ id: string }> }
    ): Promise<NextResponse> {
      try {
        const { id } = await params;

        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ message: `${tableName} deleted successfully` });
      } catch (error) {
        console.error(`Failed to delete ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },

    /**
     * REORDER items
     */
    async reorder(request: Request): Promise<NextResponse> {
      try {
        const { items } = await request.json();

        if (!Array.isArray(items) || items.length === 0) {
          return NextResponse.json(
            { error: "Items array is required" },
            { status: 400 }
          );
        }

        // Update each item's order
        const updates = items.map((item: { id: string; order: number }) =>
          supabase
            .from(tableName)
            .update({ order: item.order })
            .eq("id", item.id)
        );

        await Promise.all(updates);

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(`Failed to reorder ${tableName}:`, error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    },
  };
}

/**
 * Type helper for extracting the return type of CRUD handlers
 */
export type CRUDHandlers = ReturnType<typeof createCRUDHandler<any>>;
