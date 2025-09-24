import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ban, Timer, Clock, Globe, History, X, Plus } from 'lucide-react';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import CommandPalette from '../components/chat/CommandPalette';
import Card, { CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { cn, validateDomain, formatTimeRemaining } from '../lib/utils';
import { chat } from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ActiveRule {
  id: string;
  domain: string;
  duration: number;
  remaining: number;
  createdBy: string;
  reason: string;
  createdAt: Date;
}

export default function BlockerChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the Blocker Bot. I can help you block domains, set timers, and manage network restrictions.\n\nTry saying: "block facebook.com for 2 hours" or "unblock youtube.com"',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeRules, setActiveRules] = useState<ActiveRule[]>([]);
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toasts, removeToast, success, error } = useToast();

  // Set theme on body
  useEffect(() => {
    document.body.className = 'theme-evil';
    return () => {
      document.body.className = '';
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chat(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response?.reply || 'Command executed successfully.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Parse commands and update UI
      if (content.toLowerCase().includes('block') && content.toLowerCase().includes('for')) {
        success('Domain blocked successfully', 'The domain has been added to your block list');
      } else if (content.toLowerCase().includes('unblock')) {
        success('Domain unblocked', 'The domain has been removed from your block list');
      }
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Error: Failed to process command. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      error('Command failed', 'Please check your input and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = (command: string) => {
    switch (command) {
      case 'block':
        setShowDomainInput(true);
        break;
      case 'unblock':
        handleSendMessage('list active blocks');
        break;
      case 'list':
        handleSendMessage('show active blocks');
        break;
    }
  };

  const handleBlockDomain = () => {
    if (!validateDomain(domainInput)) {
      error('Invalid domain', 'Please enter a valid domain or IP address');
      return;
    }

    if (!selectedDuration) {
      error('No duration selected', 'Please select how long to block the domain');
      return;
    }

    const command = `block ${domainInput} for ${selectedDuration}`;
    handleSendMessage(command);
    
    // Add to active rules (mock)
    const newRule: ActiveRule = {
      id: Date.now().toString(),
      domain: domainInput,
      duration: parseDuration(selectedDuration),
      remaining: parseDuration(selectedDuration),
      createdBy: 'user',
      reason: 'Manual block',
      createdAt: new Date(),
    };
    
    setActiveRules(prev => [...prev, newRule]);
    setShowDomainInput(false);
    setDomainInput('');
    setSelectedDuration('');
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)([hm])/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    return unit === 'h' ? value * 3600 : value * 60;
  };

  const unblockDomain = (domain: string) => {
    handleSendMessage(`unblock ${domain}`);
    setActiveRules(prev => prev.filter(rule => rule.domain !== domain));
    success('Domain unblocked', `${domain} has been removed from the block list`);
  };

  const extendBlock = (domain: string, duration: string) => {
    handleSendMessage(`extend block for ${domain} by ${duration}`);
    success('Block extended', `Block for ${domain} extended by ${duration}`);
  };

  const durations = [
    { label: '15 minutes', value: '15m' },
    { label: '1 hour', value: '1h' },
    { label: '4 hours', value: '4h' },
    { label: '8 hours', value: '8h' },
    { label: '24 hours', value: '24h' },
  ];

  return (
    <div className="min-h-screen bg-cyber-bg pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 rounded-xl bg-evil-primary/20 border border-evil-primary/30">
                <Ban className="h-8 w-8 text-evil-primary" />
              </div>
              <div>
                <h1 className="font-orbitron font-bold text-3xl text-evil-primary">
                  Blocker Bot
                </h1>
                <p className="text-cyber-muted">Control your network with precision</p>
              </div>
            </motion.div>

            {/* Chat Messages */}
            <Card className="h-80 lg:h-96 overflow-hidden">
              <div className="h-full overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.content}
                    role={message.role}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <ChatBubble
                    message=""
                    role="assistant"
                    isTyping={true}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card>

            {/* Chat Input */}
            <ChatInput
              onSend={handleSendMessage}
              placeholder="Type a command... (e.g., 'block facebook.com for 2 hours')"
              disabled={isLoading}
              suggestions={[
                'block facebook.com for 1h',
                'unblock youtube.com',
                'list active blocks',
                'extend block for twitter.com by 30m'
              ]}
              onSuggestionClick={handleSendMessage}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Block */}
            <Card theme="evil" glow>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-evil-primary" />
                  Quick Block
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowDomainInput(true)}
                  className="w-full"
                  glow
                >
                  Block Domain
                </Button>
                <Button
                  onClick={() => setCommandPaletteOpen(true)}
                  variant="secondary"
                  className="w-full"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Command Palette
                </Button>
              </CardContent>
            </Card>

            {/* Active Rules */}
            <Card theme="evil">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-evil-primary" />
                  Active Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeRules.length === 0 ? (
                  <div className="text-center py-8">
                    <Ban className="h-12 w-12 mx-auto mb-4 text-cyber-muted opacity-50" />
                    <p className="text-cyber-muted">No active rules</p>
                    <p className="text-sm text-cyber-muted">Create your first scheduled block</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeRules.map((rule) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-evil-primary/5 border border-evil-primary/20 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-evil-primary" />
                            <span className="font-medium text-cyber-text">{rule.domain}</span>
                          </div>
                          <button
                            onClick={() => unblockDomain(rule.domain)}
                            className="p-1 hover:bg-evil-primary/20 rounded"
                          >
                            <X className="h-4 w-4 text-evil-primary" />
                          </button>
                        </div>
                        <div className="text-sm text-cyber-muted space-y-1">
                          <div>Time left: {formatTimeRemaining(rule.remaining)}</div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => extendBlock(rule.domain, '15m')}
                              className="text-xs px-2 py-1"
                            >
                              +15m
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => extendBlock(rule.domain, '1h')}
                              className="text-xs px-2 py-1"
                            >
                              +1h
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Domain Input Modal */}
      {showDomainInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-evil-primary/20 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="font-orbitron font-bold text-xl text-evil-primary mb-4">
              Block Domain
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">
                  Domain or IP Address
                </label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="example.com or 192.168.1.1"
                  className="w-full px-3 py-2 bg-surface/50 border border-border rounded-lg text-cyber-text placeholder:text-cyber-muted focus:outline-none focus:ring-2 focus:ring-evil-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setSelectedDuration(duration.value)}
                      className={cn(
                        'p-2 text-sm rounded-lg border transition-colors',
                        selectedDuration === duration.value
                          ? 'bg-evil-primary text-black border-evil-primary'
                          : 'bg-surface/50 border-border text-cyber-text hover:border-evil-primary/50'
                      )}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleBlockDomain}
                  className="flex-1"
                  glow
                >
                  Block Domain
                </Button>
                <Button
                  onClick={() => {
                    setShowDomainInput(false);
                    setDomainInput('');
                    setSelectedDuration('');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        theme="evil"
        onCommand={handleCommand}
      />
    </div>
  );
}
