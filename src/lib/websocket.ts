import { logger } from '@/lib/logger';
import type { Stats } from '@/types/stats-data';
import ReconnectingWebSocket from 'reconnecting-websocket';

type WebSocketMessage = Stats | null;

type WebSocketEventType = 'connect' | 'disconnect' | 'error';

type WebSocketEventHandler = () => void;

class WebSocketService {
  private static instance: WebSocketService;
  private rws: ReconnectingWebSocket | null = null;
  private listeners = new Set<(data: WebSocketMessage) => void>();
  private eventHandlers = new Map<WebSocketEventType, Set<WebSocketEventHandler>>();
  private lastData: Stats | null = null;
  private reconnectAttempts = 0;
  private maxRetries = Infinity;
  private manualClose = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeConnection();
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private initializeConnection(): void {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      logger.error('NEXT_PUBLIC_WS_URL is not defined');
      return;
    }

    logger.log('Connecting to WebSocket:', wsUrl);

    this.rws = new ReconnectingWebSocket(wsUrl, [], {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 4000,
      maxRetries: this.maxRetries,
      debug: false,
    });

    this.rws.addEventListener('open', () => {
      logger.log('WebSocket Connected');
      this.emit('connect');
    });

    this.rws.addEventListener('close', () => {
      logger.log('WebSocket Disconnected');
      if (!this.manualClose) {
        this.reconnectAttempts++;
      }
      this.manualClose = false;
      this.emit('disconnect');
    });

    this.rws.addEventListener('error', (error) => {
      logger.error('WebSocket Error:', error);
      this.emit('error');
    });

    this.rws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as { data: { stats: Stats } };

        if (message.data && message.data.stats) {
          this.lastData = message.data.stats;
          logger.log('WebSocket stats data received:', this.lastData);
          this.notifyListeners(this.lastData);
        } else {
          logger.warn('WebSocket message does not contain expected stats data structure:', message);
        }
      } catch (error) {
        logger.error('Failed to parse WebSocket message:', error);
      }
    });
  }

  private notifyListeners(data: WebSocketMessage): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  public on(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  public off(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: WebSocketEventType): void {
    this.eventHandlers.get(event)?.forEach((handler) => handler());
  }

  public subscribe(callback: (data: WebSocketMessage) => void): () => void {
    this.listeners.add(callback);
    if (this.lastData !== null) {
      callback(this.lastData);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  public disconnect(): void {
    if (this.rws) {
      this.manualClose = true;
      this.rws.close();
    }
  }

  public isConnected(): boolean {
    return this.rws?.readyState === WebSocket.OPEN || false;
  }

  public isConnecting(): boolean {
    return this.rws?.readyState === WebSocket.CONNECTING || false;
  }

  public getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  public getMaxReconnectAttempts(): number {
    return this.maxRetries;
  }

  public async connect(): Promise<void> {
    if (this.rws && this.rws.readyState === WebSocket.OPEN) {
      return;
    }

    return new Promise((resolve, reject) => {
      const onOpen = () => {
        this.off('connect', onOpen);
        this.off('error', onError);
        resolve();
      };

      const onError = () => {
        this.off('connect', onOpen);
        this.off('error', onError);
        reject(new Error('Connection failed'));
      };

      this.on('connect', onOpen);
      this.on('error', onError);

      if (!this.rws || this.rws.readyState === WebSocket.CLOSED) {
        this.initializeConnection();
      } else if (this.rws.readyState === WebSocket.CLOSING) {
        reject(new Error('Connection is closing'));
      }
    });
  }
}

export const wsService = WebSocketService.getInstance();
