import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileWarning, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  PENDENTE:  { label: 'Pendente',  variant: 'warning' },
  APROVADA:  { label: 'Aprovada',  variant: 'success' },
  REJEITADA: { label: 'Rejeitada', variant: 'error' },
  CANCELADA: { label: 'Cancelada', variant: 'default' },
};

export default function Solicitacoes() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['empresa-solicitacoes'],
    queryFn: async () => (await api.get('/empresa/solicitacoes?size=100')).data,
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/empresa/solicitacoes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa-solicitacoes'] });
    },
  });

  const solicitacoes = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Solicitações de alteração
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Solicitações enviadas à ACA/Prefeitura para alteração de vagas fora do período de 12h.
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
      ) : solicitacoes.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<FileWarning className="w-8 h-8" />}
            title="Nenhuma solicitação"
            description="Você ainda não enviou nenhuma solicitação de alteração. Quando uma vaga ultrapassar 12h do cadastro, use o botão 'Solicitar alteração' na página da vaga."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitacoes.map((sol: any) => {
            const st = statusConfig[sol.estado] || statusConfig.PENDENTE;
            return (
              <Card key={sol.id} padding="md">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-btn flex items-center justify-center flex-shrink-0 ${
                    sol.estado === 'PENDENTE' ? 'bg-warning/10 text-warning' :
                    sol.estado === 'APROVADA' ? 'bg-success/10 text-success' :
                    sol.estado === 'REJEITADA' ? 'bg-error/10 text-error' :
                    'bg-surface-tertiary text-content-muted'
                  }`}>
                    <FileWarning className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <h3 className="font-semibold text-content dark:text-content-dark">
                          {sol.tituloVaga}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-content-muted mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          Enviada em {new Date(sol.criadoEm).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>

                    <p className="text-sm text-content-secondary dark:text-content-secondary mb-3 whitespace-pre-line">
                      {sol.descricao}
                    </p>

                    {sol.resposta && (
                      <div className={`p-3 rounded-btn text-sm ${
                        sol.estado === 'APROVADA'
                          ? 'bg-success/5 border border-success/20 text-success'
                          : sol.estado === 'REJEITADA'
                          ? 'bg-error/5 border border-error/20 text-error'
                          : 'bg-surface-tertiary dark:bg-surface-dark-tertiary text-content-secondary'
                      }`}>
                        <strong>Resposta da ACA:</strong> {sol.resposta}
                      </div>
                    )}

                    {sol.estado === 'PENDENTE' && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelarMutation.mutate(sol.id)}
                          isLoading={cancelarMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" /> Cancelar solicitação
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
    </div>
  );
}