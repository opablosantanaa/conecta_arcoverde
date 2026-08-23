import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Building2, Filter, X, Clock, Banknote } from 'lucide-react';
import api from '@/api/client';
import type { Vaga, Area } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const contractLabels: Record<string, string> = {
  CLT: 'CLT',
  TEMPORARIO: 'TemporÃ¡rio',
  ESTAGIO: 'EstÃ¡gio',
  AUTONOMO: 'AutÃ´nomo',
  OUTROS: 'Outros',
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return 'A combinar';
  const fmt = (v: number) => v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return min ? `A partir de ${fmt(min)}` : `Até ${fmt(max)}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function Vagas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    titulo: searchParams.get('titulo') || '',
    areaId: undefined as number | undefined,
    cidade: '',
    tipoContrato: '',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => (await api.get<Area[]>('/areas')).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['vagas-public', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.titulo)       params.set('titulo', filters.titulo);
      if (filters.areaId)       params.set('areaId', String(filters.areaId));
      if (filters.cidade)       params.set('cidade', filters.cidade);
      if (filters.tipoContrato) params.set('tipoContrato', filters.tipoContrato);
      params.set('size', '20');
      return (await api.get(`/vagas/public?${params}`)).data as { content: Vaga[]; totalElements: number };
    },
  });

  const vagas = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  const clearFilters = () => {
    setFilters({ titulo: '', areaId: undefined, cidade: '', tipoContrato: '' });
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-content dark:text-content-dark flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filtros
        </h3>
        <button onClick={clearFilters} className="text-xs text-primary-500 hover:underline">Limpar</button>
      </div>

      <Input
        placeholder="TÃ­tulo da vaga"
        value={filters.titulo}
        onChange={e => setFilters(f => ({ ...f, titulo: e.target.value }))}
        leftIcon={<Search className="w-4 h-4" />}
      />

      <div>
        <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Ãrea</label>
        <select
          value={filters.areaId ?? ''}
          onChange={e => setFilters(f => ({ ...f, areaId: e.target.value ? Number(e.target.value) : undefined }))}
          className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">Todas as Ã¡reas</option>
          {areas?.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
      </div>

      <Input
        placeholder="Cidade"
        value={filters.cidade}
        onChange={e => setFilters(f => ({ ...f, cidade: e.target.value }))}
        leftIcon={<MapPin className="w-4 h-4" />}
      />

      <div>
        <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Tipo de contrato</label>
        <select
          value={filters.tipoContrato}
          onChange={e => setFilters(f => ({ ...f, tipoContrato: e.target.value }))}
          className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(contractLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content dark:text-content-dark mb-2">Vagas disponÃ­veis</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          {isLoading ? 'Buscando vagas...' : `${total} ${total === 1 ? 'vaga encontrada' : 'vagas encontradas'}`}
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <Card padding="md" className="sticky top-20">
            <FilterPanel />
          </Card>
        </aside>

        <div className="lg:hidden">
          <Button variant="outline" fullWidth onClick={() => setShowMobileFilters(true)}>
            <Filter className="w-4 h-4" /> Filtrar vagas
          </Button>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-surface dark:bg-surface-dark p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-content dark:text-content-dark">Filtros</h3>
                <button onClick={() => setShowMobileFilters(false)} aria-label="Fechar filtros">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel />
              <Button fullWidth className="mt-6" onClick={() => setShowMobileFilters(false)}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        )}

        <div>
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <Card key={i} padding="md">
                  <div className="flex gap-4">
                    <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : vagas.length === 0 ? (
            <EmptyState
              title="Nenhuma vaga encontrada"
              description="Tente ajustar os filtros para ver mais resultados."
              action={<Button variant="outline" onClick={clearFilters}>Limpar filtros</Button>}
            />
          ) : (
            <div className="space-y-4">
              {vagas.map(vaga => (
                <Card key={vaga.id} hoverable padding="md" className="transition-shadow hover:shadow-card-hover">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 flex-shrink-0">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-content dark:text-content-dark text-lg leading-tight">
                            {vaga.titulo}
                          </h3>
                          <p className="text-sm text-content-secondary dark:text-content-secondary mt-0.5">
                            {vaga.empresaOculta ? 'Empresa confidencial' : vaga.nomeEmpresa}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {vaga.tipoContrato && (
                            <Badge variant="primary">{contractLabels[vaga.tipoContrato] || vaga.tipoContrato}</Badge>
                          )}
                          <Badge variant="default">{vaga.area}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-content-muted mb-3">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {vaga.cidade}, {vaga.estado}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Banknote className="w-3.5 h-3.5" /> {formatSalary(vaga.salarioMinimo, vaga.salarioMaximo)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(vaga.criadoEm)}
                        </span>
                      </div>

                      {vaga.descricao && (
                        <p className="text-sm text-content-secondary dark:text-content-secondary line-clamp-2 mb-4">
                          {vaga.descricao}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-content-muted">
                          {vaga.quantidadeVagas} {vaga.quantidadeVagas === 1 ? 'vaga' : 'vagas'}
                        </span>
                        <Button asChild variant="outline" size="sm">
  <Link to={`/vagas/${vaga.id}`}>Ver detalhes</Link>
</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}