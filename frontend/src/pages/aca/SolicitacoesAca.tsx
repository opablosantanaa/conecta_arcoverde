import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileWarning, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  PENDENTE:  { label: 'Pendente',  variant: 'warning' },
  APROVADA:  { label: 'Aprovada',  variant: 'success' },
  REJEITADA: { label: 'Rejeitada', variant: 'error' },
  CANCELADA: { label: 'Cancelada', variant: 'default' },
};

export default function SolicitacoesAca() {
  const queryClient = useQueryClient();
  const [modalResponder, setModalResponder] = useState<{ id: number; aprovar: boolean } | null>(null);
  const [resposta, setResposta] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['aca-solicitacoes'],
    queryFn: async () => (await api.get('/aca/solicitacoes?size=100')).data,
  });

  const responderMutation = useMutation({
    mutationFn: () => api.post(`/aca/solicitacoes/${modalResponder?.id}/responder`, {
      aprovar: modalResponder?.aprovar,
      resposta,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aca-solicitacoes'] });
      setModalResponder(null);
      setResposta('');
    },
  });

  const solicitacoes = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Solicitações de Alteração</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Analise e responda às solicitações de alteração de vagas enviadas pelas empresas.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} padding="md"><Skeleton className="h-24 w-full" /></Card>)}</div>
      ) : solicitacoes.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<FileWarning className="w-8 h-8" />} title="Nenhuma solicitação" description="As solicitações das empresas aparecerão aqui." />
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitacoes.map((sol: any) => {
            const st = statusConfig[sol.estado] || statusConfig.PENDENTE;
            return (
              <Card key={sol.id} padding="md">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-btn flex items-center justify-center flex-shrink-0 ${sol.estado === 'PENDENTE' ? 'bg-warning/10 text-warning' : 'bg-surface-tertiary text-content-muted'}`}>
                    <FileWarning className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                      <div>
                        <h3 className="font-semibold text-content dark:text-content-dark">{sol.tituloVaga}</h3>
                        <p className="text-xs text-content-muted">
                          {sol.solicitanteNome} · {new Date(sol.criadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>
                    <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line mb-3">{sol.descricao}</p>
                    {sol.resposta && (
                      <div className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-sm text-content-secondary mb-3">
                        <strong>Sua resposta:</strong> {sol.resposta}
                      </div>
                    )}
                    {sol.estado === 'PENDENTE' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setModalResponder({ id: sol.id, aprovar: true })}>
                          <CheckCircle2 className="w-4 h-4" /> Aprovar alteração
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setModalResponder({ id: sol.id, aprovar: false })}>
                          <XCircle className="w-4 h-4" /> Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {modalResponder && (
        <Modal title={modalResponder.aprovar ? 'Aprovar Solicitação' : 'Rejeitar Solicitação'} onClose={() => setModalResponder(null)}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-content dark:text-content-dark">
              Resposta para a empresa *
            </label>
            <textarea value={resposta} onChange={e => setResposta(e.target.value)} rows={4}
              placeholder={modalResponder.aprovar ? 'Ex: Alteração aprovada. A vaga foi atualizada conforme solicitado.' : 'Ex: Não é possível alterar este campo. Entre em contato para mais detalhes.'}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            <div className="flex gap-2">
              <Button variant={modalResponder.aprovar ? 'primary' : 'danger'} onClick={() => responderMutation.mutate()} isLoading={responderMutation.isPending} disabled={!resposta.trim()}>
                Confirmar
              </Button>
              <Button variant="outline" onClick={() => setModalResponder(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}