import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Radar, Bell, Network, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import CommandPalette from '../components/chat/CommandPalette';
import Card, { CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/utils';
import { chat } from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  destination: string;
  vector: string;
  firstSeen: Date;
  lastSeen: Date;
  suggestedAction: string;
  acknowledged: boolean;
}

interface TrafficData {
  time: string;
  packets: number;
  threats: number;
}

interface TopTalker {
  ip: string;
  packets: number;
  bytes: number;
}

export default function GuardianChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the Guardian Bot. I monitor your network for threats and anomalies.\n\nTry saying: "show recent alerts" or "analyze traffic"',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [topTalkers, setTopTalkers] = useState<TopTalker[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toasts, removeToast, success, error } = useToast();

  // Set theme on body
  useEffect(() => {
    document.body.className = 'theme-good';
    return () => {
      document.body.className = '';
    };
  }, []);

  // Utilities to generate random traffic snapshot
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const generateTrafficData = (): TrafficData[] => {
    const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    return times.map((t) => ({
      time: t,
      packets: randomInt(700, 3800),
      threats: randomInt(0, 6),
    }));
  };

  // Utilities to generate random Top Talkers (packets and bytes)
  const baseIps = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '192.168.1.200', '10.0.0.100'];
  const generateTopTalkers = (): TopTalker[] => {
    return baseIps.map((ip) => {
      const packets = randomInt(400, 3500); // packets per sample window
      const bytes = packets * randomInt(800, 2000); // rough correlation
      return { ip, packets, bytes };
    })
    .sort((a, b) => b.packets - a.packets);
  };

  // Seed random traffic data on mount
  useEffect(() => {
    setTrafficData(generateTrafficData());
  }, []);

  // Seed and periodically update Top Talkers
  useEffect(() => {
    setTopTalkers(generateTopTalkers());
    const id = setInterval(() => {
      setTopTalkers(generateTopTalkers());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Mock alerts data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        severity: 'high',
        title: 'Suspicious Port Scan Detected',
        description: 'Multiple connection attempts to closed ports from external IP',
        source: '203.0.113.42',
        destination: '192.168.1.100',
        vector: 'Port 22, 80, 443',
        firstSeen: new Date(Date.now() - 300000),
        lastSeen: new Date(Date.now() - 60000),
        suggestedAction: 'Block source IP',
        acknowledged: false,
      },
      {
        id: '2',
        severity: 'medium',
        title: 'Unusual Data Transfer Pattern',
        description: 'Large data upload detected during off-hours',
        source: '192.168.1.50',
        destination: 'external-server.com',
        vector: 'HTTPS (443)',
        firstSeen: new Date(Date.now() - 1800000),
        lastSeen: new Date(Date.now() - 120000),
        suggestedAction: 'Investigate user activity',
        acknowledged: false,
      },
      {
        id: '3',
        severity: 'low',
        title: 'DNS Query Anomaly',
        description: 'Multiple queries to suspicious domains',
        source: '192.168.1.75',
        destination: 'suspicious-site.net',
        vector: 'DNS (53)',
        firstSeen: new Date(Date.now() - 3600000),
        lastSeen: new Date(Date.now() - 300000),
        suggestedAction: 'Monitor DNS queries',
        acknowledged: true,
      },
    ];
    setAlerts(mockAlerts);
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
        content: response?.reply || 'Analysis complete. No immediate threats detected.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Parse commands and show feedback
      if (content.toLowerCase().includes('alert')) {
        success('Alert analysis complete', 'Security assessment updated');
      } else if (content.toLowerCase().includes('block')) {
        success('Threat neutralized', 'Malicious source has been blocked');
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
      case 'ack':
        handleSendMessage('acknowledge latest alerts');
        break;
      case 'recommend':
        handleSendMessage('get security recommendations');
        break;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    success('Alert acknowledged', 'The alert has been marked as reviewed');
  };

  const executeAction = (alert: Alert) => {
    handleSendMessage(`execute action: ${alert.suggestedAction} for ${alert.source}`);
    success('Action executed', `Applied: ${alert.suggestedAction}`);
  };

  const getSeverityColor = (_severity: Alert['severity']) => {
    // Use greenish accents for borders/backgrounds, keep text neutral
    return 'border-good-primary/30 bg-good-primary/10';
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return ShieldAlert;
      case 'medium': return Bell;
      case 'low': return CheckCircle2;
    }
  };

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
              <div className="p-3 rounded-xl bg-good-primary/20 border border-good-primary/30">
                <ShieldAlert className="h-8 w-8 text-good-primary" />
              </div>
              <div>
                <h1 className="font-orbitron font-bold text-3xl text-good-primary">
                  Guardian Bot
                </h1>
                <p className="text-cyber-muted">Protect your network with intelligence</p>
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
              placeholder="Ask about security alerts, traffic analysis, or network status..."
              disabled={isLoading}
              suggestions={[
                'show recent alerts',
                'analyze traffic patterns',
                'check network health',
                'get security recommendations'
              ]}
              onSuggestionClick={handleSendMessage}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card theme="good" glow>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="h-5 w-5 text-good-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSendMessage('show recent alerts')}
                  className="w-full"
                  glow
                >
                  <Bell className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
                <Button
                  onClick={() => setCommandPaletteOpen(true)}
                  variant="secondary"
                  className="w-full"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Command Palette
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card theme="good">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-good-primary" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-good-primary opacity-50" />
                    <p className="text-cyber-muted">All clear</p>
                    <p className="text-sm text-cyber-muted">Monitoring continues</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => {
                      const SeverityIcon = getSeverityIcon(alert.severity);
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            'p-3 rounded-lg border',
                            getSeverityColor(alert.severity),
                            alert.acknowledged && 'opacity-60'
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <SeverityIcon className="h-4 w-4 text-good-primary" />
                              <span className="font-medium text-sm capitalize text-good-primary">
                                {alert.severity}
                              </span>
                            </div>
                            {!alert.acknowledged && (
                              <button
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="p-1 hover:bg-black/10 rounded"
                                aria-label="Acknowledge alert"
                                title="Acknowledge alert"
                              >
                                <CheckCircle2 className="h-4 w-4 text-good-primary" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-1">{alert.title}</p>
                          <p className="text-xs opacity-90 mb-2">{alert.source} → {alert.destination}</p>
                          <Button
                            size="sm"
                            onClick={() => executeAction(alert)}
                            className="w-full text-xs"
                          >
                            {alert.suggestedAction}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Traffic Snapshot */}
            <Card theme="good">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-good-primary" />
                  Traffic Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini Chart */}
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficData}>
                      <Line 
                        type="monotone" 
                        dataKey="packets" 
                        stroke="#28F7D1" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="threats" 
                        stroke="#28F7D1" 
                        strokeOpacity={0.5}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Talkers */}
                <div>
                  <h4 className="text-sm font-medium text-cyber-text mb-2">Top Talkers</h4>
                  <div className="space-y-2">
                    {topTalkers.slice(0, 3).map((talker, index) => (
                      <div key={talker.ip} className="flex items-center justify-between text-xs">
                        <span className="text-cyber-muted">{talker.ip}</span>
                        <span className="text-good-primary font-mono">
                          {Math.round(talker.packets / 100) / 10}k pps
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        theme="good"
        onCommand={handleCommand}
      />
    </div>
  );
}
