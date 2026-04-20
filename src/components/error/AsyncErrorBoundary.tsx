"use client";

import React, { Component, ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface AsyncErrorBoundaryState {
  error: Error | null;
}

/**
 * Error Boundary specifically for async operations
 * Catches errors from promises, async/await, and data fetching
 *
 * @example
 * ```tsx
 * <AsyncErrorBoundary>
 *   <UserProfile />
 * </AsyncErrorBoundary>
 * ```
 */
export class AsyncErrorBoundary extends Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = { error: null };

    // Handle unhandled promise rejections
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", this.handlePromiseRejection);
    }
  }

  componentDidMount(): void {
    // Track component is mounted
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    // Clean up event listener
    if (typeof window !== "undefined") {
      window.removeEventListener("unhandledrejection", this.handlePromiseRejection);
    }
    this._isMounted = false;
  }

  private _isMounted = false;

  handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    if (this._isMounted && event.reason instanceof Error) {
      this.setState({ error: event.reason });

      // Prevent default browser error handling
      event.preventDefault();

      // Call custom error handler
      if (this.props.onError) {
        this.props.onError(event.reason);
      }
    }
  };

  handleReset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use regular ErrorBoundary's error UI
      return (
        <ErrorBoundary
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface px-4">
              <div className="max-w-md w-full bg-surface-container-low rounded-2xl shadow-lg p-8 text-center">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-on-surface mb-2 font-headline">
                  Loading Error
                </h1>

                <p className="text-on-surface/70 mb-6 font-body">
                  {this.state.error.message || "Failed to load data"}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleReset}
                    className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-container-high transition-colors border border-outline/10"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          }
        >
          {null}
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}
