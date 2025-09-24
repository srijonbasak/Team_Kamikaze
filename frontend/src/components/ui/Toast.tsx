import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'text-cyber-success border-cyber-success/20 bg-cyber-success/10',
  error: 'text-cyber-danger border-cyber-danger/20 bg-cyber-danger/10',
  warning: 'text-cyber-warning border-cyber-warning/20 bg-cyber-warning/10',
  info: 'text-cyber-info border-cyber-info/20 bg-cyber-info/10',
};

export function Toast({ toast, onRemove }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const Icon = icons[toast.type];

  useEffect(() => {
    if (toast.duration && !isPaused) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove, isPaused]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={cn(
        'relative flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-md',
        'bg-cyber-surface/80 shadow-lg',
        colors[toast.type]
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="text-sm opacity-90 mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Toast hook for easy usage
let toastId = 0;
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = (++toastId).toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, description?: string) => {
    addToast({ type: 'success', title, description, duration: 4000 });
  };

  const error = (title: string, description?: string) => {
    addToast({ type: 'error', title, description, duration: 6000 });
  };

  const warning = (title: string, description?: string) => {
    addToast({ type: 'warning', title, description, duration: 5000 });
  };

  const info = (title: string, description?: string) => {
    addToast({ type: 'info', title, description, duration: 4000 });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
