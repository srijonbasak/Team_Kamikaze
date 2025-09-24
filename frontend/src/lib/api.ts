// frontend/src/lib/api.ts
import { API_BASE } from './config';

export async function chat(message: string) {
  const r = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ message })
  });
  return r.json();
}

export async function trace(domain: string) {
  const r = await fetch(`${API_BASE}/trace?domain=${encodeURIComponent(domain)}`);
  return r.json();
}

export function streamLogs(domain: string, onLine: (s: string) => void) {
  const url = `${API_BASE}/stream/logs?domain=${encodeURIComponent(domain)}`;
  const ev = new EventSource(url);
  ev.addEventListener('line', (e: MessageEvent) => onLine(e.data as string));
  ev.addEventListener('stderr', (e: MessageEvent) => onLine(`[stderr] ${e.data}`));
  ev.addEventListener('end', () => ev.close());
  return () => ev.close();
}
