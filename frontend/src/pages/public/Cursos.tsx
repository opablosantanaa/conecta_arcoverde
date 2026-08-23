import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, GraduationCap, ExternalLink, Search } from 'lucide-react';
import api from '@/api/client';
import type { Curso } from '@/types';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Cursos() {
  const [titulo, setTitulo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cursos-public', titulo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (titulo) params.set('titulo', titulo);
      params.set('size', '20');
      return (await api.get(`/cursos/public?${params}`)).data as { content: Curso[]; totalElements: number };
    },
  });

  const cursos = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content dark:text-content-dark mb-2">Cursos disponíveis</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Capacite-se com cursos gratuitos oferecidos pela Prefeitura de Arcoverde.
        </p>
      </div>

      <div className="max-w-md mb-8">
        <Input
          placeholder="Buscar curso por título..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} padding="none">
              <Skeleton className="h-32 rounded-t-card" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : cursos.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Nenhum curso encontrado"
          description={titulo ? 'Tente outra busca.' : 'Novos cursos são adicionados frequentemente.'}
        />
      ) : (
        <>
          <p className="text-sm text-content-muted mb-4">{total} {total === 1 ? 'curso' : 'cursos'}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(c => (
              <Card key={c.id} hoverable padding="none" className="overflow-hidden flex flex-col">
                <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                  <GraduationCap className="w-12 h-12 text-white" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="success" size="md" className="bg-white/90 text-success border-0">Gratuito</Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-content dark:text-content-dark leading-tight mb-2">
                    {c.titulo}
                  </h3>
                  {c.instituicao && (
                    <p className="text-sm text-content-muted mb-3">{c.instituicao}</p>
                  )}
                  {c.descricao && (
                    <p className="text-sm text-content-secondary dark:text-content-secondary line-clamp-3 mb-4 flex-1">
                      {c.descricao}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.cargaHoraria && (
                      <Badge variant="default" size="sm">
                        <Clock className="w-3 h-3 mr-1" /> {c.cargaHoraria}h
                      </Badge>
                    )}
                    {c.areaNome && (
                      <Badge variant="primary" size="sm">{c.areaNome}</Badge>
                    )}
                  </div>
                  {c.linkInscricao && (
                    <a href={c.linkInscricao} target="_blank" rel="noopener noreferrer" className="mt-auto">
                      <Button variant="outline" fullWidth size="sm">
                        Inscrever-se <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}