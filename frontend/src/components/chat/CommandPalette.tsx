import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Clock, Globe, Shield, Ban } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  keywords: string[];
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'evil' | 'good';
  onCommand?: (command: string) => void;
}

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  theme,
  onCommand 
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'block-domain',
      title: 'Block Domain',
      description: 'Block a specific domain or IP address',
      icon: Ban,
      keywords: ['block', 'ban', 'domain', 'ip'],
      action: () => onCommand?.('block'),
    },
    {
      id: 'unblock-domain',
      title: 'Unblock Domain',
      description: 'Remove block from a domain or IP',
      icon: Globe,
      keywords: ['unblock', 'allow', 'remove'],
      action: () => onCommand?.('unblock'),
    },
    {
      id: 'list-active',
      title: 'List Active Blocks',
      description: 'Show all currently active domain blocks',
      icon: Clock,
      keywords: ['list', 'active', 'blocks', 'rules'],
      action: () => onCommand?.('list'),
    },
    {
      id: 'acknowledge-alert',
      title: 'Acknowledge Alert',
      description: 'Mark security alert as acknowledged',
      icon: Shield,
      keywords: ['ack', 'acknowledge', 'alert', 'dismiss'],
      action: () => onCommand?.('ack'),
    },
    {
      id: 'recommend-action',
      title: 'Get Recommendations',
      description: 'Get suggested actions for security issues',
      icon: Search,
      keywords: ['recommend', 'suggest', 'action', 'help'],
      action: () => onCommand?.('recommend'),
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={cn(
            'bg-cyber-surface/90 backdrop-blur-md border rounded-2xl shadow-2xl',
            theme === 'evil' ? 'border-evil-primary/20' : 'border-good-primary/20'
          )}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-cyber-border">
              <Search className="h-5 w-5 text-cyber-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-cyber-text placeholder:text-cyber-muted focus:outline-none"
              />
              <div className="flex items-center gap-1 text-xs text-cyber-muted">
                <Command className="h-3 w-3" />
                <span>⌘K</span>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-cyber-muted">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <motion.button
                    key={command.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 text-left transition-colors',
                      'hover:bg-border/30',
                      index === selectedIndex && 'bg-[var(--primary)]/10 border-r-2 border-[var(--primary)]'
                    )}
                  >
                    <div className={cn(
                      'p-2 rounded-lg',
                      theme === 'evil' ? 'bg-evil-primary/20 text-evil-primary' : 'bg-good-primary/20 text-good-primary'
                    )}>
                      <command.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-cyber-text">{command.title}</p>
                      <p className="text-sm text-cyber-muted">{command.description}</p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border text-xs text-cyber-muted">
              <div className="flex items-center justify-between">
                <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
                <span>CyberNet Duo Command Palette</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
