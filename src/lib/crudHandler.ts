import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/config/db";
import { ZodSchema } from "zod";
import { logger } from "@/utils/logger";
import { saveFile } from "@/lib/storage";

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
  // Fields that contain files to be uploaded
  fileFields?: {
    [key: string]: "profiles" | "skills" | "projects" | "social-links" | "certificates" | "settings";
  };
  // Custom query modifier
  customQuery?: (query: any) => any;
}

/**
 * Generic CRUD Handler Factory
 * Creates standardized CRUD operations for any entity
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
    fileFields = {},
    customQuery,
  } = config;

  const selectClause = relations ? `${selectFields}, ${relations}` : selectFields;

  /**
   * Helper to process file uploads in validated data
   */
  async function processFiles(data: any, formData: FormData) {
    const updatedData = { ...data };
    for (const [field, folder] of Object.entries(fileFields)) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        try {
          updatedData[field] = await saveFile(file, folder);
        } catch (error) {
          logger.error(`Failed to upload file for field ${field}:`, error);
        }
      } else if (updatedData[field] instanceof File) {
        // Remove file object if it wasn't processed (shouldn't happen with correct formDataToObject)
        delete updatedData[field];
      }
    }
    return updatedData;
  }

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
          .select(selectClause);

        if (autoFields.order) {
          query = query.order("order", { ascending: true });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        if (profileId) {
          query = query.eq("profile_id", profileId);
        }

        if (customQuery) {
          query = customQuery(query);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
      } catch (error) {
        logger.error(`Failed to fetch ${tableName}:`, error);
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
        logger.error(`Failed to fetch ${tableName}:`, error);
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
        const contentType = request.headers.get("content-type") || "";
        let validated: any;
        let formData: FormData | null = null;

        const { validateOrRespond } = await import("@/lib/validationMiddleware");

        if (contentType.includes("multipart/form-data")) {
          formData = await request.formData();
          validated = await validateOrRespond(formData, schema);
        } else {
          const body = await request.json();
          validated = await validateOrRespond(body, schema);
        }

        if (validated instanceof NextResponse) {
          return validated;
        }

        // Handle file uploads
        let insertData = validated;
        if (formData) {
          insertData = await processFiles(validated, formData);
          
          // Handle profile_id from formData if not in validated
          const profileId = formData.get("profileId") as string;
          if (profileId && !insertData.profile_id) {
            insertData.profile_id = profileId;
          }
        }

        // Calculate order if needed
        if (autoFields.order) {
          const { data: maxOrderData } = await supabase
            .from(tableName)
            .select("order")
            .order("order", { ascending: false })
            .limit(1);

          const maxOrder = maxOrderData?.[0]?.order ?? -1;
          insertData.order = maxOrder + 1;
        }

        const { data, error } = await supabase
          .from(tableName)
          .insert(insertData)
          .select(selectClause)
          .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
      } catch (error) {
        logger.error(`Failed to create ${tableName}:`, error);
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
        const contentType = request.headers.get("content-type") || "";
        let validated: any;
        let formData: FormData | null = null;

        const { validateOrRespond } = await import("@/lib/validationMiddleware");

        if (contentType.includes("multipart/form-data")) {
          formData = await request.formData();
          validated = await validateOrRespond(formData, schema);
        } else {
          const body = await request.json();
          validated = await validateOrRespond(body, schema);
        }

        if (validated instanceof NextResponse) {
          return validated;
        }

        // Handle file uploads
        let updateData = validated;
        if (formData) {
          updateData = await processFiles(validated, formData);
        }

        const { data, error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq("id", id)
          .select(selectClause)
          .single();

        if (error) throw error;

        return NextResponse.json(data);
      } catch (error) {
        logger.error(`Failed to update ${tableName}:`, error);
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
        logger.error(`Failed to delete ${tableName}:`, error);
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
        logger.error(`Failed to reorder ${tableName}:`, error);
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
