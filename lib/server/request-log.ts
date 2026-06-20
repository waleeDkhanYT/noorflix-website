export type ApiLogEntry = {
  route: string;
  method: string;
  ip: string;
  status: number;
  durationMs: number;
  error?: string;
};

export function logApiRequest(entry: ApiLogEntry): void {
  const base = `[api] ${entry.method} ${entry.route} ${entry.status} ${entry.durationMs}ms ip=${entry.ip}`;

  if (entry.status >= 500 || entry.error) {
    console.error(entry.error ? `${base} error=${entry.error}` : base);
    return;
  }

  if (process.env.NODE_ENV === "development" || entry.status >= 400) {
    console.warn(base);
  }
}