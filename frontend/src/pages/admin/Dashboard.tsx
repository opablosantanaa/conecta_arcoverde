import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Shield, ScrollText, Settings, ArrowRight } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async () => {
      try {
        return (await api.get('/admin/usuarios?size=100')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const totalUsuarios = usuarios?.totalElements ?? 0;
  const porPerfil = (usuarios?.content ?? []).reduce((acc: any, u: any) => {
    acc[u.perfil] = (acc[u.perfil] || 0) + 1;
    return acc;
  }, {});

  const cards = [
    { label: 'Usuários cadastrados', value: totalUsuarios, icon: Users, color: 'bg-primary-500', to: '/admin/usuarios' },
    { label: 'Administradores', value: porPerfil['ADMIN'] ?? 0, icon: Shield, color: 'bg-error', to: '/admin/usuarios' },
    { label: 'Perfis de acesso', value: 5, icon: Settings, color: 'bg-info', to: '/admin/permissoes' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
            Painel Administrativo
          </h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Gerencie usuários, permissões e acompanhe a auditoria do sistema.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/usuarios">Gerenciar Usuários</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-1/3" />
            </Card>
          ))
        ) : (
          cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link key={i} to={c.to}>
                <Card padding="md" hoverable className="relative overflow-hidden h-full">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${c.color} opacity-10 rounded-organic-lg -translate-y-1/2 translate-x-1/2`} />
                  <div className={`w-10 h-10 rounded-btn ${c.color} text-white flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold text-content dark:text-content-dark">{c.value}</div>
                  <div className="text-sm text-content-secondary dark:text-content-secondary">{c.label}</div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Distribuição por perfil */}
      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Distribuição por perfil</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['CANDIDATO', 'EMPRESA', 'ACA', 'PREFEITURA', 'ADMIN'].map(perfil => (
            <div key={perfil} className="p-4 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-center">
              <div className="text-2xl font-bold text-content dark:text-content-dark">{porPerfil[perfil] ?? 0}</div>
              <div className="text-xs text-content-muted mt-1">{perfil}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ações rápidas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card hoverable padding="lg" className="cursor-pointer" onClick={() => window.location.href = '/admin/usuarios'}>
          <Users className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-semibold text-content dark:text-content-dark mb-1">Usuários</h3>
          <p className="text-sm text-content-secondary dark:text-content-secondary">Criar, editar e gerenciar contas administrativas.</p>
        </Card>
        <Card hoverable padding="lg" className="cursor-pointer" onClick={() => window.location.href = '/admin/permissoes'}>
          <Shield className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-semibold text-content dark:text-content-dark mb-1">Permissões</h3>
          <p className="text-sm text-content-secondary dark:text-content-secondary">Controle granular de acesso por funcionalidade.</p>
        </Card>
        <Card hoverable padding="lg" className="cursor-pointer" onClick={() => window.location.href = '/admin/auditoria'}>
          <ScrollText className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-semibold text-content dark:text-content-dark mb-1">Auditoria</h3>
          <p className="text-sm text-content-secondary dark:text-content-secondary">Logs de todas as ações administrativas.</p>
        </Card>
      </div>
    </div>
  );
}