import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export default function ChatInput({
  onSend,
  placeholder = "Type a command...",
  disabled = false,
  suggestions = [],
  onSuggestionClick,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSend(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="space-y-4">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border transition-all duration-200',
                'bg-cyber-surface/50 border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-[var(--primary)]/50',
                'hover:bg-[var(--primary)]/5'
              )}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-4 bg-cyber-surface/50 border border-cyber-border rounded-2xl backdrop-blur-md">
          {/* Attachment Button */}
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 min-h-[20px] max-h-32 resize-none bg-transparent',
              'text-cyber-text placeholder:text-cyber-muted focus:outline-none',
              'text-sm leading-relaxed'
            )}
            rows={1}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mic Button */}
            <button
              type="button"
              disabled={disabled}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || disabled}
              glow
              className="px-3 py-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Helper Text */}
      <p className="text-xs text-cyber-muted px-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
