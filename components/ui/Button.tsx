"use client";

import { LucideIcon, Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "secondary" | "outline";
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-label font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "text-on-primary bg-primary hover:bg-primary-dim shadow-sm hover:shadow-lg hover:shadow-primary/20 focus:ring-2 focus:ring-primary focus:ring-offset-2",
    danger: "text-error hover:bg-error-container/10",
    secondary: "bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/15",
    ghost: "text-on-surface-variant hover:bg-surface-container-low",
    outline: "bg-transparent text-on-surface border-2 border-outline-variant/30 hover:border-outline hover:bg-surface-container-low",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-5 h-5" />}
          {children}
          {RightIcon && <RightIcon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
}
