import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Briefcase, GraduationCap, FileCheck, Download } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Indicadores() {
  const { data: ind, isLoading } = useQuery({
    queryKey: ['prefeitura-indicadores'],
    queryFn: async () => (await api.get('/prefeitura/indicadores')).data,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Card key={i} padding="md"><Skeleton className="h-24 w-full" /></Card>)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Vagas ofertadas', value: ind?.totalVagasOfertadas ?? 0, icon: Briefcase, color: 'bg-primary-500' },
    { label: 'Vagas publicadas', value: ind?.totalVagasPublicadas ?? 0, icon: TrendingUp, color: 'bg-info' },
    { label: 'Candidatos', value: ind?.totalCandidatosCadastrados ?? 0, icon: Users, color: 'bg-success' },
    { label: 'Currículos validados', value: ind?.totalCurriculosValidados ?? 0, icon: FileCheck, color: 'bg-warning' },
    { label: 'Candidaturas', value: ind?.totalCandidaturas ?? 0, icon: FileCheck, color: 'bg-primary-700' },
    { label: 'Vagas encerradas', value: ind?.totalVagasEncerradas ?? 0, icon: Briefcase, color: 'bg-content-muted' },
    { label: 'Vagas preenchidas', value: ind?.totalVagasPreenchidas ?? 0, icon: TrendingUp, color: 'bg-success' },
    { label: 'Cursos ativos', value: ind?.totalCursosDisponiveis ?? 0, icon: GraduationCap, color: 'bg-error' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Indicadores</h1>
          <p className="text-content-secondary dark:text-content-secondary">Métricas completas de empregabilidade do município.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="w-4 h-4" /> Exportar
        </Button>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Card key={i} padding="md" className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 ${c.color} opacity-10 rounded-organic-lg -translate-y-1/2 translate-x-1/2`} />
              <div className={`w-10 h-10 rounded-btn ${c.color} text-white flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-content dark:text-content-dark">{c.value}</div>
              <div className="text-xs text-content-secondary dark:text-content-secondary">{c.label}</div>
            </Card>
          );
        })}
      </div>

      {/* KPIs secundários */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h2 className="font-semibold text-content dark:text-content-dark mb-4">Taxas</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
              <span className="text-sm text-content-secondary">Taxa de ocupação</span>
              <span className="font-bold text-content dark:text-content-dark">
                {ind?.taxaOcupacao ? `${(ind.taxaOcupacao * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
              <span className="text-sm text-content-secondary">Média candidatos/vaga</span>
              <span className="font-bold text-content dark:text-content-dark">
                {ind?.mediaCandidatosPorVaga?.toFixed(2) ?? '0'}
              </span>
            </div>
          </div>
        </Card>

        {/* Candidaturas por status */}
        <Card padding="lg">
          <h2 className="font-semibold text-content dark:text-content-dark mb-4">Candidaturas por status</h2>
          <div className="space-y-3">
            {ind?.candidaturasPorStatus && Object.entries(ind.candidaturasPorStatus).map(([status, qtd]: [string, any]) => {
              const total = Object.values(ind.candidaturasPorStatus).reduce((a: number, b: any) => a + b, 0) || 1;
              const pct = ((qtd / total) * 100).toFixed(1);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-content-secondary">{status.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-content dark:text-content-dark">{qtd} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-tertiary dark:bg-surface-dark-tertiary overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Vagas por área */}
      {ind?.vagasPorArea?.length > 0 && (
        <Card padding="lg">
          <h2 className="font-semibold text-content dark:text-content-dark mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" /> Vagas por área
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ind.vagasPorArea.map((v: any) => (
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