import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { getErrorMessage, ValidationError } from "@/types";
import { BaseService } from "@/services/baseService";

export interface CrudResult<T = any> {
  success: boolean;
  errors?: Record<string, string>;
  data?: T;
}

/**
 * Generic CRUD hook that eliminates code duplication across entity hooks
 *
 * @template T - The entity type (e.g., Project, Skill, WorkExperience)
 * @param service - The service instance extending BaseService
 * @param options - Configuration options
 * @param options.entityName - Human-readable entity name for messages (e.g., "project", "skill")
 * @param options.profileId - Optional profile ID for filtering
 * @returns CRUD state and methods
 */
export function useCRUD<T extends { id: string; order?: number }>(
  service: BaseService<T>,
  options: {
    entityName: string;
    profileId?: string;
  }
) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, [options.profileId]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await service.fetchAll(options.profileId);
      setItems(data);
    } catch (error) {
      toast.error(
        getErrorMessage(error) || `Failed to fetch ${options.entityName}s`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const reorderItems = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      setItems(updatedItems);

      try {
        await service.reorder(
          updatedItems.map((item) => ({ id: item.id, order: item.order || 0 }))
        );
      } catch (error) {
        toast.error(
          getErrorMessage(error) || "Failed to save reorder"
        );
        fetchItems(); // Revert on error
      }
    }
  };

  const createItem = async (
    data: FormData | Record<string, any>
  ): Promise<CrudResult> => {
    setIsSubmitting(true);
    try {
      const newItem = await service.create(data);
      toast.success(`${options.entityName} created successfully`);
      fetchItems();
      return { success: true, data: newItem };
    } catch (error) {
      if (error instanceof ValidationError && error.details) {
        const errors: Record<string, string> = {};
        error.details.forEach((d) => {
          if (d.path[0]) errors[d.path[0]] = d.message;
        });
        // Tidak menampilkan toast untuk error validasi individual
        return { success: false, errors };
      }
      toast.error(
        getErrorMessage(error) || `Failed to create ${options.entityName}`
      );
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = async (
    id: string,
    data: FormData | Record<string, any>
  ): Promise<CrudResult> => {
    setIsSubmitting(true);
    try {
      const updatedItem = await service.update(id, data);
      toast.success(`${options.entityName} updated successfully`);
      fetchItems();
      return { success: true, data: updatedItem };
    } catch (error) {
      if (error instanceof ValidationError && error.details) {
        const errors: Record<string, string> = {};
        error.details.forEach((d) => {
          if (d.path[0]) errors[d.path[0]] = d.message;
        });
        return { success: false, errors };
      }
      toast.error(
        getErrorMessage(error) || `Failed to update ${options.entityName}`
      );
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const patchItem = async (
    id: string,
    data: Record<string, any>
  ): Promise<CrudResult> => {
    setIsSubmitting(true);
    try {
      const updatedItem = await service.patch(id, data);
      toast.success(`${options.entityName} updated successfully`);
      fetchItems();
      return { success: true, data: updatedItem };
    } catch (error) {
      if (error instanceof ValidationError && error.details) {
        const errors: Record<string, string> = {};
        error.details.forEach((d) => {
          if (d.path[0]) errors[d.path[0]] = d.message;
        });
        return { success: false, errors };
      }
      toast.error(
        getErrorMessage(error) || `Failed to update ${options.entityName}`
      );
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await service.delete(id);
      toast.success(`${options.entityName} deleted successfully`);
      setItems(items.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error) || `Failed to delete ${options.entityName}`
      );
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    items,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderItems,
    createItem,
    updateItem,
    patchItem,
    deleteItem,
    refreshItems: fetchItems,
  };
}
