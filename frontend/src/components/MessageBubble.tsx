import React from 'react';

type Props = {
  role: 'user' | 'system' | 'assistant';
  children: React.ReactNode;
  className?: string;
};

export default function MessageBubble({ role, children, className }: Props) {
  const isUser = role === 'user';
  const base =
    'inline-block max-w-[80%] px-3 py-2 rounded-lg text-sm md:text-[15px] whitespace-pre-wrap break-words';
  const tone = isUser
    ? 'bg-blue-600 text-white'
    : role === 'assistant'
      ? 'bg-gray-900 text-white'
      : 'bg-gray-100 text-gray-900';
  return (
    <div className={isUser ? 'text-right' : 'text-left'}>
      <div className={`${base} ${tone} ${className || ''}`}>{children}</div>
    </div>
  );
}
