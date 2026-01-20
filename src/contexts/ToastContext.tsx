import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
  position: ToastPosition;
}

interface ToastContextValue {
  toasts: Toast[];
  notify: (
    type: ToastType,
    message: string,
    options?: {
      title?: string;
      duration?: number;
      position?: ToastPosition;
    }
  ) => string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

type ToastOptions = {
  title?: string;
  duration?: number;
  position?: ToastPosition;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;
const DEFAULT_POSITION: ToastPosition = 'top-right';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const notify = useCallback(
    (
      type: ToastType,
      message: string,
      options?: ToastOptions
    ): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const toast: Toast = {
        id,
        type,
        message,
        title: options?.title,
        duration: options?.duration ?? DEFAULT_DURATION,
        position: options?.position ?? DEFAULT_POSITION,
      };

      setToasts((current) => [...current, toast]);

      // Auto dismiss
      if (toast.duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, toast.duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) =>
      notify('success', message, options),
    [notify]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) =>
      notify('error', message, options),
    [notify]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) =>
      notify('warning', message, options),
    [notify]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) =>
      notify('info', message, options),
    [notify]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        notify,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
