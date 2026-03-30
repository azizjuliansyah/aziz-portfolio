import React from "react";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "success";
  children: React.ReactNode;
}

export function ActionButton({ variant = "default", className = "", children, ...props }: ActionButtonProps) {
  const baseClasses = "p-1.5 rounded-lg transition-colors border border-transparent shadow-sm flex items-center justify-center cursor-pointer";
  
  const variantClasses = {
    default: "text-on-surface/40 hover:text-primary hover:bg-surface-container hover:border-outline/10",
    primary: "text-on-surface/40 hover:text-primary hover:bg-primary/10 hover:border-primary/20",
    danger: "text-on-surface/40 hover:text-error hover:bg-error/10 hover:border-error/20",
    success: "text-on-surface/40 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type="button"
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // Enforce a consistent size for Lucide icons passed directly
          const props = child.props as any;
          const childClassName = props.className || '';
          if (!childClassName.includes('w-') && !childClassName.includes('h-')) {
            return React.cloneElement(child, { 
              className: `${childClassName} w-3.5 h-3.5`.trim() 
            } as any);
          }
        }
        return child;
      })}
    </button>
  );
}
