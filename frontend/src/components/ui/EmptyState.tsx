import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-tertiary dark:bg-surface-dark-tertiary flex items-center justify-center mb-4 text-content-muted">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-content dark:text-content-dark mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-content-secondary dark:text-content-secondary max-w-md mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}