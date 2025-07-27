'use client';

import { ConnectionLoading } from '@/components/layout/stats/connection-loading.stat';
import { StatisticsLoading } from '@/components/layout/stats/loading.stat';
import { useStatsData } from '@/contexts/stats-data-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { statsData, isConnected, isConnecting } = useStatsData();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && statsData) {
      router.push('/stats');
    }
  }, [
    isConnected,
    statsData,
    router,
  ]);

  if (isConnecting || !isConnected) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ConnectionLoading />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <StatisticsLoading
        title="Loading Statistics"
        description="Preparing statistics dashboard..."
        loadingText="Loading"
        statusText="Setting up your dashboard..."
      />
    </div>
  );
}
