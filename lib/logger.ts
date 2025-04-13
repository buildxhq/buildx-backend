// /lib/logger.ts — Centralized Logging Utility

export function logger(...args: any[]) {
  const timestamp = new Date().toISOString();
  console.log(`[BUILDX] [${timestamp}]`, ...args);
}

export function errorLogger(label: string, err: unknown) {
  const timestamp = new Date().toISOString();
  console.error(`[BUILDX:ERROR] [${timestamp}] ${label}`, err);
}
