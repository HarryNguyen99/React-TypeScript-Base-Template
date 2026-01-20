import { useMemo } from 'react';
import { useToast, type ToastPosition } from '../../contexts/ToastContext';
import { Toast } from './Toast';

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  // Group toasts by position
  const groupedToasts = useMemo(() => {
    const grouped: Record<ToastPosition, typeof toasts> = {
      'top-right': [],
      'top-left': [],
      'bottom-right': [],
      'bottom-left': [],
      'top-center': [],
      'bottom-center': [],
    };

    toasts.forEach((toast) => {
      grouped[toast.position].push(toast);
    });

    return grouped;
  }, [toasts]);

  return (
    <>
      {(Object.keys(groupedToasts) as ToastPosition[]).map((position) => {
        const positionToasts = groupedToasts[position];
        if (positionToasts.length === 0) return null;

        const isBottom = position.startsWith('bottom');

        return (
          <div
            key={position}
            className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]} ${
              isBottom ? 'flex-col-reverse' : ''
            }`}
          >
            {positionToasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>
        );
      })}
    </>
  );
}
