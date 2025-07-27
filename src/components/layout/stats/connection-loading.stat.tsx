'use client';

import { StatisticsError } from '@/components/layout/stats/error.stat';
import { StatisticsLoading } from '@/components/layout/stats/loading.stat';
import { wsService } from '@/lib/websocket';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_CONNECT_PROGRESS = 5;

export function ConnectionLoading() {
  const [serviceRetryCount, setServiceRetryCount] = useState(() => wsService.getReconnectAttempts());

  const [maxRetries, setMaxRetries] = useState(() => wsService.getMaxReconnectAttempts());

  const [isFailed, setIsFailed] = useState(false);

  const updateDisplayStateFromService = useCallback(() => {
    const currentRetries = wsService.getReconnectAttempts();
    const maxServiceRetries = wsService.getMaxReconnectAttempts();

    setServiceRetryCount(currentRetries);
    setMaxRetries(maxServiceRetries);

    setIsFailed(currentRetries >= maxServiceRetries);
  }, []);

  useEffect(() => {
    updateDisplayStateFromService();

    wsService.on('error', updateDisplayStateFromService);
    wsService.on('disconnect', updateDisplayStateFromService);

    return () => {
      wsService.off('error', updateDisplayStateFromService);
      wsService.off('disconnect', updateDisplayStateFromService);
    };
  }, [updateDisplayStateFromService]);

  const isInitialAttempt = serviceRetryCount === 0;

  const loadingText = isInitialAttempt
    ? 'Attempting initial connection...'
    : `Retry Attempt ${serviceRetryCount} of ${maxRetries}`;
  const statusText = isInitialAttempt ? 'Please wait...' : 'Retrying connection...';

  const progress = isInitialAttempt ? INITIAL_CONNECT_PROGRESS : (serviceRetryCount / maxRetries) * 100;

  if (isFailed) {
    return (
      <StatisticsError
        title="Connection Error"
        description="Could not connect to statistics service. Please check your connection and try again."
        icon="error"
        action={{
          label: 'Retry Connection',
          onClick: () => {
            setIsFailed(false);
            setServiceRetryCount(0);
            wsService.connect().catch(() => {});
          },
        }}
      />
    );
  }

  return (
    <StatisticsLoading
      title="Connecting to Statistics Service"
      description="Establishing connection to statistics service..."
      loadingText={loadingText}
      statusText={statusText}
      progress={progress}
      error={false}
    />
  );
}

ConnectionLoading.displayName = 'ConnectionLoading';
