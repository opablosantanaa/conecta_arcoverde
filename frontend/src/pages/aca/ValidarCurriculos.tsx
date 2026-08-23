import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileCheck, CheckCircle2, XCircle, Eye, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

export default function ValidarCurriculos() {
  const queryClient = useQueryClient();
  const [curriculoSelecionado, setCurriculoSelecionado] = useState<any>(null);
  const [modalRejeitar, setModalRejeitar] = useState<number | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['aca-curriculos-pendentes'],
    queryFn: async () => (await api.get('/aca/curriculos/pendentes?size=100')).data,
  });

  const validarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/aca/curriculos/${id}/validar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aca-curriculos-pendentes'] });
      setCurriculoSelecionado(null);
    },
  });

  const rejeitarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/aca/curriculos/${id}/rejeitar`, { motivo: motivoRejeicao }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aca-curriculos-pendentes'] });
      setModalRejeitar(null);
      setMotivoRejeicao('');
      setCurriculoSelecionado(null);
    },
  });

  const curriculos = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Validar Currículos</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Analise e valide os currículos enviados pelos candidatos.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} padding="md"><Skeleton className="h-20 w-full" /></Card>)}</div>
      ) : curriculos.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<FileCheck className="w-8 h-8" />} title="Nenhum currículo pendente" description="Todos os currículos foram analisados." />
        </Card>
      ) : (
        <div className="space-y-4">
          {curriculos.map((c: any) => (
            <Card key={c.id} padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center font-semibold flex-shrink-0">
                  {c.nomeCandidato?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-content dark:text-content-dark">{c.nomeCandidato}</h3>
                  <p className="text-sm text-content-muted">
                    Enviado em {new Date(c.atualizadoEm || c.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                  {c.objetivo && <p className="text-sm text-content-secondary dark:text-content-secondary line-clamp-1 mt-1">{c.objetivo}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setCurriculoSelecionado(c)}>
                    <Eye className="w-4 h-4" /> Ver
                  </Button>
                  <Button size="sm" onClick={() => validarMutation.mutate(c.id)} isLoading={validarMutation.isPending}>
                    <CheckCircle2 className="w-4 h-4" /> Validar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setModalRejeitar(c.id)}>
                    <XCircle className="w-4 h-4" /> Rejeitar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de visualização do currículo */}
      {curriculoSelecionado && (
        <Modal title={`Currículo de ${curriculoSelecionado.nomeCandidato}`} onClose={() => setCurriculoSelecionado(null)} size="lg">
          <div className="space-y-6">
            {curriculoSelecionado.objetivo && (
              <div>
                <h3 className="font-medium text-content dark:text-content-dark mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" /> Objetivo
                </h3>
                <p className="text-sm text-content-secondary dark:text-content-secondary">{curriculoSelecionado.objetivo}</p>
              </div>
            )}
            {curriculoSelecionado.resumoProfissional && (
              <div>
                <h3 className="font-medium text-content dark:text-content-dark mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" /> Resumo Profissional
                </h3>
                <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{curriculoSelecionado.resumoProfissional}</p>
              </div>
            )}
            {curriculoSelecionado.experiencias?.length > 0 && (
              <div>
                <h3 className="font-medium text-content dark:text-content-dark mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary-500" /> Experiências
                </h3>
                <div className="space-y-2">
                  {curriculoSelecionado.experiencias.map((exp: any, i: number) => (
                    <div key={i} className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
                      <div className="font-medium text-sm">{exp.cargo} · {exp.empresa}</div>
                      {exp.descricao && <p className="text-xs text-content-muted mt-1">{exp.descricao}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {curriculoSelecionado.formacoes?.length > 0 && (
              <div>
                <h3 className="font-medium text-content dark:text-content-dark mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary-500" /> Formação
                </h3>
                <div className="space-y-2">
                  {curriculoSelecionado.formacoes.map((f: any, i: number) => (
                    <div key={i} className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
                      <div className="font-medium text-sm">{f.curso} · {f.instituicao}</div>
                      <div className="text-xs text-content-muted">{f.nivel}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {curriculoSelecionado.cursosLivres?.length > 0 && (
              <div>
                <h3 className="font-medium text-content dark:text-content-dark mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-500" /> Cursos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {curriculoSelecionado.cursosLivres.map((c: any, i: number) => (
                    <Badge key={i} variant="default">{c.nome}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
              <Button onClick={() => validarMutation.mutate(curriculoSelecionado.id)} isLoading={validarMutation.isPending}>
                <CheckCircle2 className="w-4 h-4" /> Validar Currículo
              </Button>
              <Button variant="danger" onClick={() => setModalRejeitar(curriculoSelecionado.id)}>
                <XCircle className="w-4 h-4" /> Rejeitar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de rejeição */}
      {modalRejeitar && (
        <Modal title="Rejeitar Currículo" onClose={() => setModalRejeitar(null)}>
          <div className="space-y-4">
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Informe o motivo da rejeição. O candidato será notificado e poderá corrigir e reenviar.
            </p>
            <textarea value={motivoRejeicao} onChange={e => setMotivoRejeicao(e.target.value)} rows={4}
              placeholder="Ex: Descrição das experiências muito vaga. Adicione datas e responsabilidades específicas..."
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            <div className="flex gap-2">
              <Button variant="danger" onClick={() => rejeitarMutation.mutate(modalRejeitar)} isLoading={rejeitarMutation.isPending} disabled={!motivoRejeicao.trim()}>
                Confirmar Rejeição
              </Button>
              <Button variant="outline" onClick={() => setModalRejeitar(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}