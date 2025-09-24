import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatBubbleProps {
  message: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: Date;
  isTyping?: boolean;
}

export default function ChatBubble({ 
  message, 
  role, 
  timestamp, 
  isTyping = false 
}: ChatBubbleProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-2"
      >
        <div className="bg-cyber-surface/50 border border-cyber-border rounded-lg px-4 py-2">
          <p className="text-sm text-cyber-muted text-center">{message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser 
          ? 'bg-[var(--primary)] text-black' 
              : 'bg-cyber-surface border border-cyber-border'
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-[var(--primary)]" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        'flex-1 max-w-[80%]',
        isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'
      )}>
        <motion.div
          className={cn(
            'px-4 py-3 rounded-2xl backdrop-blur-md border',
            isUser
              ? 'bg-[var(--primary)] text-black border-[var(--primary)]/20 rounded-br-md'
              : 'bg-cyber-surface/80 text-cyber-text border-cyber-border rounded-bl-md'
          )}
          whileHover={{ scale: 1.01 }}
        >
          {isTyping ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message}
            </p>
          )}
        </motion.div>

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-cyber-muted mt-1 px-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
