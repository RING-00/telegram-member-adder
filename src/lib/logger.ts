const isProduction = process.env.NODE_ENV === 'production';

const enum LogLevel {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  DEBUG = 'debug',
  ERROR = 'error',
}

type LogMetadata = Record<string, unknown>;

type LogArgs =
  | [message: string]
  | [message: string, ...args: unknown[]]
  | [error: Error]
  | [message: string, error: Error]
  | [message: string, metadata: LogMetadata];

interface Logger {
  [LogLevel.LOG]: (...args: LogArgs) => void;
  [LogLevel.INFO]: (...args: LogArgs) => void;
  [LogLevel.WARN]: (...args: LogArgs) => void;
  [LogLevel.DEBUG]: (...args: LogArgs) => void;
  [LogLevel.ERROR]: (...args: LogArgs) => void;
}

const createConditionalLogFn = (level: Exclude<LogLevel, LogLevel.ERROR>): ((...args: LogArgs) => void) => {
  return (...args: LogArgs) => {
    if (!isProduction) {
      console[level](...args);
    }
  };
};

export const logger: Logger = {
  [LogLevel.LOG]: createConditionalLogFn(LogLevel.LOG),
  [LogLevel.INFO]: createConditionalLogFn(LogLevel.INFO),
  [LogLevel.WARN]: createConditionalLogFn(LogLevel.WARN),
  [LogLevel.DEBUG]: createConditionalLogFn(LogLevel.DEBUG),
  [LogLevel.ERROR]: (...args: LogArgs) => {
    console.error(...args);
  },
} as const;
