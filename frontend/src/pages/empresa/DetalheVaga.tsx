import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Banknote, Clock, Users, Pencil, Lock, Power, FileWarning } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  RASCUNHO:              { label: 'Rascunho',              variant: 'default' },
  AGUARDANDO_APROVACAO:  { label: 'Aguardando aprovação',  variant: 'warning' },
  APROVADA:              { label: 'Aprovada',              variant: 'info' },
  PUBLICADA:             { label: 'Publicada',             variant: 'success' },
  ENCERRADA:             { label: 'Encerrada',             variant: 'default' },
  CANCELADA:             { label: 'Cancelada',             variant: 'error' },
};

export default function DetalheVaga() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmEncerrar, setConfirmEncerrar] = useState(false);

  const { data: vaga, isLoading } = useQuery({
    queryKey: ['empresa-vaga', id],
    queryFn: async () => (await api.get(`/empresa/vagas/${id}`)).data,
    enabled: !!id,
  });

  const encerrarMutation = useMutation({
    mutationFn: () => api.post(`/empresa/vagas/${id}/encerrar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa-vaga', id] });
      queryClient.invalidateQueries({ queryKey: ['empresa-vagas'] });
      setConfirmEncerrar(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!vaga) {
    return <div>Vaga não encontrada.</div>;
  }

  const st = statusConfig[vaga.estadoVaga] || statusConfig.RASCUNHO;
  const podeEditar = vaga.podeEditarDiretamente === true;
  const formatSalary = (v: number | null) =>
    v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark">
              {vaga.titulo}
            </h1>
            <Badge variant={st.variant} size="md">{st.label}</Badge>
          </div>
          <p className="text-content-secondary dark:text-content-secondary">
            {vaga.areaNome} · {vaga.cidade}, {vaga.estado}
          </p>
        </div>
        <div className="flex gap-2">
          {podeEditar ? (
            <Button asChild>
              <Link to={`/empresa/vagas/${vaga.id}/editar`}>
                <Pencil className="w-4 h-4" /> Editar vaga
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to={`/empresa/vagas/${vaga.id}/solicitar-alteracao`}>
                <FileWarning className="w-4 h-4" /> Solicitar alteração
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Indicador 12h */}
      {vaga.estadoVaga !== 'ENCERRADA' && vaga.estadoVaga !== 'CANCELADA' && (
        <Card padding="md" className={`border-l-4 ${podeEditar ? 'border-l-success bg-success/5' : 'border-l-warning bg-warning/5'}`}>
          <div className="flex items-center gap-3">
            {podeEditar ? <Pencil className="w-5 h-5 text-success" /> : <Lock className="w-5 h-5 text-warning" />}
            <div>
              <p className="font-medium text-content dark:text-content-dark">
                {podeEditar ? 'Edição direta disponível' : 'Período de edição direta encerrado'}
              </p>
              <p className="text-sm text-content-secondary dark:text-content-secondary">
                {podeEditar
                  ? 'Você pode editar esta vaga diretamente. O período de 12h começa no momento do cadastro pela ACA/Prefeitura.'
                  : 'Para alterar esta vaga, envie uma solicitação à ACA/Prefeitura.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Detalhes */}
      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Descrição da vaga</h2>
        <p className="text-content-secondary dark:text-content-secondary whitespace-pre-line mb-6">
          {vaga.descricao}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-content-muted">Faixa salarial</div>
              <div className="font-medium text-content dark:text-content-dark">
                {formatSalary(vaga.salarioMinimo) && formatSalary(vaga.salarioMaximo)
                  ? `${formatSalary(vaga.salarioMinimo)} - ${formatSalary(vaga.salarioMaximo)}`
                  : formatSalary(vaga.salarioMinimo) || formatSalary(vaga.salarioMaximo) || 'A combinar'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-content-muted">Quantidade de vagas</div>
              <div className="font-medium text-content dark:text-content-dark">{vaga.quantidadeVagas}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-content-muted">Tipo de contrato</div>
              <div className="font-medium text-content dark:text-content-dark">{vaga.tipoContrato}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-content-muted">Localização</div>
              <div className="font-medium text-content dark:text-content-dark">{vaga.cidade}, {vaga.estado}</div>
            </div>
          </div>
        </div>

        {vaga.requisitos && (
          <div className="mb-4">
            <h3 className="font-medium text-content dark:text-content-dark mb-2">Requisitos</h3>
            <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{vaga.requisitos}</p>
          </div>
        )}

        {vaga.beneficios && (
          <div>
            <h3 className="font-medium text-content dark:text-content-dark mb-2">Benefícios</h3>
            <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{vaga.beneficios}</p>
          </div>
        )}
      </Card>

      {/* Ações */}
      {(vaga.estadoVaga === 'PUBLICADA' || vaga.estadoVaga === 'APROVADA') && (
        <Card padding="lg">
          {!confirmEncerrar ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-content dark:text-content-dark mb-1">Encerrar seleção</h3>
                <p className="text-sm text-content-secondary dark:text-content-secondary">
                  Ao encerrar, a vaga não receberá mais candidaturas. Esta ação pode ser revertida apenas pela ACA/Prefeitura.
                </p>
              </div>
              <Button variant="danger" onClick={() => setConfirmEncerrar(true)}>
                <Power className="w-4 h-4" /> Encerrar seleção
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-btn bg-error/5 border border-error/20">
              <h3 className="font-semibold text-error mb-2">Confirmar encerramento</h3>
              <p className="text-sm text-content-secondary dark:text-content-secondary mb-4">
                Tem certeza que deseja encerrar a seleção para "{vaga.titulo}"? Candidatos não poderão mais se candidatar.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => encerrarMutation.mutate()}
                  isLoading={encerrarMutation.isPending}
                >
                  Sim, encerrar seleção
                </Button>
                <Button variant="outline" onClick={() => setConfirmEncerrar(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}