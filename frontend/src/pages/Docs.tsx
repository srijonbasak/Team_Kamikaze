import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '../components/ui/Card';

type FAQ = {
  q: string;
  a: string;
  tag?: 'blocker' | 'guardian' | 'general';
};

const faqsData: FAQ[] = [
  {
    q: 'What is CyberNet Duo?',
    a: 'CyberNet Duo is a pair of chatbots: Blocker (focus/productivity) and Guardian (security/monitoring). Use Blocker to schedule domain blocks and Guardian to monitor, analyze, and mitigate threats.',
    tag: 'general',
  },
  {
    q: 'How do I block a website?',
    a: 'Open Blocker and type: block facebook.com for 1h. You can also list, extend, or unblock rules via simple commands.',
    tag: 'blocker',
  },
  {
    q: 'How can I see recent security alerts?',
    a: 'Open Guardian and ask: show recent alerts. You can acknowledge alerts or execute suggested mitigations from the sidebar.',
    tag: 'guardian',
  },
  {
    q: 'Can I schedule recurring blocks?',
    a: 'Yes. Use Blocker to set blocks during specific hours or durations. Example: block youtube.com for 8h.',
    tag: 'blocker',
  },
  {
    q: 'Do traffic and top talkers update live?',
    a: 'Yes. Traffic snapshots are generated on load and top talkers update periodically to reflect changing conditions.',
    tag: 'guardian',
  },
  {
    q: 'Where can I see logs or traces?',
    a: 'Use the Trace or Stream sections (if enabled) to view live logs or perform domain/IP trace operations.',
    tag: 'general',
  },
];

export default function Docs() {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqsData;
    return faqsData.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  const toggle = (idx: number) => setOpenIndex((cur) => (cur === idx ? null : idx));

  return (
    <div className="min-h-screen bg-cyber-bg pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-orbitron font-bold text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-cyber-muted">Select a question to see the answer. Use the search to quickly find topics.</p>
        </motion.div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-cyber-surface border border-cyber-border focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-5 w-5 text-cyber-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full bg-transparent outline-none text-cyber-text placeholder:text-cyber-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            const controlsId = `faq-${idx}`;
            return (
              <Card key={item.q} hover>
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left"
                  data-expanded={isOpen ? 'true' : 'false'}
                  data-controls={controlsId}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2" id={controlsId + '-label'}>
                        {item.q}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-cyber-muted"
                      >
                        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </motion.span>
                    </CardTitle>
                  </CardHeader>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={controlsId}
                      role="region"
                      aria-labelledby={controlsId + '-label'}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CardContent>
                        <motion.p
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-cyber-muted whitespace-pre-line"
                        >
                          {item.a}
                        </motion.p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
          {faqs.length === 0 && (
            <p className="text-center text-cyber-muted">No results. Try a different search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
