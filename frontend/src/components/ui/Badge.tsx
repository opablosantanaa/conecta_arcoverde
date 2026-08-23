import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const variants: Record<Variant, string> = {
  default: 'bg-surface-tertiary dark:bg-surface-dark-tertiary text-content-secondary dark:text-content-secondary',
  primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error:   'bg-error/10 text-error',
  info:    'bg-info/10 text-info',
};

export function Badge({ variant = 'default', size = 'sm', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}