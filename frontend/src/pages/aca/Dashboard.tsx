import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileCheck, Briefcase, FileWarning, Users, ArrowRight, Clock } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AcaDashboard() {
  const { data: curriculosPendentes, isLoading: loadingCurr } = useQuery({
    queryKey: ['aca-curriculos-pendentes'],
    queryFn: async () => {
      try {
        return (await api.get('/aca/curriculos/pendentes?size=5')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const { data: vagas, isLoading: loadingVagas } = useQuery({
    queryKey: ['aca-vagas'],
    queryFn: async () => {
      try {
        return (await api.get('/aca/vagas?size=5')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const { data: solicitacoes, isLoading: loadingSol } = useQuery({
    queryKey: ['aca-solicitacoes-pendentes'],
    queryFn: async () => {
      try {
        return (await api.get('/aca/solicitacoes/pendentes?size=5')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const totalPendentes = curriculosPendentes?.totalElements ?? 0;
  const totalVagas = vagas?.totalElements ?? 0;
  const totalSolicitacoes = solicitacoes?.totalElements ?? 0;

  const cards = [
    { label: 'Currículos pendentes', value: totalPendentes, icon: FileCheck, color: 'bg-warning', to: '/aca/curriculos' },
    { label: 'Vagas cadastradas', value: totalVagas, icon: Briefcase, color: 'bg-primary-500', to: '/aca/vagas' },
    { label: 'Solicitações pendentes', value: totalSolicitacoes, icon: FileWarning, color: 'bg-info', to: '/aca/solicitacoes' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
            Painel ACA
          </h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Gerencie vagas, valide currículos e acompanhe solicitações.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/aca/cadastro-assistido">Cadastro Assistido</Link>
          </Button>
          <Button asChild>
            <Link to="/aca/vagas">Gerenciar Vagas</Link>
          </Button>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(loadingCurr || loadingVagas || loadingSol) ? (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Currículos pendentes */}
        <Card padding="none">
          <div className="p-5 border-b border-border dark:border-border-dark flex items-center justify-between">
            <h2 className="font-semibold text-content dark:text-content-dark flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-500" />
              Currículos aguardando validação
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/aca/curriculos">Ver todos</Link>
            </Button>
          </div>

          {loadingCurr ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (curriculosPendentes?.content?.length ?? 0) === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileCheck className="w-8 h-8" />}
                title="Nenhum currículo pendente"
                description="Todos os currículos foram validados."
              />
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-border-dark">
              {curriculosPendentes.content.slice(0, 5).map((c: any) => (
                <div key={c.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center font-semibold flex-shrink-0">
                    {c.nomeCandidato?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-content dark:text-content-dark truncate">{c.nomeCandidato}</div>
                    <div className="text-xs text-content-muted">
                      Enviado em {new Date(c.atualizadoEm || c.criadoEm).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/aca/curriculos">Validar</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Solicitações pendentes */}
        <Card padding="none">
          <div className="p-5 border-b border-border dark:border-border-dark flex items-center justify-between">
            <h2 className="font-semibold text-content dark:text-content-dark flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-warning" />
              Solicitações de empresas
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/aca/solicitacoes">Ver todas</Link>
            </Button>
          </div>

          {loadingSol ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (solicitacoes?.content?.length ?? 0) === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileWarning className="w-8 h-8" />}
                title="Nenhuma solicitação pendente"
                description="As solicitações das empresas aparecerão aqui."
              />
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-border-dark">
              {solicitacoes.content.slice(0, 5).map((s: any) => (
                <div key={s.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-btn bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-content dark:text-content-dark truncate">{s.tituloVaga}</div>
                    <div className="text-xs text-content-muted line-clamp-1">{s.descricao}</div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/aca/solicitacoes">Responder</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}