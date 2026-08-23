import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileCheck, GraduationCap, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function PrefeituraDashboard() {
  const { data: indicadores, isLoading } = useQuery({
    queryKey: ['prefeitura-indicadores'],
    queryFn: async () => {
      try {
        return (await api.get('/prefeitura/indicadores')).data;
      } catch {
        return null;
      }
    },
  });

  const cards = [
    { label: 'Vagas ofertadas', value: indicadores?.totalVagasOfertadas ?? 0, icon: Briefcase, color: 'bg-primary-500' },
    { label: 'Candidatos cadastrados', value: indicadores?.totalCandidatosCadastrados ?? 0, icon: Users, color: 'bg-info' },
    { label: 'Currículos validados', value: indicadores?.totalCurriculosValidados ?? 0, icon: FileCheck, color: 'bg-success' },
    { label: 'Cursos ativos', value: indicadores?.totalCursosDisponiveis ?? 0, icon: GraduationCap, color: 'bg-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
            Painel Prefeitura
          </h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Acompanhe os indicadores de empregabilidade do município.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/prefeitura/cursos">Gerenciar Cursos</Link>
          </Button>
          <Button asChild>
            <Link to="/prefeitura/indicadores">Ver Indicadores</Link>
          </Button>
        </div>
      </div>

      {/* Cards de indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-1/3" />
            </Card>
          ))
        ) : (
          cards.map((c, i) => {
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

      {/* Métricas secundárias */}
      {!isLoading && indicadores && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-btn bg-success/10 text-success flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-content-muted">Taxa de ocupação</div>
                <div className="text-2xl font-bold text-content dark:text-content-dark">
                  {indicadores.taxaOcupacao ? `${(indicadores.taxaOcupacao * 100).toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Percentual de vagas encerradas que foram preenchidas com candidatos selecionados.
            </p>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-btn bg-info/10 text-info flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-content-muted">Média candidatos/vaga</div>
                <div className="text-2xl font-bold text-content dark:text-content-dark">
                  {indicadores.mediaCandidatosPorVaga?.toFixed(2) ?? '0'}
                </div>
              </div>
            </div>
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Número médio de candidaturas recebidas por vaga cadastrada.
            </p>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-btn bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-content-muted">Total de candidaturas</div>
                <div className="text-2xl font-bold text-content dark:text-content-dark">
                  {indicadores.totalCandidaturas ?? 0}
                </div>
              </div>
            </div>
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Candidaturas realizadas na plataforma desde o lançamento.
            </p>
          </Card>
        </div>
      )}

      {/* Vagas por área */}
      {!isLoading && indicadores?.vagasPorArea?.length > 0 && (
        <Card padding="lg">
          <h2 className="font-semibold text-content dark:text-content-dark mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Vagas por área
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {indicadores.vagasPorArea.map((v: any) => (
              <div key={v.area} className="flex items-center justify-between p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
                <span className="text-sm text-content dark:text-content-dark">{v.area}</span>
                <Badge variant="primary">{v.quantidade}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}