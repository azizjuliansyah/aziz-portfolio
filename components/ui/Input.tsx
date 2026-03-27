"use client";

import { LucideIcon } from "lucide-react";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  className?: string;
  containerClassName?: string;
  helperText?: React.ReactNode;
}

export function Input({
  label,
  icon: Icon,
  className = "",
  containerClassName = "",
  helperText,
  id,
  ...props
}: InputProps) {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-on-surface/80 ml-1">
          {label}
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
          className={`
            block w-full rounded-xl border border-outline/10 bg-surface-container-low 
            focus:border-primary focus:ring-primary focus:ring-offset-0 transition-all 
            text-sm py-2.5 outline-none text-on-surface placeholder:text-on-surface/30
            ${Icon ? "pl-10" : "px-4"}
            ${className}
          `}
          {...props}
        />
      </div>
      {helperText && (
        <p className="text-xs text-on-surface/60 mt-1.5 ml-1 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}
