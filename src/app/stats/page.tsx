'use client';

import { ConnectionLoading } from '@/components/layout/stats/connection-loading.stat';
import { StatisticsLoading } from '@/components/layout/stats/loading.stat';
import { StatsMonitor } from '@/components/layout/stats/stats';
import { useStatsData } from '@/contexts/stats-data-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StatsPage() {
  const { statsData, isConnected, isConnecting } = useStatsData();
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

  if (!isConnected || isConnecting) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ConnectionLoading />
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <StatisticsLoading
          title="Loading Statistics Data"
          description="Fetching statistics information from server..."
          loadingText="Loading"
          statusText="Retrieving statistics data..."
        />
      </div>
    );
  }

  return <StatsMonitor />;
}
