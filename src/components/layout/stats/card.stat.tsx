'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface StatisticsCardProps extends Omit<ComponentPropsWithoutRef<typeof Card>, 'title' | 'children'> {
  title?: string;
  titleExtra?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  showHeader?: boolean;
  headerClassName?: string;
}

interface StatisticsCardHeaderProps {
  title: string;
  titleExtra?: ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
  headerClassName?: string;
}

function StatisticsCardHeader({
  title,
  titleExtra,
  icon: Icon,
  iconClassName,
  headerClassName,
}: StatisticsCardHeaderProps) {
  return (
    <header
      className={cn('bg-background/25 flex w-full items-center justify-between border-b px-4 py-2 shadow-xs', headerClassName)}
    >
      <div className="flex items-center gap-4">
        {Icon && <Icon className={cn('text-muted-foreground h-5 w-5', iconClassName)} aria-hidden="true" />}
        <CardTitle className="text-md font-medium tracking-tight">{title}</CardTitle>
      </div>
      {titleExtra && <div className="flex max-h-7 items-center">{titleExtra}</div>}
    </header>
  );
}

export function StatisticsCard({
  title,
  titleExtra,
  children,
  className,
  contentClassName,
  icon,
  iconClassName,
  showHeader = true,
  headerClassName,
  ...cardProps
}: StatisticsCardProps) {
  const shouldShowHeader = showHeader && title;

  return (
    <Card className={cn('relative h-full overflow-hidden', shouldShowHeader ? 'p-0' : 'p-4', className)} {...cardProps}>
      {shouldShowHeader && (
        <StatisticsCardHeader
          title={title}
          titleExtra={titleExtra}
          icon={icon}
          iconClassName={iconClassName}
          headerClassName={headerClassName}
        />
      )}
      <CardContent className={cn('flex-1', shouldShowHeader ? '' : 'p-0')}>
        <div className={cn('space-y-4', contentClassName)}>{children}</div>
      </CardContent>
    </Card>
  );
}

StatisticsCard.displayName = 'StatisticsCard';
