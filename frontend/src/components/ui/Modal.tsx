import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-surface dark:bg-surface-dark rounded-card shadow-modal w-full max-h-[90vh] overflow-y-auto animate-slide-up', sizes[size])}>
        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark z-10">
          <h2 className="text-lg font-semibold text-content dark:text-content-dark">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-btn hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}