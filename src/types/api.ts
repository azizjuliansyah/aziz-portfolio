import { NextResponse } from "next/server";

/**
 * Standard API response types for type-safe API contracts
 * Provides consistent response structure across all API routes
 */

/**
 * Success response wrapper
 * @template T - Type of data being returned
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * Error response structure
 * Matches error handler format in utils/apiErrorHandler.ts
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  timestamp?: string;
}

/**
 * Paginated response for list endpoints
 * @template T - Type of items in the data array
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response from CREATE operations (POST)
 * @template T - Type of created resource
 */
export interface CreateResponse<T> {
  data: T;
  message: string;
}

/**
 * Response from UPDATE operations (PUT/PATCH)
 * @template T - Type of updated resource
 */
export interface UpdateResponse<T> {
  data: T;
  message: string;
}

/**
 * Response from DELETE operations
 */
export interface DeleteResponse {
  message: string;
  deletedId: string | number;
}

/**
 * Response from REORDER operations
 */
export interface ReorderResponse {
  message: string;
  reorderedCount: number;
}

/**
 * Type guard to check if response is success ApiResponse
 * @param obj - Object to check
 */
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj
  );
}

/**
 * Type guard to check if response is error response
 * @param obj - Object to check
 */
export function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'error' in obj
  );
}

/**
 * Helper to create success response
 * @param data - Response data
 * @param message - Optional success message
 * @param status - HTTP status code (default: 200)
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    {
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    },
    { status }
  );
}

/**
 * Helper to create paginated response
 * @param data - Array of items
 * @param pagination - Pagination metadata
 * @param status - HTTP status code (default: 200)
 */
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  },
  status: number = 200
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json<PaginatedResponse<T>>(
    { data, pagination },
    { status }
  );
}
