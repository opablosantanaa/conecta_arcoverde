import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Filter, X, MapPin, Building2 } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  INSCRITO:             { label: 'Inscrito',             variant: 'info' },
  EM_ANALISE:           { label: 'Em análise',           variant: 'warning' },
  CONVOCADO_ENTREVISTA: { label: 'Convocado entrevista', variant: 'primary' },
  SELECIONADO:          { label: 'Selecionado',          variant: 'success' },
  NAO_SELECIONADO:      { label: 'Não selecionado',      variant: 'error' },
  DESISTIU:             { label: 'Desistiu',             variant: 'default' },
};

export default function Candidaturas() {
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['minhas-candidaturas', filtroEstado],
    queryFn: async () => {
      const r = await api.get('/candidato/candidaturas?size=50');
      return r.data;
    },
  });

  const todas = data?.content ?? [];
  const filtradas = filtroEstado
    ? todas.filter((c: any) => c.estado === filtroEstado)
    : todas;

  const contadores = todas.reduce((acc: any, c: any) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Minhas Candidaturas
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Acompanhe o status de todas as suas candidaturas.
        </p>
      </div>

      {/* Filtros por status */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroEstado('')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            !filtroEstado
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-surface dark:bg-surface-dark-secondary text-content-secondary border-border dark:border-border-dark hover:border-primary-500'
          }`}
        >
          Todas ({todas.length})
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = contadores[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFiltroEstado(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filtroEstado === key
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-surface dark:bg-surface-dark-secondary text-content-secondary border-border dark:border-border-dark hover:border-primary-500'
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} padding="md">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title={filtroEstado ? 'Nenhuma candidatura com este status' : 'Você ainda não se candidatou a nenhuma vaga'}
            description={filtroEstado ? 'Tente outro filtro.' : 'Explore as vagas disponíveis e comece sua jornada.'}
            action={
              !filtroEstado && (
                <Button asChild>
                  <Link to="/vagas">Buscar vagas</Link>
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtradas.map((cand: any) => {
            const st = statusConfig[cand.estado] || statusConfig.INSCRITO;
            return (
              <Card key={cand.id} hoverable padding="md">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <h3 className="font-semibold text-content dark:text-content-dark text-lg leading-tight">
                          {cand.tituloVaga}
                        </h3>
                        <p className="text-sm text-content-secondary dark:text-content-secondary mt-0.5">
                          {cand.empresaOculta ? 'Empresa confidencial' : cand.empresaVaga}
                        </p>
                      </div>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-content-muted mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Candidatura em {new Date(cand.dataCandidatura).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {cand.resultado && (
                      <div className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-sm text-content-secondary dark:text-content-secondary mb-3">
                        <strong>Feedback:</strong> {cand.resultado}
                      </div>
                    )}

                    {cand.estado === 'CONVOCADO_ENTREVISTA' && (
                      <Card padding="sm" className="border-l-4 border-l-primary-500 bg-primary-50 dark:bg-primary-900/10">
                        <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          Você foi convocado para uma entrevista! Fique atento às comunicações.
                        </p>
                      </Card>
                    )}

                    {cand.estado === 'SELECIONADO' && (
                      <Card padding="sm" className="border-l-4 border-l-success bg-success/5">
                        <p className="text-sm font-medium text-success">
                          Parabéns! Você foi selecionado para esta vaga.
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}