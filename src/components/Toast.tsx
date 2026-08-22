import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bg = 'bg-white text-slate-800 border-slate-200 shadow-lg';
          let Icon = Info;
          let iconColor = 'text-blue-600';

          if (toast.type === 'success') {
            bg = 'bg-white text-slate-800 border-green-200 shadow-lg border-l-4 border-l-green-500';
            Icon = CheckCircle2;
            iconColor = 'text-green-600';
          } else if (toast.type === 'warning') {
            bg = 'bg-white text-slate-800 border-orange-200 shadow-lg border-l-4 border-l-orange-500';
            Icon = AlertTriangle;
            iconColor = 'text-orange-500';
          } else if (toast.type === 'error') {
            bg = 'bg-white text-slate-800 border-red-200 shadow-lg border-l-4 border-l-red-500';
            Icon = XCircle;
            iconColor = 'text-red-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${bg}`}
              role="alert"
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900">{toast.title}</div>
                {toast.message && (
                  <div className="text-xs mt-0.5 text-slate-500 leading-relaxed break-words">
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
