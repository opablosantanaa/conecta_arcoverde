import { ButtonHTMLAttributes, ReactNode, cloneElement, isValidElement } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm',
  outline:   'border border-border dark:border-border-dark text-content dark:text-content-dark hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary',
  ghost:     'text-content dark:text-content-dark hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary',
  secondary: 'bg-surface-tertiary dark:bg-surface-dark-tertiary text-content dark:text-content-dark hover:opacity-90',
  danger:    'bg-error text-white hover:bg-error/90',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export function Button({
  className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon,
  fullWidth, asChild, children, disabled, ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-btn font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      className: cn(classes, (children as any).props.className),
      children: (
        <>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
          {(children as any).props.children}
          {!isLoading && rightIcon}
        </>
      ),
    });
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}