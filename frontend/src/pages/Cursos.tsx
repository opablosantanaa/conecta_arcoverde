import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Curso {
  id: number;
  titulo: string;
  instituicao: string;
  cargaHoraria: string;
  modalidade: string;
  gratuito: boolean;
}

export function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const response = await api.get('/cursos');
        setCursos(response.data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCursos();
  }, []);

  if (loading) return <div className="p-4 text-center">Carregando cursos...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cursos Disponíveis</h1>
      
      {cursos.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800">
          Nenhum curso encontrado no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cursos.map((curso) => (
            <div key={curso.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg">{curso.titulo}</h3>
              <p className="text-gray-600">{curso.instituicao}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-2">⏱️ {curso.cargaHoraria}</span>
                <span className="mr-2">🎓 {curso.modalidade}</span>
              </div>
              {curso.gratuito && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Gratuito
                </span>
              )}
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Inscrever-se
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}