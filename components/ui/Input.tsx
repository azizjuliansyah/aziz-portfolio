"use client";

import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

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
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
        )}
        <input
          id={id}
          className={`
            block w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 
            focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-900 transition-all 
            text-sm py-2.5 outline-none border
            ${Icon ? "pl-10" : "px-4"}
            ${className}
          `}
          {...props}
        />
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}
