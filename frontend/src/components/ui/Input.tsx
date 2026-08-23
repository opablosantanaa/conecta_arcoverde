import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-content dark:text-content-dark placeholder-content-muted dark:placeholder-content-muted transition-colors',
              'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              'disabled:bg-surface-tertiary dark:disabled:bg-surface-dark-tertiary disabled:cursor-not-allowed',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-content-muted">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-error" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';