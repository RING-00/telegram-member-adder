'use client';

import { StatisticsError } from '@/components/layout/stats/error.stat';
import { StatisticsLoading } from '@/components/layout/stats/loading.stat';
import { ProductStats } from '@/components/layout/stats/parts/product.part';
import { TopOperators } from '@/components/layout/stats/parts/top.part';
import { TotalStats } from '@/components/layout/stats/parts/total.part';
import { useStatsData } from '@/contexts/stats-data-context';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

const STYLES = {
  container: 'min-w-4xl mx-auto',
  grid: 'grid grid-cols-3 md:grid-cols-3 grid-rows-3 md:grid-rows-5 gap-2 md:gap-2 m-4',
  productCard:
    'col-start-1 row-start-1 col-span-2 row-span-3 md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-5',
  topCard: 'col-start-3 row-start-1 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-1',
  totalCard: 'col-start-3 row-start-2 row-span-2 md:col-start-3 md:row-start-2 md:col-span-1 md:row-span-4',
  emptyState: {
    wrapper: 'flex items-center justify-center w-full',
    content: 'text-center',
    title: 'text-2xl font-bold',
    description: 'text-muted-foreground',
  },
} as const;

export const StatsMonitor = memo(function StatsMonitor() {
  const { statsData, isConnected, isConnecting, reconnect } = useStatsData();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      const timeout = setTimeout(() => router.push('/'), 5000);
      return () => clearTimeout(timeout);
    }
  }, [
    isConnected,
    isConnecting,
    router,
  ]);

  if (!statsData) {
    return (
      <StatisticsLoading
        title="Loading Statistics Data"
        description="Fetching statistics information from server..."
        loadingText="Retrieving statistics data"
        statusText="Please wait..."
      />
    );
  }

  if (!isConnected && !isConnecting) {
    return (
      <StatisticsError
        title="Connection Lost"
        description="Lost connection to the statistics server. Attempting to reconnect..."
        icon="error"
        action={{
          label: 'Try Reconnect',
          onClick: () => reconnect(),
        }}
      />
    );
  }

  return (
    <div className={STYLES.container}>
      <div className={STYLES.grid}>
        <div className={STYLES.productCard}>
          <ProductStats stats={statsData} />
        </div>

        <div className={STYLES.topCard}>
          <TopOperators stats={statsData} />
        </div>

        <div className={STYLES.totalCard}>
          <TotalStats stats={statsData} />
        </div>
      </div>
    </div>
  );
});

StatsMonitor.displayName = 'StatsMonitor';
