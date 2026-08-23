import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  RASCUNHO:              { label: 'Rascunho',              variant: 'default' },
  AGUARDANDO_APROVACAO:  { label: 'Aguardando aprovação',  variant: 'warning' },
  APROVADA:              { label: 'Aprovada',              variant: 'info' },
  PUBLICADA:             { label: 'Publicada',             variant: 'success' },
  ENCERRADA:             { label: 'Encerrada',             variant: 'default' },
  CANCELADA:             { label: 'Cancelada',             variant: 'error' },
};

export default function EmpresaDashboard() {
  const { data: vagas, isLoading: loadingVagas } = useQuery({
    queryKey: ['empresa-vagas'],
    queryFn: async () => (await api.get('/empresa/vagas?size=100')).data,
  });

  const listaVagas = vagas?.content ?? [];

  const metricas = {
    total: listaVagas.length,
    ativas: listaVagas.filter((v: any) => v.estadoVaga === 'PUBLICADA').length,
    aguardando: listaVagas.filter((v: any) => v.estadoVaga === 'AGUARDANDO_APROVACAO').length,
    encerradas: listaVagas.filter((v: any) => v.estadoVaga === 'ENCERRADA').length,
  };

  const cardsMetricas = [
    { label: 'Total de vagas',    value: metricas.total,      icon: Briefcase,    color: 'bg-primary-500' },
    { label: 'Vagas ativas',      value: metricas.ativas,     icon: TrendingUp,   color: 'bg-success' },
    { label: 'Aguardando aprovação', value: metricas.aguardando, icon: Clock,     color: 'bg-warning' },
    { label: 'Encerradas',        value: metricas.encerradas, icon: CheckCircle2, color: 'bg-content-muted' },
  ];

  const vagasRecentes = listaVagas.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
            Painel da Empresa
          </h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Acompanhe suas vagas e candidatos em um só lugar.
          </p>
        </div>
        <Button asChild>
          <Link to="/empresa/vagas">Ver todas as vagas</Link>
        </Button>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingVagas ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-1/3" />
            </Card>
          ))
        ) : (
          cardsMetricas.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i} padding="md" className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 ${c.color} opacity-10 rounded-organic-lg -translate-y-1/2 translate-x-1/2`} />
                <div className={`w-10 h-10 rounded-btn ${c.color} text-white flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-content dark:text-content-dark">{c.value}</div>
                <div className="text-sm text-content-secondary dark:text-content-secondary">{c.label}</div>
              </Card>
            );
          })
        )}
      </div>

      {/* Vagas recentes */}
      <Card padding="none">
        <div className="p-5 border-b border-border dark:border-border-dark flex items-center justify-between">
          <h2 className="font-semibold text-content dark:text-content-dark">Vagas recentes</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/empresa/vagas">Ver todas</Link>
          </Button>
        </div>

        {loadingVagas ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : vagasRecentes.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Briefcase className="w-8 h-8" />}
              title="Nenhuma vaga cadastrada"
              description="Suas vagas aparecem aqui assim que a ACA/Prefeitura cadastrar uma para sua empresa."
            />
          </div>
        ) : (
          <div className="divide-y divide-border dark:divide-border-dark">
            {vagasRecentes.map((vaga: any) => {
              const st = statusConfig[vaga.estadoVaga] || statusConfig.RASCUNHO;
              return (
                <Link
                  key={vaga.id}
                  to={`/empresa/vagas/${vaga.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-content dark:text-content-dark truncate">
                      {vaga.titulo}
                    </div>
                    <div className="text-xs text-content-muted">
                      {new Date(vaga.criadoEm).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                  <ArrowRight className="w-4 h-4 text-content-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}