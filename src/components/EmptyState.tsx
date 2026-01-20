"use client";

import { IconInbox } from "@tabler/icons-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyStateProps {
  /**
   * Icon component to display
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Primary action button text
   */
  actionText?: string;
  /**
   * Primary action callback
   */
  onAction?: () => void;
}

/**
 * Empty state component for when there's no data
 *
 * @example
 * ```tsx
 * {data.length === 0 && (
 *   <EmptyState
 *     title="No items found"
 *     description="Get started by adding your first item"
 *     actionText="Add Item"
 *     onAction={() => router.push('/add')}
   />
 * )}
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {icon || <IconInbox className="h-8 w-8 text-gray-400" />}
        </div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {actionText && onAction && (
        <CardContent className="text-center">
          <Button onClick={onAction}>{actionText}</Button>
        </CardContent>
      )}
    </Card>
  );
}

export default EmptyState;
