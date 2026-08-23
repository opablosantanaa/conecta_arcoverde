import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, ChevronDown, User as UserIcon, LogOut, Sun, Moon, Home } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { NotificationDropdown } from './NotificationDropdown';

interface PortalHeaderProps {
  onMenuClick: () => void;
  userName?: string;
  saudacao?: string;
}

export function PortalHeader({ onMenuClick, userName, saudacao }: PortalHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const logout = useAuthStore(s => s.logout);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 glass border-b border-border dark:border-border-dark">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-btn hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary"
            aria-label="Abrir menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* Botão para voltar à home */}
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-btn text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
            aria-label="Voltar para a página inicial"
            title="Página inicial"
          >
            <Home className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-sm font-semibold text-content dark:text-content-dark">
              Olá, {userName?.split(' ')[0] || 'usuário'}
            </h2>
            <p className="text-xs text-content-muted">{saudacao || 'Bem-vindo ao seu portal'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-btn text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Sistema de notificações */}
          <NotificationDropdown />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-btn hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <ChevronDown className="w-4 h-4 text-content-muted" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-card bg-surface dark:bg-surface-dark-secondary border border-border dark:border-border-dark shadow-modal py-1 z-50">
                <Link
                  to="/perfil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-content dark:text-content-dark hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary"
                >
                  <UserIcon className="w-4 h-4" /> Meu Perfil
                </Link>
                <div className="border-t border-border dark:border-border-dark my-1" />
                <button
                  onClick={() => { logout(); window.location.href = '/'; }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}