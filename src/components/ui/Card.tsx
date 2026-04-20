import React, { ReactNode, HTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  title,
  icon: Icon,
  className = "",
  contentClassName = "",
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface-container-low rounded-2xl shadow-sm border border-outline/10 overflow-hidden ${className}`}
      {...props}
    >
      {(title || Icon) && (
        <div className="px-8 pt-8 pb-4 flex items-center gap-3 border-b border-outline/10 mb-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          {title && <h3 className="font-bold text-on-surface text-sm">{title}</h3>}
        </div>
      )}
      <div className={`${noPadding ? "" : (title || Icon ? "px-6 pb-6 pt-2" : "p-6")} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`bg-primary/5 p-8 text-center border-b border-outline/10 ${className}`}>
      {children}
    </div>
  );
}
