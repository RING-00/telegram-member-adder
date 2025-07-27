'use client';

import { RainbowBorder } from '@/components/layout/global/rainbow-animation';
import { StatisticsCard } from '@/components/layout/stats/card.stat';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Stats } from '@/types/stats-data';
import { memo } from 'react';

const TEXT_STYLES = {
  label: 'text-xs text-muted-foreground',
  value: 'text-sm font-medium',
  header: 'text-sm font-medium',
  badge: 'text-xs',
} as const;

interface TotalStatsProps {
  stats: Stats;
  className?: string;
}

interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatRow({ label, value, highlight = false }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className={TEXT_STYLES.label}>{label}</span>
      <span className={cn(TEXT_STYLES.value, highlight && 'text-primary')}>{value}</span>
    </div>
  );
}

export const TotalStats = memo(function TotalStats({ stats, className }: TotalStatsProps) {
  return (
    <StatisticsCard title="Statistics Overview" className={className}>
      <div className="space-y-4">
        {/* Main Statistics */}
        <div className="space-y-3">
          <h3 className={TEXT_STYLES.header}>Main Statistics</h3>
          <div className="space-y-2">
            <StatRow label="Total Test Sessions" value={stats.totalTestSessions.toLocaleString()} highlight />
            <StatRow label="Passed Tests" value={stats.totalPassedTests.toLocaleString()} />
            <StatRow label="Failed Tests" value={stats.totalFailedTests.toLocaleString()} />
            <StatRow label="Total Duration" value={stats.totalDuration} />
            <StatRow label="Total Operators" value={stats.totalOperators.toLocaleString()} />
            <StatRow label="Total Products" value={stats.totalProducts.toLocaleString()} />
          </div>
        </div>

        <StatisticsCard showHeader={false} className="bg-muted/30">
          <RainbowBorder position="top" />
          <div className="space-y-3">
            <h3 className={TEXT_STYLES.header}>Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={TEXT_STYLES.label}>Average Duration</span>
                <Badge variant="outline" className={TEXT_STYLES.badge}>
                  {stats.averageDuration}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className={TEXT_STYLES.label}>Average Pass Rate</span>
                <Badge
                  variant={
                    stats.averagePassRate >= 80 ? 'default' : stats.averagePassRate >= 60 ? 'secondary' : 'destructive'
                  }
                  className={TEXT_STYLES.badge}
                >
                  {stats.averagePassRate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </StatisticsCard>

        <div className="space-y-3">
          <h3 className={TEXT_STYLES.header}>Latest Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={TEXT_STYLES.label}>Latest Operator</span>
              <Badge variant="outline" className={cn(TEXT_STYLES.badge, 'block max-w-24 truncate')}>
                {stats.latestOperatorId}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className={TEXT_STYLES.label}>Latest Test Session</span>
              <Badge variant="secondary" className={cn(TEXT_STYLES.badge, 'block max-w-24 truncate')}>
                {stats.latestTestSessionId}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </StatisticsCard>
  );
});

TotalStats.displayName = 'TotalStats';
