import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, FileCheck, CalendarCheck, TrendingUp, ArrowRight, Clock, GraduationCap } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const statusLabels: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  INSCRITO:             { label: 'Inscrito',             variant: 'info' },
  EM_ANALISE:           { label: 'Em análise',           variant: 'warning' },
  CONVOCADO_ENTREVISTA: { label: 'Entrevista',           variant: 'primary' },
  SELECIONADO:          { label: 'Selecionado',          variant: 'success' },
  NAO_SELECIONADO:      { label: 'Não selecionado',      variant: 'error' },
  DESISTIU:             { label: 'Desistiu',             variant: 'default' },
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: candidaturas, isLoading: loadingCand } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: async () => {
      try {
        return (await api.get('/candidato/candidaturas?size=100')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const { data: curriculo, isLoading: loadingCurr } = useQuery({
    queryKey: ['meu-curriculo'],
    queryFn: async () => {
      try {
        return (await api.get('/candidato/curriculo')).data;
      } catch { return null; }
    },
  });

  const { data: vagas, isLoading: loadingVagas } = useQuery({
    queryKey: ['vagas-recomendadas'],
    queryFn: async () => {
      try {
        return (await api.get('/vagas/public?size=3')).data;
      } catch { return { content: [], totalElements: 0 }; }
    },
  });

  const todas = candidaturas?.content ?? [];
  const metricas = {
    enviadas: todas.length,
    emAnalise: todas.filter((c: any) => c.estado === 'EM_ANALISE' || c.estado === 'INSCRITO').length,
    entrevistas: todas.filter((c: any) => c.estado === 'CONVOCADO_ENTREVISTA').length,
    selecionado: todas.filter((c: any) => c.estado === 'SELECIONADO').length,
  };

  const cardsMetricas = [
    { label: 'Candidaturas enviadas', value: metricas.enviadas, icon: Briefcase,      color: 'bg-primary-500', to: '/candidato/candidaturas' },
    { label: 'Em análise',            value: metricas.emAnalise, icon: Clock,          color: 'bg-warning',     to: '/candidato/candidaturas' },
    { label: 'Entrevistas agendadas', value: metricas.entrevistas, icon: CalendarCheck, color: 'bg-info',       to: '/candidato/candidaturas' },
    { label: 'Selecionado',           value: metricas.selecionado, icon: TrendingUp,    color: 'bg-success',    to: '/candidato/candidaturas' },
  ];

  const atividadesRecentes = todas.slice(0, 5);
  const vagasRecomendadas = vagas?.content ?? [];
  const curriculoEstado = curriculo?.estado;
  const temCurriculo = !!curriculo;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Painel do Candidato
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Acompanhe suas candidaturas e mantenha seu currículo atualizado.
        </p>
      </div>

      {!loadingCurr && (!temCurriculo || curriculoEstado !== 'VALIDADO') && (
        <Card padding="md" className="border-l-4 border-l-warning bg-warning/5">
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-content dark:text-content-dark mb-1">
                {!temCurriculo && 'Crie seu currículo'}
                {temCurriculo && curriculoEstado === 'RASCUNHO' && 'Complete seu currículo'}
                {temCurriculo && curriculoEstado === 'PENDENTE_VALIDACAO' && 'Currículo em validação'}
                {temCurriculo && curriculoEstado === 'REJEITADO' && 'Currículo precisa de ajustes'}
              </h3>
              <p className="text-sm text-content-secondary dark:text-content-secondary mb-3">
                {!temCurriculo && 'Para começar a se candidatar, você precisa criar e validar seu currículo.'}
                {temCurriculo && curriculoEstado === 'RASCUNHO' && 'Um currículo completo e validado é obrigatório para se candidatar a vagas.'}
                {temCurriculo && curriculoEstado === 'PENDENTE_VALIDACAO' && 'Seu currículo está sendo analisado pela equipe da ACA.'}
                {temCurriculo && curriculoEstado === 'REJEITADO' && (curriculo?.motivoRejeicao || 'Revise e envie novamente.')}
              </p>
              <Button asChild size="sm">
                <Link to="/candidato/curriculo">
                  {!temCurriculo ? 'Criar Currículo' : 'Abrir Currículo'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Cards de métricas clicáveis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingCand ? (
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
              <button
                key={i}
                onClick={() => navigate(c.to)}
                className="text-left w-full"
                aria-label={`Ver ${c.label}: ${c.value}`}
              >
                <Card padding="md" hoverable className="relative overflow-hidden h-full">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${c.color} opacity-10 rounded-organic-lg -translate-y-1/2 translate-x-1/2`} />
                  <div className={`w-10 h-10 rounded-btn ${c.color} text-white flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold text-content dark:text-content-dark">{c.value}</div>
                  <div className="text-sm text-content-secondary dark:text-content-secondary">{c.label}</div>
                </Card>
              </button>
            );
          })
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card padding="none" className="lg:col-span-2">
          <div className="p-5 border-b border-border dark:border-border-dark flex items-center justify-between">
            <h2 className="font-semibold text-content dark:text-content-dark">Atividades recentes</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/candidato/candidaturas">Ver todas</Link>
            </Button>
          </div>

          {loadingCand ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : atividadesRecentes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Nenhuma candidatura ainda"
                description="Comece a se candidatar a vagas para acompanhar seu progresso aqui."
                action={
                  <Button asChild size="sm">
                    <Link to="/vagas">Buscar vagas</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-border-dark">
              {atividadesRecentes.map((cand: any) => {
                const st = statusLabels[cand.estado] || statusLabels.INSCRITO;
                return (
                  <div key={cand.id} className="p-4 flex items-center gap-4 hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors">
                    <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-content dark:text-content-dark truncate">{cand.tituloVaga}</div>
                      <div className="text-xs text-content-muted truncate">
                        {cand.empresaOculta ? 'Empresa confidencial' : cand.empresaVaga} · {new Date(cand.dataCandidatura).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border dark:border-border-dark">
            <h2 className="font-semibold text-content dark:text-content-dark">Vagas recomendadas</h2>
          </div>
          {loadingVagas ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : vagasRecomendadas.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={<GraduationCap className="w-8 h-8" />} title="Sem vagas no momento" description="Novas vagas são publicadas diariamente." />
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-border-dark">
              {vagasRecomendadas.map((v: any) => (
                <Link key={v.id} to={`/vagas/${v.id}`} className="block p-4 hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors">
                  <div className="font-medium text-sm text-content dark:text-content-dark mb-1 line-clamp-1">{v.titulo}</div>
                  <div className="text-xs text-content-muted mb-2">
                    {v.empresaOculta ? 'Confidencial' : v.nomeEmpresa} · {v.cidade}
                  </div>
                  <Badge variant="primary" size="sm">{v.tipoContrato}</Badge>
                </Link>
              ))}
              <div className="p-3">
                <Button asChild variant="outline" fullWidth size="sm">
                  <Link to="/vagas">Ver todas as vagas</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}