import { NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "@/types";

// Helper function to extract issues from ZodError
function getZodIssues(error: ZodError): Array<{ path: string[]; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));
}

/**
 * Validation error response type
 */
interface ValidationErrorResponse {
  error: string;
  details: Array<{
    path: string[];
    message: string;
  }>;
}

/**
 * Validates request data against a Zod schema
 *
 * @param data - The data to validate (can be FormData or plain object)
 * @param schema - The Zod schema to validate against
 * @returns The validated and parsed data
 * @throws ValidationError with details if validation fails
 */
export function validateRequest<T>(
  data: FormData | Record<string, any>,
  schema: ZodSchema<T>
): T {
  try {
    // Convert FormData to plain object if needed
    const inputData = data instanceof FormData ? formDataToObject(data) : data;

    // Validate against schema
    return schema.parse(inputData);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = getZodIssues(error);

      throw new ValidationError(
        `Validation failed: ${details.map((d) => d.message).join(", ")}`,
        details
      );
    }
    throw error;
  }
}

/**
 * Converts FormData to a plain object
 * Handles file fields appropriately
 */
function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Skip only null values. Empty strings must be preserved to trigger Zod's .min(1) messages.
    if (value === null) return;

    // Handle multiple values for the same key (arrays)
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

/**
 * Creates a validation middleware for API routes
 *
 * @param schema - The Zod schema to validate against
 * @returns A function that validates and returns parsed data or error response
 *
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   const data = await req.formData();
 *
 *   const validated = await validateOrRespond(data, skillSchema);
 *   if (validated instanceof NextResponse) {
 *     return validated; // Error response
 *   }
 *
 *   // Use validated data
 *   const result = await createSkill(validated);
 * }
 * ```
 */
export async function validateOrRespond<T>(
  data: FormData | Record<string, any>,
  schema: ZodSchema<T>
): Promise<T | NextResponse> {
  try {
    return validateRequest(data, schema);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        } as ValidationErrorResponse,
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 400 }
    );
  }
}

/**
 * Validates reorder items payload
 */
export function validateReorderItems(items: unknown) {
  const { reorderItemsSchema } = require("@/lib/validation");

  try {
    return reorderItemsSchema.parse({ items });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        "Invalid reorder items data",
        getZodIssues(error)
      );
    }
    throw error;
  }
}
