import React, { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  theme?: 'evil' | 'good';
}

export default function Card({
  children,
  className,
  hover = false,
  glow = false,
  theme,
}: CardProps) {
  const baseClasses = 'bg-cyber-surface/50 backdrop-blur-md border border-cyber-border rounded-xl';
  
  const themeClasses = {
    evil: 'border-evil-primary/20 bg-evil-primary/5',
    good: 'border-good-primary/20 bg-good-primary/5',
  };
  
  const glowClasses = glow ? 'shadow-[0_0_20px_var(--glow,theme(colors.primary/0.1))]' : '';

  return (
    <motion.div
      className={cn(
        baseClasses,
        theme && themeClasses[theme],
        glowClasses,
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('font-orbitron font-bold text-xl text-cyber-text', className)}>
      {children}
    </h3>
  );
}
