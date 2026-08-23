import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Banknote, Clock, Building2, CheckCircle2, Lock } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { podeCandidatar, isPerfilAdministrativo } from '@/lib/perfis';

export default function DetalheVagaPublica() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);
  const perfil = user?.perfil;
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(false);

  const { data: vaga, isLoading } = useQuery({
    queryKey: ['vaga-publica', id],
    queryFn: async () => (await api.get(`/vagas/public/${id}`)).data,
    enabled: !!id,
  });

  const candidatarMutation = useMutation({
    mutationFn: () => api.post('/candidato/candidaturas', { vagaId: Number(id) }),
    onSuccess: () => {
      setCandidaturaEnviada(true);
      setModalConfirmar(false);
      queryClient.invalidateQueries({ queryKey: ['minhas-candidaturas'] });
    },
    onError: () => {
      setModalConfirmar(false);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-content-secondary">
        Vaga não encontrada.
      </div>
    );
  }

  const formatSalary = (v: number | null) =>
    v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : null;

  const handleCandidatarClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (podeCandidatar(perfil)) {
      setModalConfirmar(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-content-muted">
        <Link to="/vagas" className="hover:text-primary-500">Vagas</Link>
        <span>/</span>
        <span className="text-content dark:text-content-dark">{vaga.titulo}</span>
      </div>

      <Card padding="lg">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-2">
              {vaga.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-content-muted">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {vaga.empresaOculta ? 'Empresa confidencial' : vaga.nomeEmpresa}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {vaga.cidade}, {vaga.estado}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {new Date(vaga.criadoEm).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <Badge variant="primary" size="md">{vaga.tipoContrato}</Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
            <Banknote className="w-5 h-5 text-primary-500" />
            <div>
              <div className="text-xs text-content-muted">Faixa salarial</div>
              <div className="font-medium text-content dark:text-content-dark">
                {formatSalary(vaga.salarioMinimo) && formatSalary(vaga.salarioMaximo)
                  ? `${formatSalary(vaga.salarioMinimo)} - ${formatSalary(vaga.salarioMaximo)}`
                  : formatSalary(vaga.salarioMinimo) || formatSalary(vaga.salarioMaximo) || 'A combinar'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary">
            <Building2 className="w-5 h-5 text-primary-500" />
            <div>
              <div className="text-xs text-content-muted">Área</div>
              <div className="font-medium text-content dark:text-content-dark">{vaga.area}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {vaga.descricao && (
            <div>
              <h2 className="font-semibold text-content dark:text-content-dark mb-2">Descrição</h2>
              <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{vaga.descricao}</p>
            </div>
          )}
          {vaga.requisitos && (
            <div>
              <h2 className="font-semibold text-content dark:text-content-dark mb-2">Requisitos</h2>
              <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{vaga.requisitos}</p>
            </div>
          )}
          {vaga.beneficios && (
            <div>
              <h2 className="font-semibold text-content dark:text-content-dark mb-2">Benefícios</h2>
              <p className="text-sm text-content-secondary dark:text-content-secondary whitespace-pre-line">{vaga.beneficios}</p>
            </div>
          )}
        </div>

        {/* Área de candidatura */}
        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark">
          {candidaturaEnviada ? (
            <Card padding="md" className="border-l-4 border-l-success bg-success/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-success">Candidatura enviada com sucesso!</p>
                  <p className="text-sm text-content-secondary dark:text-content-secondary mt-1">
                    Acompanhe o status em{' '}
                    <Link to="/candidato/candidaturas" className="text-primary-500 hover:underline">Minhas Candidaturas</Link>.
                  </p>
                </div>
              </div>
            </Card>
          ) : !user ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button asChild size="lg">
                <Link to="/login">Entrar para se candidatar</Link>
              </Button>
              <p className="text-sm text-content-muted">Você precisa estar logado para se candidatar.</p>
            </div>
          ) : podeCandidatar(perfil) ? (
            <Button size="lg" onClick={handleCandidatarClick}>
              Candidatar-se a esta vaga
            </Button>
          ) : isPerfilAdministrativo(perfil) ? (
            <div className="flex items-center gap-3 p-4 rounded-btn bg-warning/5 border border-warning/20">
              <Lock className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-sm text-content-secondary dark:text-content-secondary">
                Perfis administrativos (ACA, Prefeitura, Admin) não podem se candidatar a vagas.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Modal de confirmação */}
      {modalConfirmar && (
        <Modal title="Confirmar Candidatura" onClose={() => setModalConfirmar(false)}>
          <div className="space-y-4">
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Deseja se candidatar à vaga <strong>{vaga.titulo}</strong>?
            </p>
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Seu currículo validado será enviado para a empresa. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => candidatarMutation.mutate()} isLoading={candidatarMutation.isPending}>
                Confirmar candidatura
              </Button>
              <Button variant="outline" onClick={() => setModalConfirmar(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}