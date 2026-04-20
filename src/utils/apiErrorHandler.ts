import { NextResponse } from "next/server";
import { AppError, getErrorMessage, parseApiError } from "@/types/error";

/**
 * Standard API error response format
 */
interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error("API Error:", error);

  const parsedError = parseApiError(error);

  // Determine status code
  const statusCode = parsedError.statusCode || 500;

  return NextResponse.json(
    {
      error: parsedError.message,
      code: parsedError.code,
      details: parsedError.details,
    } as ErrorResponse,
    { status: statusCode }
  );
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ErrorResponse>> {
  return handler().catch((error) => handleApiError(error));
}

/**
 * Common error responses
 */
export const errorResponses = {
  badRequest: (message: string = "Bad request") =>
    NextResponse.json({ error: message }, { status: 400 }),

  unauthorized: (message: string = "Unauthorized") =>
    NextResponse.json({ error: message }, { status: 401 }),

  forbidden: (message: string = "Forbidden") =>
    NextResponse.json({ error: message }, { status: 403 }),

  notFound: (message: string = "Resource not found") =>
    NextResponse.json({ error: message }, { status: 404 }),

  internalServerError: (message: string = "Internal server error") =>
    NextResponse.json({ error: message }, { status: 500 }),

  conflict: (message: string = "Resource conflict") =>
    NextResponse.json({ error: message }, { status: 409 }),
};

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}
