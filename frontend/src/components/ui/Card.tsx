import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-surface dark:bg-surface-dark-secondary border border-border dark:border-border-dark rounded-card shadow-card',
        hoverable && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        paddings[padding],
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';