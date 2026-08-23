import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FileWarning, Send } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SolicitarAlteracao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  const { data: vaga, isLoading } = useQuery({
    queryKey: ['empresa-vaga', id],
    queryFn: async () => (await api.get(`/empresa/vagas/${id}`)).data,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: () => api.post(`/empresa/vagas/${id}/solicitar-alteracao`, { descricao }),
    onSuccess: () => navigate('/empresa/solicitacoes'),
    onError: (err: any) => {
      setErro(err?.response?.data?.erro || 'Não foi possível enviar a solicitação.');
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-content-muted mb-1">
          <Link to="/empresa/vagas" className="hover:text-primary-500">Minhas Vagas</Link>
          <span>/</span>
          <span className="text-content dark:text-content-dark">{vaga?.titulo}</span>
          <span>/</span>
          <span className="text-content dark:text-content-dark">Solicitar alteração</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Solicitar alteração de vaga
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Esta vaga ultrapassou o período de 12h de edição direta. Descreva abaixo as alterações desejadas e a equipe da ACA/Prefeitura avaliará sua solicitação.
        </p>
      </div>

      <Card padding="lg">
        <div className="flex items-start gap-3 p-4 rounded-btn bg-warning/5 border border-warning/20 mb-6">
          <FileWarning className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-content-secondary dark:text-content-secondary">
            <strong>Vaga:</strong> {vaga?.titulo}<br />
            <strong>Status atual:</strong> {vaga?.estadoVaga}
          </div>
        </div>

        <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">
          Descreva as alterações desejadas
        </label>
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          rows={6}
          maxLength={4000}
          className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          placeholder="Ex: Atualizar a faixa salarial para R$ 2.500 - R$ 3.000. Adicionar benefício de vale-alimentação. Alterar requisito de experiência de 2 para 1 ano..."
        />
        <div className="text-xs text-content-muted mt-1">
          {descricao.length}/4000 caracteres
        </div>

        {erro && (
          <div className="mt-4 p-3 rounded-btn bg-error/10 text-error text-sm border border-error/20" role="alert">
            {erro}
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={descricao.trim().length < 20}
          >
            <Send className="w-4 h-4" /> Enviar solicitação
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>

        {descricao.trim().length > 0 && descricao.trim().length < 20 && (
          <p className="text-xs text-content-muted mt-2">
            A descrição deve ter no mínimo 20 caracteres.
          </p>
        )}
      </Card>
    </div>
  );
}