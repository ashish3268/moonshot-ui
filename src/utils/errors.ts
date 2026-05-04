export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
    if (detail) return detail;
    const msg = (err as { message?: string }).message;
    if (msg && !msg.startsWith('Request failed')) return msg;
  }
  return fallback;
}
