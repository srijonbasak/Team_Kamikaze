import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ban, ShieldAlert, Timer, Activity, Radar, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import Lottie from 'lottie-react';
import SamuraiIdle from '../components/animations/Samurai IDLE animation.json';
import GreenSamurai from '../components/animations/green samurai.json';

export default function Landing() {
  const navigate = useNavigate();

  const handleBlockerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/blocker');
  };

  const handleGuardianClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/guardian');
  };
  

  return (
    <div className="min-h-screen bg-cyber-bg relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 px-6"
        >
          <h1 className="font-orbitron font-bold text-5xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-evil-primary to-evil-accent bg-clip-text text-transparent">
              Take Charge.
            </span>
            <br />
            <span className="bg-gradient-to-r from-good-primary to-good-accent bg-clip-text text-transparent">
              Stay Safe.
            </span>
          </h1>
          <p className="text-xl text-cyber-muted max-w-3xl mx-auto mb-16">
            Two specialized chatbots for total network control — block distractions on schedule 
            and neutralize threats in real time.
          </p>
        </motion.div>

        {/* Split Design */}
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          {/* Blocker Bot (Evil Theme) */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn(
              'relative p-6 lg:p-12 flex flex-col justify-center',
              'bg-gradient-to-br from-evil-primary/10 via-evil-accent/5 to-transparent',
              'border-r border-cyber-border min-h-[60vh] lg:min-h-[80vh]'
            )}
          >
            {/* Theme indicator */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center space-x-2">
                <Ban className="h-5 w-5 text-evil-primary" />
                <span className="text-evil-primary font-medium uppercase tracking-wider text-sm">
                  Evil
                </span>
              </div>
            </div>

            {/* Content + Animation Row */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Text Content */}
              <div className="max-w-lg flex-1">
                <h2 className="font-orbitron font-bold text-3xl lg:text-4xl mb-6 text-evil-primary">
                  Blocker Bot
                </h2>
                <p className="text-lg text-cyber-muted mb-8 leading-relaxed">
                  Take control of your network with scheduled domain blocks, 
                  auto-unblock timers, and instant override capabilities.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Timer, text: 'Schedule domain blocks' },
                    { icon: Ban, text: 'Auto-unblock timers' },
                    { icon: ShieldAlert, text: 'Instant overrides' },
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="p-2 rounded-lg bg-evil-primary/20 border border-evil-primary/30">
                        <Icon className="h-5 w-5 text-evil-primary" />
                      </div>
                      <span className="text-cyber-text">{text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="w-full">
                  <button
                    type="button"
                    className={cn(
                      // layout
                      'block w-full px-8 py-4 rounded-2xl font-semibold text-lg text-center',
                      // colors
                      'bg-evil-primary text-black border border-evil-primary/20',
                      // effects
                      'shadow-lg transition-all duration-200 transform',
                      // hover/focus states
                      'hover:bg-evil-primary-hover hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-evil-primary/40',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evil-primary/60',
                      // accessibility cursor
                      'cursor-pointer'
                    )}
                    onClick={handleBlockerClick}
                  >
                    Chat with Blocker
                  </button>
                </div>
              </div>

              {/* Animation (Right side on desktop) */}
              <div className="flex-1 w-full flex items-center justify-center lg:justify-end">
                <Lottie
                  animationData={SamuraiIdle}
                  loop
                  autoplay
                  className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64 xl:w-72 xl:h-72"
                  aria-label="Samurai idle animation"
                />
              </div>
            </div>

            {/* Glow effect (non-interactive, behind content) */}
            <div className="absolute inset-0 -z-10 pointer-events-none bg-evil-primary/5 rounded-full blur-3xl" aria-hidden="true" />
          </motion.div>

          {/* Mobile Divider */}
          <div className="lg:hidden flex items-center justify-center py-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Guardian Bot (Good Theme) */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={cn(
              'relative p-6 lg:p-12 flex flex-col justify-center',
              'bg-gradient-to-br from-good-primary/10 via-good-accent/5 to-transparent',
              'min-h-[60vh] lg:min-h-[80vh]'
            )}
          >
            {/* Theme indicator */}
            <div className="absolute top-6 right-6">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-good-primary" />
                <span className="text-good-primary font-medium uppercase tracking-wider text-sm">
                  Good
                </span>
              </div>
            </div>

            {/* Content + Animation Row */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Animation (Left side on desktop) */}
              <div className="flex-1 w-full flex items-center justify-center lg:justify-start">
                <Lottie
                  animationData={GreenSamurai}
                  loop
                  autoplay
                  className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64 xl:w-72 xl:h-72 transform scale-x-[-1]"
                  aria-label="Green samurai idle animation"
                />
              </div>

              {/* Text Content */}
              <div className="max-w-lg ml-auto flex-1">
                <h2 className="font-orbitron font-bold text-3xl lg:text-4xl mb-6 text-good-primary text-right">
                  Guardian Bot
                </h2>
                <p className="text-lg text-cyber-muted mb-8 leading-relaxed text-right">
                  Monitor network traffic, detect anomalies, and get instant alerts 
                  with one-click mitigation suggestions.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Activity, text: 'Live traffic insights' },
                    { icon: Bell, text: 'Attack alerts' },
                    { icon: Radar, text: 'One-click mitigations' },
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-end space-x-3"
                    >
                      <span className="text-cyber-text">{text}</span>
                      <div className="p-2 rounded-lg bg-good-primary/20 border border-good-primary/30">
                        <Icon className="h-5 w-5 text-good-primary" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="w-full">
                  <button
                    type="button"
                    className={cn(
                      // layout
                      'block w-full px-8 py-4 rounded-2xl font-semibold text-lg text-center',
                      // colors
                      'bg-good-primary text-black border border-good-primary/20',
                      // effects
                      'shadow-lg transition-all duration-200 transform',
                      // hover/focus states
                      'hover:bg-good-primary-hover hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-good-primary/40',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good-primary/60',
                      // accessibility cursor
                      'cursor-pointer'
                    )}
                    onClick={handleGuardianClick}
                  >
                    Chat with Guardian
                  </button>
                </div>
              </div>
            </div>

            {/* Glow effect (non-interactive, behind content) */}
            <div className="absolute inset-0 -z-10 pointer-events-none bg-good-primary/5 rounded-full blur-3xl" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Desktop Divider Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-evil-primary via-border to-good-primary"
        />
      </div>
    </div>
  );
}
