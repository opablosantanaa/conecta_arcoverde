import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Users, Briefcase, Mail, Phone, Calendar, ChevronDown, X } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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

const proximosEstados: Record<string, string[]> = {
  INSCRITO:             ['EM_ANALISE', 'NAO_SELECIONADO'],
  EM_ANALISE:           ['CONVOCADO_ENTREVISTA', 'NAO_SELECIONADO'],
  CONVOCADO_ENTREVISTA: ['SELECIONADO', 'NAO_SELECIONADO'],
  SELECIONADO:          [],
  NAO_SELECIONADO:      [],
  DESISTIU:             [],
};

export default function CandidatosVaga() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [candidatoAberto, setCandidatoAberto] = useState<number | null>(null);

  const { data: vaga } = useQuery({
    queryKey: ['empresa-vaga', id],
    queryFn: async () => (await api.get(`/empresa/vagas/${id}`)).data,
    enabled: !!id,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['empresa-candidatos', id],
    queryFn: async () => (await api.get(`/empresa/vagas/${id}/candidaturas?size=100`)).data,
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ candidaturaId, estado, resultado }: { candidaturaId: number; estado: string; resultado?: string }) =>
      api.put(`/empresa/vagas/${id}/candidaturas/${candidaturaId}`, { estado, resultado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa-candidatos', id] });
    },
  });

  const candidatos = data?.content ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-content-muted mb-1">
          <Link to="/empresa/vagas" className="hover:text-primary-500">Minhas Vagas</Link>
          <span>/</span>
          <span className="text-content dark:text-content-dark">{vaga?.titulo || 'Vaga'}</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Candidatos da vaga
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          {vaga?.titulo} · {candidatos.length} {candidatos.length === 1 ? 'candidato' : 'candidatos'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} padding="md">
              <Skeleton className="h-24 w-full" />
            </Card>
          ))}
        </div>
      ) : candidatos.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="Nenhum candidato ainda"
            description="Os candidatos aparecerão aqui assim que se inscreverem nesta vaga."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {candidatos.map((cand: any) => {
            const st = statusConfig[cand.estado] || statusConfig.INSCRITO;
            const aberto = candidatoAberto === cand.candidaturaId;
            const opcoes = proximosEstados[cand.estado] || [];

            return (
              <Card key={cand.candidaturaId} padding="md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-semibold flex-shrink-0">
                    {cand.nomeCandidato?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <h3 className="font-semibold text-content dark:text-content-dark text-lg">
                          {cand.nomeCandidato}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-content-muted mt-1">
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
                          {cand.cidade && (
                            <span>{cand.cidade}, {cand.estado}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-content-muted mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      Candidatura em {new Date(cand.dataCandidatura).toLocaleDateString('pt-BR')}
                    </div>

                    {/* Resumo do currículo */}
                    {cand.objetivoCurriculo && (
                      <p className="text-sm text-content-secondary dark:text-content-secondary line-clamp-2 mb-3">
                        <strong>Objetivo:</strong> {cand.objetivoCurriculo}
                      </p>
                    )}

                    {/* Botão expandir */}
                    <button
                      onClick={() => setCandidatoAberto(aberto ? null : cand.candidaturaId)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:underline"
                    >
                      {aberto ? 'Ocultar currículo' : 'Ver currículo completo'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${aberto ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Currículo expandido */}
                    {aberto && (
                      <div className="mt-4 space-y-4 animate-fade-in">
                        {cand.resumoProfissional && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-1">Resumo profissional</h4>
                            <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">
                              {cand.resumoProfissional}
                            </p>
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
                                  {exp.descricao && (
                                    <p className="text-xs text-content-secondary dark:text-content-secondary mt-1">{exp.descricao}</p>
                                  )}
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
                                  <div className="font-medium text-sm text-content dark:text-content-dark">
                                    {f.curso} · {f.instituicao}
                                  </div>
                                  <div className="text-xs text-content-muted mt-1">{f.nivel}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {cand.cursosLivres?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-content dark:text-content-dark mb-2">Cursos e certificações</h4>
                            <div className="flex flex-wrap gap-2">
                              {cand.cursosLivres.map((c: any, i: number) => (
                                <Badge key={i} variant="default">{c.nome}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gestão de status */}
                    {opcoes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
                        <label className="block text-sm font-medium text-content dark:text-content-dark mb-2">
                          Atualizar status da candidatura
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {opcoes.map(novoEstado => {
                            const cfg = statusConfig[novoEstado];
                            return (
                              <Button
                                key={novoEstado}
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({
                                  candidaturaId: cand.candidaturaId,
                                  estado: novoEstado,
                                })}
                                isLoading={updateStatusMutation.isPending}
                              >
                                {cfg?.label || novoEstado}
                              </Button>
                            );
                          })}
                        </div>
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