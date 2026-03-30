"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showDetails?: boolean;
}

/**
 * Reusable error fallback component
 * Can be used with ErrorBoundary or standalone
 *
 * @example
 * ```tsx
 * <ErrorFallback
 *   error={error}
 *   resetError={reset}
 *   title="Custom Error Title"
 * />
 * ```
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  message,
  showDetails = false,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-surface-container-low rounded-2xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-on-surface mb-2 font-headline">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-on-surface/70 mb-6 font-body">
          {message || error?.message || "An unexpected error occurred"}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <Button
              onClick={resetError}
              className="shadow-lg shadow-primary/20"
            >
              Try Again
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && error && process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-on-surface/50 hover:text-on-surface transition-colors">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-surface-container rounded-lg text-xs text-on-surface/80 overflow-auto font-mono">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

/**
 * Simple inline error component for smaller spaces
 */
export const InlineError: React.FC<{
  error?: string;
  onRetry?: () => void;
}> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-error-container/10 rounded-xl border border-error/20">
      <svg
        className="w-8 h-8 text-error mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-error text-center text-sm font-label">{error || "An error occurred"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
