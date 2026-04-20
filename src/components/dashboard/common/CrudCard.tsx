import React from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Generic CRUD Card Component
 * Eliminates duplication across all entity cards (Project, Skill, Experience, SocialLink)
 *
 * @template T - The entity type
 * @param item - The entity data to display
 * @param index - The order index for display
 * @param onEdit - Callback when edit button is clicked
 * @param onDelete - Callback when delete button is clicked
 * @param renderContent - Function to render the card body (entity-specific)
 * @param renderHeaderActions - Optional function to render additional header actions
 * @param variant - Visual variant ('default' | 'compact' | 'detailed')
 */
export interface CrudCardProps<T> {
  item: T;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  renderContent: (item: T) => React.ReactNode;
  renderHeaderActions?: (item: T) => React.ReactNode;
  variant?: "default" | "compact" | "detailed";
  showRank?: boolean;
  rankNumber?: number;
  extraActions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger" | "primary";
  }>;
}

export function CrudCard<T extends { id: string }>({
  item,
  index,
  onEdit,
  onDelete,
  renderContent,
  renderHeaderActions,
  variant = "default",
  showRank = true,
  rankNumber,
  extraActions = [],
}: CrudCardProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const displayRank = rankNumber ?? index + 1;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className="bg-surface-container-low rounded-2xl group relative overflow-hidden transition-all duration-300 flex flex-col h-full border border-outline/10 hover:border-primary/50 shadow-sm hover:shadow-md"
      >
        {/* Header Section */}
        <div className="px-3 py-2 bg-surface-container-low border-b border-outline/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div
              {...listeners}
              className="p-1.5 bg-surface rounded-lg cursor-grab active:cursor-grabbing text-on-surface/60 hover:text-primary shadow-sm"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Rank Number */}
            {showRank && (
              <div className="px-2 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg shadow-sm flex items-center">
                #{displayRank}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
            {/* Extra Actions */}
            {extraActions.map((action, idx) => (
              <ActionButton
                key={idx}
                onClick={action.onClick}
                variant={action.variant}
                title={action.label}
              >
                {action.icon}
              </ActionButton>
            ))}

            {/* Custom Header Actions */}
            {renderHeaderActions?.(item)}

            {/* Edit Action */}
            <ActionButton
              onClick={onEdit}
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </ActionButton>

            {/* Delete Action */}
            <ActionButton
              onClick={onDelete}
              variant="danger"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </ActionButton>
          </div>
        </div>

        {/* Body Section - Entity Specific Content */}
        <div className="p-3">{renderContent(item)}</div>
      </div>
    </div>
  );
}
