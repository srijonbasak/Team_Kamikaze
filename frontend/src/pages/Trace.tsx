import { useEffect, useState } from 'react';
import { trace, streamLogs } from '../lib/api';
import LogStream from '../components/LogStream';

export default function Trace() {
  const [domain, setDomain] = useState('facebook.com');
  const [stdout, setStdout] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [unsub, setUnsub] = useState<null | (() => void)>(null);

  async function runTrace() {
    const r = await trace(domain);
    setStdout(r.stdout || []);
  }

  function startLogs() {
    if (unsub) unsub();
    setLogs([]);
    const u = streamLogs(domain, (line) => setLogs((l) => [...l, line + '\n']));
    setUnsub(() => u);
  }

  useEffect(() => () => unsub?.(), [unsub]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="facebook.com"
          />
          <button
            onClick={runTrace}
            className="px-3 py-2 rounded bg-gray-900 text-white"
          >
            Trace
          </button>
          <button
            onClick={startLogs}
            className="px-3 py-2 rounded bg-gray-200"
          >
            Stream Logs
          </button>
        </div>

        <pre className="bg-white border rounded p-3 h-[360px] overflow-auto text-sm whitespace-pre-wrap">
          {stdout.join('\n')}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium mb-2">Watcher Logs (live)</h3>
        <LogStream lines={logs} height={360} />
      </div>
    </div>
  );
}
