import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import MessageBubble from '../components/MessageBubble';
import { chat } from '../lib/api';

type Msg = { role: 'user' | 'assistant' | 'system'; text: string };

export default function Chat() {
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Msg[]>([
    { role: 'assistant', text: 'Hi! Try: “block facebook for 2 hours”.' }
  ]);

  async function handleSend(text: string) {
    setBusy(true);
    try {
      setHistory((h) => [...h, { role: 'user', text }]);
      const res = await chat(text);
      setHistory((h) => [...h, { role: 'assistant', text: res?.reply ?? 'Done.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <ChatBox onSend={handleSend} busy={busy} placeholder="block facebook for 2 hours" />
      <div className="bg-transparent space-y-3">
        {history.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            {m.text}
          </Message
