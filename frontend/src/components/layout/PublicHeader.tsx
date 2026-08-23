import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/',        label: 'Home' },
  { to: '/vagas',   label: 'Vagas' },
  { to: '/cursos',  label: 'Cursos' },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const token = useAuthStore(s => s.token);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-btn bg-primary-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-content dark:text-content-dark">
              Conecta<span className="text-primary-500">Arcoverde</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'px-4 py-2 rounded-btn text-sm font-medium transition-colors',
                  isActive(item.to)
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-content-secondary dark:text-content-secondary hover:text-content dark:hover:text-content-dark hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary'
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-btn text-content-secondary dark:text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {token ? (
                <Button asChild variant="primary" size="sm">
                  <Link to="/dashboard">Acessar Portal</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild variant="primary" size="sm">
                    <Link to="/registro">Registrar</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-btn text-content dark:text-content-dark"
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-btn text-sm font-medium',
                  isActive(item.to)
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-content dark:text-content-dark hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary'
                )}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-border dark:border-border-dark space-y-2">
              {token ? (
                <Button asChild variant="primary" fullWidth>
                  <Link to="/dashboard">Acessar Portal</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" fullWidth>
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild variant="primary" fullWidth>
                    <Link to="/registro">Registrar</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}