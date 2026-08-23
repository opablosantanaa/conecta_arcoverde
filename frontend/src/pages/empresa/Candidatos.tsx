import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Search, Mail, Phone, Calendar, ChevronDown, Briefcase } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  INSCRITO:             { label: 'Inscrito',             variant: 'info' },
  EM_ANALISE:           { label: 'Em análise',           variant: 'warning' },
  CONVOCADO_ENTREVISTA: { label: 'Convocado entrevista', variant: 'primary' },
  SELECIONADO:          { label: 'Selecionado',          variant: 'success' },
  NAO_SELECIONADO:      { label: 'Não selecionado',      variant: 'error' },
  DESISTIU:             { label: 'Desistiu',             variant: 'default' },
};

export default function Candidatos() {
  const [busca, setBusca] = useState('');
  const [filtroVaga, setFiltroVaga] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [candidatoAberto, setCandidatoAberto] = useState<number | null>(null);

  // Buscar todas as candidaturas de todas as vagas da empresa
  const { data: candidaturasConsolidadas, isLoading } = useQuery({
    queryKey: ['empresa-todas-candidaturas'],
    queryFn: async () => {
      // 1. Buscar vagas da empresa
      const vagasRes = await api.get('/empresa/vagas?size=100');
      const vagas = vagasRes.data?.content ?? [];

      // 2. Para cada vaga, buscar candidaturas
      const todasCandidaturas = await Promise.all(
        vagas.map(async (vaga: any) => {
          try {
            const candRes = await api.get(`/empresa/vagas/${vaga.id}/candidaturas?size=100`);
            const cands = candRes.data?.content ?? [];
            return cands.map((c: any) => ({
              ...c,
              tituloVaga: vaga.titulo,
              vagaId: vaga.id,
            }));
          } catch {
            return [];
          }
        })
      );

      return todasCandidaturas.flat();
    },
  });

  const { data: vagasData } = useQuery({
    queryKey: ['empresa-vagas'],
    queryFn: async () => (await api.get('/empresa/vagas?size=100')).data,
  });

  const vagas = vagasData?.content ?? [];
  const todas = candidaturasConsolidadas ?? [];

  const filtradas = todas.filter((c: any) => {
    const matchBusca = !busca || c.nomeCandidato?.toLowerCase().includes(busca.toLowerCase());
    const matchVaga = !filtroVaga || c.vagaId === Number(filtroVaga);
    const matchStatus = !filtroStatus || c.estado === filtroStatus;
    return matchBusca && matchVaga && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Candidatos</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Todos os candidatos que se inscreveram em suas vagas.
        </p>
      </div>

      {/* Filtros */}
      <Card padding="md">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <select
            value={filtroVaga}
            onChange={e => setFiltroVaga(e.target.value)}
            className="rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">Todas as vagas</option>
            {vagas.map((v: any) => <option key={v.id} value={v.id}>{v.titulo}</option>)}
          </select>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os status</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </Card>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Card key={i} padding="md"><Skeleton className="h-24 w-full" /></Card>)}
        </div>
      ) : filtradas.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="Nenhum candidato encontrado"
            description={todas.length === 0 ? 'Ainda não há candidaturas em suas vagas.' : 'Ajuste os filtros para ver mais resultados.'}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtradas.map((cand: any) => {
            const st = statusConfig[cand.estado] || statusConfig.INSCRITO;
            const aberto = candidatoAberto === cand.candidaturaId;

            return (
              <Card key={cand.candidaturaId} padding="md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-semibold flex-shrink-0">
                    {cand.nomeCandidato?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                      <div>
                        <h3 className="font-semibold text-content dark:text-content-dark text-lg">
                          {cand.nomeCandidato}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-content-muted mt-1">
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            <Link to={`/empresa/vagas/${cand.vagaId}`} className="hover:text-primary-500">
                              {cand.tituloVaga}
                            </Link>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(cand.dataCandidatura).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-content-muted mb-3">
                      {cand.emailCandidato && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {cand.emailCandidato}
                        </span>
                      )}
                      {cand.telefoneCandidato && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> {cand.telefoneCandidato}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setCandidatoAberto(aberto ? null : cand.candidaturaId)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:underline"
                    >
                      {aberto ? 'Ocultar currículo' : 'Ver currículo completo'}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', aberto && 'rotate-180')} />
                    </button>

                    {aberto && (
                      <div className="mt-4 space-y-4 animate-fade-in">
                        {cand.objetivoCurriculo && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-1">Objetivo</h4>
                            <p className="text-sm text-content-secondary dark:text-content-secondary">{cand.objetivoCurriculo}</p>
                          </div>
                        )}
                        {cand.resumoProfissional && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-1">Resumo profissional</h4>
                            <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{cand.resumoProfissional}</p>
                          </div>
                        )}
                        {cand.experiencias?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-2">Experiências</h4>
                            <div className="space-y-2">
                              {cand.experiencias.map((exp: any, i: number) => (
                                <div key={i} className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
                                  <div className="font-medium text-sm text-content dark:text-content-dark">
                                    {exp.cargo} · {exp.empresa}
                                  </div>
                                  {exp.descricao && <p className="text-xs text-content-muted mt-1">{exp.descricao}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {cand.formacoes?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-2">Formação</h4>
                            <div className="space-y-2">
                              {cand.formacoes.map((f: any, i: number) => (
                                <div key={i} className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
                                  <div className="font-medium text-sm text-content dark:text-content-dark">{f.curso} · {f.instituicao}</div>
                                  <div className="text-xs text-content-muted mt-1">{f.nivel}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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