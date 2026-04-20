"use client";

import { LucideIcon } from "lucide-react";
import React, { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  className?: string;
  containerClassName?: string;
  helperText?: React.ReactNode;
  error?: string;
}

export function Input({
  label,
  icon: Icon,
  className = "",
  containerClassName = "",
  helperText,
  error,
  id: providedId,
  required,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = providedId || autoId;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-on-surface/80 ml-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
            <Icon className="h-5 w-5 text-on-surface/40 group-focus-within:text-primary transition-colors" />
          </div>
        )}
        <input
          id={id}
          suppressHydrationWarning
          className={`
            block w-full rounded-xl border bg-surface-container-low 
            transition-all text-sm py-2.5 outline-none text-on-surface placeholder:text-on-surface/30
            ${error 
              ? "border-error focus:border-error focus:ring-error focus:ring-offset-0 text-error" 
              : "border-outline/10 focus:border-primary focus:ring-primary focus:ring-offset-0"}
            ${Icon ? "pl-10" : "px-4"}
            ${className}
          `}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-error font-medium mt-1.5 ml-1 leading-relaxed">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-on-surface/60 mt-1.5 ml-1 leading-relaxed">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
