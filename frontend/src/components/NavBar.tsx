import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/docs', label: 'FAQ', icon: FileText },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-cyber-surface/80 backdrop-blur-md border-b border-cyber-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Shield className="h-8 w-8 text-evil-primary group-hover:text-evil-accent transition-colors" />
              <div className="absolute inset-0 bg-evil-primary/20 rounded-full blur-md group-hover:bg-evil-accent/20 transition-colors" />
            </div>
            <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-evil-primary to-evil-accent bg-clip-text text-transparent">
              CyberNet Duo
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors group',
                    isActive
                      ? 'text-evil-primary'
                      : 'text-cyber-muted hover:text-cyber-text'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-evil-primary/10 rounded-lg border border-evil-primary/20"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-evil-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg hover:bg-cyber-border/50 transition-colors"
              aria-label="Open menu"
              title="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
