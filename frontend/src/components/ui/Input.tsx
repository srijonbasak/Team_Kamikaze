import { useState, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  glow?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, glow, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-cyber-text">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border border-cyber-border bg-cyber-surface/50 px-3 py-2 text-sm text-cyber-text placeholder:text-cyber-muted focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all duration-200',
              error && 'border-cyber-danger focus:ring-cyber-danger/50 focus:border-cyber-danger',
              glow && focused && 'shadow-[0_0_20px_var(--primary,theme(colors.primary/0.2))]',
              className
            )}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-2 w-2 rounded-full bg-cyber-danger" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-cyber-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
