// /lib/errorHandler.ts — Global Error Handler Wrapper

export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<[T | null, string | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (err: any) {
    const msg = err?.message || 'Unknown error';
    console.error('[ERROR_HANDLER]', msg);
    return [null, msg];
  }
}
