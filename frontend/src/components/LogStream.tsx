import { useEffect, useRef } from 'react';

type Props = {
  lines: string[];
  height?: number; // px
};

export default function LogStream({ lines, height = 360 }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <pre
      ref={ref}
      className="bg-white border rounded p-3 text-sm whitespace-pre-wrap overflow-auto"
      style={{ height }}
    >
      {lines.join('')}
    </pre>
  );
}
