import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <div className={noPadding ? "" : "p-8"}>
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
    <div className={`bg-primary/5 p-8 text-center border-b border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}
