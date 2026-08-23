import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useNotificacoes, Notificacao } from '@/hooks/useNotificacoes';
import { useAuthStore } from '@/store/authStore';

const iconesPorTipo = {
  success: <CheckCircle2 className="w-4 h-4 text-success" />,
  info: <Info className="w-4 h-4 text-info" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notificacoes, totalNaoLidas, marcarComoLida } = useNotificacoes();
  const perfil = useAuthStore(s => s.user)?.perfil;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotificacaoClick = (n: Notificacao) => {
    marcarComoLida(n.id);
    setOpen(false);

    // Navegar para página relevante
    if (n.id.startsWith('candidatura_') && perfil === 'EMPRESA') {
      navigate('/empresa/candidatos');
    } else if (n.id.startsWith('vaga_')) {
      const vagaId = n.id.replace('vaga_', '');
      navigate(`/vagas/${vagaId}`);
    } else if (n.id === 'curriculo_validado') {
      navigate('/candidato/curriculo');
    }

    // Forçar atualização das notificações
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-btn text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
        aria-label={`Notificações${totalNaoLidas > 0 ? ` (${totalNaoLidas} não lidas)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {totalNaoLidas > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-card bg-surface dark:bg-surface-dark-secondary border border-border dark:border-border-dark shadow-modal z-50 overflow-hidden">
          <div className="p-4 border-b border-border dark:border-border-dark">
            <h3 className="font-semibold text-sm text-content dark:text-content-dark">Notificações</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notificacoes.length === 0 ? (
              <div className="p-6 text-center text-sm text-content-muted">
                Nenhuma notificação no momento.
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border-dark">
                {notificacoes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificacaoClick(n)}
                    className="w-full text-left p-4 hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{iconesPorTipo[n.tipo]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-content dark:text-content-dark">{n.titulo}</div>
                        <div className="text-xs text-content-muted mt-0.5 line-clamp-2">{n.mensagem}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}