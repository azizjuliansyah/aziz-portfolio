"use client";

import { LucideIcon, Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "secondary";
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
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-lg hover:shadow-blue-600/20 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    danger: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10",
    secondary: "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
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
