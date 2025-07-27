'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, MouseEventHandler } from 'react';

interface ActionProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
}

interface StatisticsErrorProps extends Omit<ComponentPropsWithoutRef<typeof Card>, 'title'> {
  title?: string;
  description?: string;
  icon?: 'alert' | 'error';
  action?: ActionProps;
}

export function StatisticsError({
  title = 'Statistics Data Error',
  description = 'An error occurred while retrieving statistics data. Please try again.',
  icon = 'alert',
  action,
  className,
  ...cardProps
}: StatisticsErrorProps) {
  const Icon = icon === 'alert' ? AlertCircle : XCircle;

  return (
    <Card className={cn('mx-auto w-[400px] max-w-full shadow-lg', className)} {...cardProps}>
      <CardHeader className="space-y-2 text-center">
        <Icon className="text-destructive mx-auto h-12 w-12" aria-hidden="true" />
        <CardTitle className={cn('text-md font-semibold tracking-tight', icon === 'error' && 'text-destructive')}>
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-center">
          {action &&
            (action.href ? (
              <Button asChild variant="destructive" size="sm">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} variant="destructive" size="sm">
                {action.label}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

StatisticsError.displayName = 'StatisticsError';
