'use client';

import { logger } from '@/lib/logger';
import { wsService } from '@/lib/websocket';
import type { Stats } from '@/types/stats-data';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface StatsDataContextType {
  statsData: Stats | null;
  isConnected: boolean;
  isConnecting: boolean;
  reconnect: () => Promise<void>;
  disconnect: () => void;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

const StatsDataContext = createContext<StatsDataContextType | undefined>(undefined);

interface StatsDataProviderProps {
  children: ReactNode;
}

export function StatsDataProvider({ children }: StatsDataProviderProps) {
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(() => wsService.getMaxReconnectAttempts());

  const updateStatsData = useCallback((newData: Stats | null) => {
    setStatsData((prevData) => {
      if (!newData) {
        return null;
      }
      if (!prevData) {
        return newData;
      }

      const prevJson = JSON.stringify(prevData);
      const newJson = JSON.stringify(newData);
      return prevJson === newJson ? prevData : newData;
    });
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);

    if (!connected) {
      setReconnectAttempts(wsService.getReconnectAttempts());
    }
  }, []);

  useEffect(() => {
    const handleData = (data: Stats | null) => {
      updateStatsData(data);
      handleConnectionChange(data !== null && wsService.isConnected());
    };

    const unsubscribe = wsService.subscribe(handleData);

    const handleConnect = () => {
      handleConnectionChange(true);
      logger.log('WebSocket connection established in context');
    };

    const handleDisconnect = () => {
      handleConnectionChange(false);
      logger.log('WebSocket disconnected in context');
    };

    const handleError = () => {
      handleConnectionChange(false);
      logger.error('WebSocket connection error in context');
    };

    wsService.on('connect', handleConnect);
    wsService.on('disconnect', handleDisconnect);
    wsService.on('error', handleError);

    setIsConnected(wsService.isConnected());
    setIsConnecting(wsService.isConnecting() && !wsService.isConnected());
    setReconnectAttempts(wsService.getReconnectAttempts());

    return () => {
      unsubscribe();
      wsService.off('connect', handleConnect);
      wsService.off('disconnect', handleDisconnect);
      wsService.off('error', handleError);
    };
  }, [handleConnectionChange, updateStatsData]);

  useEffect(() => {
    return () => {
      wsService.disconnect();
    };
  }, []);

  const reconnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await wsService.connect();
      logger.log('WebSocket reconnection attempt initiated');
    } catch (error) {
      logger.error('WebSocket reconnection attempt failed', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
    logger.log('WebSocket manual disconnect initiated');
  }, []);

  const value = useMemo(
    () => ({
      statsData,
      isConnected,
      isConnecting,
      reconnect,
      disconnect,
      reconnectAttempts,
      maxReconnectAttempts,
    }),
    [
      statsData,
      isConnected,
      isConnecting,
      reconnect,
      disconnect,
      reconnectAttempts,
      maxReconnectAttempts,
    ],
  );

  return <StatsDataContext.Provider value={value}>{children}</StatsDataContext.Provider>;
}

export const useStatsData = (): StatsDataContextType => {
  const context = useContext(StatsDataContext);
  if (context === undefined) {
    throw new Error('useStatsData must be used within a StatsDataProvider');
  }
  return context;
};
