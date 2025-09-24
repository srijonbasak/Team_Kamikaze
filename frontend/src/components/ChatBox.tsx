import { useState } from 'react';

type Props = {
  placeholder?: string;
  onSend: (text: string) => Promise<void> | void;
  busy?: boolean;
};

export default function ChatBox({ placeholder, onSend, busy }: Props) {
  const [text, setText] = useState('');

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = text.trim();
    if (!v || busy) return;
    setText('');
    await onSend(v);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2 bg-white"
        placeholder={placeholder || 'Type a command…'}
      />
      <button
        type="submit"
        disabled={busy}
        className={`px-4 py-2 rounded ${busy ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
      >
        {busy ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
