import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  cargaHoraria?: number;
  dataInicio?: string;
  dataFim?: string;
  instrutor?: string;
  area?: { nome: string };
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await api.get('/cursos');
        setCursos(response.data);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        setError('Não foi possível carregar os cursos no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg mt-8">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Verifique a conexão com o backend.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Cursos Disponíveis</h1>
      
      {cursos.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
          <p className="text-gray-500 mt-2">Ainda não há cursos cadastrados no sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <Card key={curso.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-primary">{curso.titulo}</CardTitle>
                  {curso.area && (
                    <Badge variant="secondary">{curso.area.nome}</Badge>
                  )}
                </div>
                {curso.instrutor && (
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <User size={14} /> {curso.instrutor}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-gray-700 line-clamp-3">{curso.descricao}</p>
                
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {curso.cargaHoraria && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{curso.cargaHoraria} horas</span>
                    </div>
                  )}
                  {(curso.dataInicio || curso.dataFim) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {curso.dataInicio ? new Date(curso.dataInicio).toLocaleDateString('pt-BR') : 'A definir'}
                        {' - '}
                        {curso.dataFim ? new Date(curso.dataFim).toLocaleDateString('pt-BR') : 'A definir'}
                      </span>
                    </div>
                  )}
                </div>
                
                <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors">
                  Inscrever-se
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}