import { cn } from '../lib/utils';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'border-t border-cyber-border/60 bg-cyber-surface/60 backdrop-blur-md',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <span className="font-orbitron tracking-wide text-base md:text-lg bg-gradient-to-r from-evil-primary via-cyber-text to-good-primary bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,255,200,0.25)]">
          © 2025 Team Kamikaze — All rights reserved.
        </span>
      </div>
    </footer>
  );
}
