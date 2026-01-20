"use client";

import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorStateProps {
  /**
   * Error object or message
   */
  error?: unknown;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Custom description
   */
  description?: string;
  /**
   * Retry button text
   * @default "Try Again"
   */
  retryText?: string;
  /**
   * Retry callback
   */
  onRetry?: () => void;
  /**
   * Show error details in development
   * @default true
   */
  showDetails?: boolean;
}

/**
 * Error state component for displaying errors with retry option
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorState
 *     error={error}
 *     onRetry={() => refetch()}
 *   />
 * )}
 * ```
 */
export function ErrorState({
  error,
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  retryText = "Try Again",
  onRetry,
  showDetails = true,
}: ErrorStateProps) {
  const errorMessage =
    (error as any)?.message || (typeof error === "string" ? error : undefined);

  return (
    <Card className="border-destructive">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <IconAlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {process.env.NODE_ENV === "development" &&
        showDetails &&
        errorMessage && (
          <CardContent>
            <div className="rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                Error Details:
              </p>
              <pre className="text-xs text-red-800 dark:text-red-200 overflow-auto max-h-32 whitespace-pre-wrap break-words">
                {errorMessage}
              </pre>
            </div>
          </CardContent>
        )}

      {onRetry && (
        <CardContent className="text-center pt-0">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <IconRefresh className="h-4 w-4" />
            {retryText}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default ErrorState;
