'use client';

import { StatisticsCard } from '@/components/layout/stats/card.stat';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Stats, TopOperator } from '@/types/stats-data';
import { memo } from 'react';

const TEXT_STYLES = {
  label: 'text-xs text-muted-foreground',
  value: 'text-sm font-medium',
  header: 'text-sm font-medium',
  badge: 'text-xs',
} as const;

interface TopOperatorsProps {
  stats: Stats;
  className?: string;
}

interface OperatorRowProps {
  operator: TopOperator;
  index: number;
}

function OperatorRow({ operator }: OperatorRowProps) {
  return (
    <div key={operator.operatorId}>
      <div className="flex items-center justify-between">
        <h3 className={TEXT_STYLES.header}>{operator.operatorName}</h3>
      </div>
      <div className="flex items-center justify-between">
        <span className={TEXT_STYLES.label}>Operator ID</span>
        <Badge variant="outline" className={cn(TEXT_STYLES.badge, 'block max-w-24 truncate')}>
          {operator.operatorId}
        </Badge>
      </div>
    </div>
  );
}

export const TopOperators = memo(function TopOperators({ stats, className }: TopOperatorsProps) {
  return (
    <StatisticsCard
      title="Top Operators"
      titleExtra={
        <Badge variant="outline" className={TEXT_STYLES.badge}>
          {stats.totalTestSessions.toLocaleString()} Sessions
        </Badge>
      }
      className={className}
    >
      {stats.topOperators.map((operator, index) => (
        <OperatorRow key={operator.operatorId} operator={operator} index={index} />
      ))}
    </StatisticsCard>
  );
});

TopOperators.displayName = 'TopOperators';
