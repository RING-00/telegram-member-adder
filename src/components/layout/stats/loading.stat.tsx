'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

interface StatisticsLoadingProps extends Omit<ComponentPropsWithoutRef<typeof Card>, 'title'> {
  title?: string;
  description?: string;
  loadingText?: string;
  statusText?: string;
  progress?: number;
  error?: boolean;
}

export function StatisticsLoading({
  title = 'Loading Statistics Data',
  description = 'Fetching information from server...',
  loadingText = 'Retrieving statistics information',
  statusText = 'Please wait...',
  progress,
  error = false,
  className,
  ...cardProps
}: StatisticsLoadingProps) {
  const currentProgress =
    typeof progress === 'number' && !Number.isNaN(progress) ? Math.max(0, Math.min(100, progress)) : undefined;

  return (
    <Card className={cn('mx-auto w-[400px] max-w-full shadow-lg', className)} {...cardProps}>
      <CardHeader className="space-y-2 text-center">
        <Loader2
          className={cn('mx-auto h-12 w-12 animate-spin', error ? 'text-destructive' : 'text-primary')}
          aria-hidden="true"
        />
        <CardTitle className={cn(error && 'text-destructive')}>{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-3">
          <Progress
            value={currentProgress}
            className={cn('w-full', error && 'bg-destructive/20 [&>div]:bg-destructive')}
            aria-label={`Loading progress: ${currentProgress ?? 0}%`}
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{loadingText}</span>
            <span>{statusText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

StatisticsLoading.displayName = 'StatisticsLoading';
