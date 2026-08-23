import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Users, Eye, Pencil, Lock, ChevronRight } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  RASCUNHO:              { label: 'Rascunho',              variant: 'default' },
  AGUARDANDO_APROVACAO:  { label: 'Aguardando aprovação',  variant: 'warning' },
  APROVADA:              { label: 'Aprovada',              variant: 'info' },
  PUBLICADA:             { label: 'Publicada',             variant: 'success' },
  ENCERRADA:             { label: 'Encerrada',             variant: 'default' },
  CANCELADA:             { label: 'Cancelada',             variant: 'error' },
};

export default function MinhasVagas() {
  const { data, isLoading } = useQuery({
    queryKey: ['empresa-vagas'],
    queryFn: async () => (await api.get('/empresa/vagas?size=100')).data,
  });

  const vagas = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Minhas Vagas
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Gerencie as vagas da sua empresa. Vagas podem ser editadas diretamente nas primeiras 12 horas após o cadastro.
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
      ) : vagas.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title="Nenhuma vaga cadastrada"
            description="Suas vagas aparecem aqui assim que a ACA/Prefeitura cadastrar uma para sua empresa."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {vagas.map((vaga: any) => {
            const st = statusConfig[vaga.estadoVaga] || statusConfig.RASCUNHO;
            const podeEditar = vaga.podeEditarDiretamente === true;

            return (
              <Card key={vaga.id} hoverable padding="md">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <h3 className="font-semibold text-content dark:text-content-dark text-lg leading-tight">
                        {vaga.titulo}
                      </h3>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-content-muted mb-3">
                      <span>
                        {vaga.areaNome}
                      </span>
                      <span>{vaga.cidade}, {vaga.estado}</span>
                      <span>Cadastrada em {new Date(vaga.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {/* Indicador visual da regra das 12h */}
                    {vaga.estadoVaga !== 'ENCERRADA' && vaga.estadoVaga !== 'CANCELADA' && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                        podeEditar
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {podeEditar ? (
                          <>
                            <Pencil className="w-3.5 h-3.5" />
                            Editável (dentro das 12h)
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Solicitar alteração à ACA
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/empresa/vagas/${vaga.id}`}>
                        <Eye className="w-4 h-4" /> Ver detalhes
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/empresa/vagas/${vaga.id}/candidatos`}>
                        <Users className="w-4 h-4" /> Candidatos
                      </Link>
                    </Button>
                    {podeEditar && (
                      <Button asChild size="sm">
                        <Link to={`/empresa/vagas/${vaga.id}/editar`}>
                          <Pencil className="w-4 h-4" /> Editar
                        </Link>
                      </Button>
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