'use client';

import { useStatsData } from '@/contexts/stats-data-context';
import { useCallback, useEffect, useState } from 'react';

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: ConsoleMethod;
  timestamp: string;
  messages: unknown[];
}

interface CustomNavigator extends Omit<Navigator, 'vendorSub' | 'productSub'> {
  readonly deviceMemory?: number;
  readonly vendorSub?: string;
  readonly productSub?: string;
}

interface CustomScreen extends Omit<Screen, 'orientation'> {
  readonly orientation?: ScreenOrientation;
}

interface DebugInfo {
  note: string;
  navigator: {
    userAgent: string;
    platform: string;
    language: string;
    languages: readonly string[];
    cookieEnabled: boolean;
    onLine: boolean;
    vendor: string;
    vendorSub: string;
    product: string;
    productSub: string;
    appName: string;
    appVersion: string;
    appCodeName: string;
    hardwareConcurrency: number;
    maxTouchPoints: number;
    deviceMemory: number;
  };
  locale: {
    timezone: string;
    timezoneOffset: number;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    pixelDepth: number;
    colorDepth: number;
    orientation?: {
      angle: number;
      type: string;
    };
  };
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  location: {
    href: string;
    origin: string;
    pathname: string;
    search: string;
    hash: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
  };
  localStorage: {
    length: number;
    keys: string[];
  };
  consoleLogs: readonly LogEntry[];
}

let refCount = 0;
const globalCapturedLogs: LogEntry[] = [];
const originalConsole: { [key in ConsoleMethod]?: (typeof console)[ConsoleMethod] } = {};
const CONSOLE_METHODS: ConsoleMethod[] = [
  'log',
  'info',
  'warn',
  'error',
  'debug',
];
const MAX_LOGS = 500;

const serializeValue = (value: unknown): unknown => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
};

const getClientDebugInfo = (): DebugInfo => {
  const nav = navigator as CustomNavigator;
  const scr = screen as CustomScreen;

  const localStorageInfo = (() => {
    try {
      return {
        length: localStorage.length,
        keys: Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i) ?? ''),
      };
    } catch {
      return { length: 0, keys: [] };
    }
  })();

  return {
    note: 'The following is for debugging purposes ONLY. DO NOT share this information with anyone you cannot trust.',
    navigator: {
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      languages: nav.languages,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      vendor: nav.vendor,
      vendorSub: nav.vendorSub || '',
      product: nav.product,
      productSub: nav.productSub || '',
      appName: nav.appName,
      appVersion: nav.appVersion,
      appCodeName: nav.appCodeName,
      hardwareConcurrency: nav.hardwareConcurrency,
      maxTouchPoints: nav.maxTouchPoints,
      deviceMemory: nav.deviceMemory || 0,
    },
    locale: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    screen: {
      width: scr.width,
      height: scr.height,
      availWidth: scr.availWidth,
      availHeight: scr.availHeight,
      pixelDepth: scr.pixelDepth,
      colorDepth: scr.colorDepth,
      orientation: scr.orientation ? { angle: scr.orientation.angle, type: scr.orientation.type } : undefined,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    location: {
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      protocol: location.protocol,
      host: location.host,
      hostname: location.hostname,
      port: location.port,
    },
    localStorage: localStorageInfo,
    consoleLogs: [...globalCapturedLogs],
  };
};

export function Watermark() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [statsDataCount, setStatsDataCount] = useState(0);
  const { statsData } = useStatsData();

  const handleCopyDebugInfo = useCallback(async () => {
    try {
      const debugInfo = getClientDebugInfo();
      const jsonString = JSON.stringify(debugInfo, null, 2);

      try {
        await navigator.clipboard.writeText(jsonString);
        console.log('Debug info copied to clipboard!');
        setCopyStatus('copied');
      } catch (error) {
        console.warn('Clipboard API failed, using fallback:', error);
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          console.log('Debug info copied to clipboard (fallback)!');
          setCopyStatus('copied');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          setCopyStatus('error');
          throw new Error('Both clipboard methods failed');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (e) {
      console.error('Failed to gather debug info:', e);
      setCopyStatus('error');
      alert('Error gathering debug information. Check console for details.');
    }
  }, []);

  useEffect(() => {
    if (copyStatus !== 'idle') {
      const timer = setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  useEffect(() => {
    if (statsData) {
      setStatsDataCount((prev) => prev + 1);
    }
  }, [statsData]);

  useEffect(() => {
    if (refCount === 0) {
      CONSOLE_METHODS.forEach((level) => {
        originalConsole[level] = console[level];
      });

      CONSOLE_METHODS.forEach((level) => {
        console[level] = (...args: unknown[]) => {
          globalCapturedLogs.push({
            level,
            timestamp: new Date().toISOString(),
            messages: args.map(serializeValue),
          });

          if (globalCapturedLogs.length > MAX_LOGS) {
            globalCapturedLogs.shift();
          }

          originalConsole[level]?.apply(console, args);
        };
      });
    }

    refCount++;

    return () => {
      refCount--;
      if (refCount === 0) {
        CONSOLE_METHODS.forEach((level) => {
          if (originalConsole[level]) {
            console[level] = originalConsole[level]!;
          }
        });
      }
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed right-[5px] bottom-[10px] z-[9999] flex flex-col items-end bg-transparent
        px-[6px] py-[3px] font-mono text-[11px] select-none`}
    >
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="text-[rgba(128,128,128,0.25)]">{statsDataCount} data-refresh</div>
          <div
            onClick={handleCopyDebugInfo}
            onKeyDown={(e) => e.key === 'Enter' && handleCopyDebugInfo()}
            className="pointer-events-auto cursor-pointer text-[rgba(128,128,128,0.45)] hover:underline"
            role="button"
            tabIndex={0}
            aria-label="Copy debug information"
          >
            {copyStatus === 'idle' && '[copy debug info]'}
            {copyStatus === 'copied' && '[copied!]'}
            {copyStatus === 'error' && '[copy failed]'}
          </div>
        </div>
      </div>
    </div>
  );
}

Watermark.displayName = 'Watermark';
