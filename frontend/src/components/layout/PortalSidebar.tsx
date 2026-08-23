import { NavLink, useLocation } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalSidebarProps {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}

export function PortalSidebar({ items, open, onClose }: PortalSidebarProps) {
  const location = useLocation();
  const logout = useAuthStore(s => s.logout);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border dark:border-border-dark flex items-center justify-between">
        <span className="font-bold text-content dark:text-content-dark">Menu</span>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-btn hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all',
                active
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-content-secondary dark:text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary hover:text-content dark:hover:text-content-dark'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border dark:border-border-dark">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-btn text-sm font-medium text-content-secondary dark:text-content-secondary hover:bg-error/10 hover:text-error transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border dark:lg:border-border-dark bg-surface dark:bg-surface-dark-secondary">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface dark:bg-surface-dark shadow-2xl animate-slide-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}