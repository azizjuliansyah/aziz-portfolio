"use client";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton width={200} height={32} />
          <Skeleton width={400} height={24} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="h-full" contentClassName="flex flex-col items-center space-y-4">
            <Skeleton width={128} height={128} className="rounded-full" />
            <Skeleton width={150} height={24} />
            <Skeleton width={200} height={16} />
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="h-[400px]" contentClassName="space-y-4">
            <Skeleton width={200} height={24} className="mb-4" />
            <Skeleton className="w-full" height={40} />
            <Skeleton className="w-full" height={40} />
            <Skeleton className="w-full" height={40} />
          </Card>
        </div>
      </div>
    </div>
  );
}
