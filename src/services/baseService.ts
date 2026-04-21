import { ValidationError } from "@/types";

/**
 * BaseService - Abstract base class for all CRUD services
 * Eliminates code duplication across entity services
 */
export abstract class BaseService<T> {
  /**
   * API endpoint path (e.g., "/api/projects")
   */
  protected abstract endpoint: string;

  /**
   * Entity name for error messages (e.g., "project", "skill")
   */
  protected abstract entityName: string;

  /**
   * Content type for POST/PUT requests
   * - "multipart/form-data" for FormData (file uploads)
   * - "application/json" for JSON payloads
   */
  protected contentType: "multipart/form-data" | "application/json" = "application/json";

  /**
   * Helper untuk menangani generic API error & validasi Zod
   */
  protected async handleApiError(res: Response, defaultMessage: string): Promise<never> {
    if (!res.ok) {
      try {
        const errorData = await res.json();
        if (errorData?.details) {
          throw new ValidationError(errorData.error || defaultMessage, errorData.details);
        }
        throw new Error(errorData?.error || defaultMessage);
      } catch (e) {
        if (e instanceof ValidationError) throw e;
        throw new Error(defaultMessage);
      }
    }
    throw new Error(defaultMessage); // Fallback
  }

  /**
   * Fetch all entities with optional profile filter
   */
  async fetchAll(profileId?: string): Promise<T[]> {
    const url = profileId
      ? `${this.endpoint}?profileId=${profileId}`
      : this.endpoint;

    const res = await fetch(url);
    if (!res.ok) {
      await this.handleApiError(res, `Failed to fetch ${this.entityName}s`);
    }
    return res.json();
  }

  /**
   * Reorder entities with new order values
   */
  async reorder(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch(`${this.endpoint}/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      await this.handleApiError(res, `Failed to reorder ${this.entityName}s`);
    }
  }

  /**
   * Fetch single entity by ID
   */
  async getById(id: string): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`);
    if (!res.ok) {
      await this.handleApiError(res, `Failed to fetch ${this.entityName}`);
    }
    return res.json();
  }

  /**
   * Create a new entity
   */
  async create(data: FormData | Record<string, any>): Promise<T> {
    const isFormData = data instanceof FormData;

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data as FormData : JSON.stringify(data),
    });

    if (!res.ok) {
      await this.handleApiError(res, `Failed to create ${this.entityName}`);
    }
    return res.json();
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: FormData | Record<string, any>): Promise<T> {
    const isFormData = data instanceof FormData;

    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data as FormData : JSON.stringify(data),
    });

    if (!res.ok) {
      await this.handleApiError(res, `Failed to update ${this.entityName}`);
    }
    return res.json();
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      await this.handleApiError(res, `Failed to delete ${this.entityName}`);
    }
  }

  /**
   * Partially update an entity (PATCH)
   */
  async patch(id: string, data: Record<string, any>): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      await this.handleApiError(res, `Failed to patch ${this.entityName}`);
    }
    return res.json();
  }
}
