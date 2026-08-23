import { useEffect, useState } from 'react';
import api from '@/services/api';
import Navbar from '@/components/Navbar';

interface Curso {
  id: number;
  titulo: string;
  instrutor: string;
  cargaHoraria: number;
  dataInicio: string;
  estado: string;
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cursos')
      .then(res => {
        setCursos(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar cursos:", err);
        setCursos([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Cursos Disponíveis</h1>
        
        {loading ? (
          <p className="text-center text-gray-500">Carregando cursos...</p>
        ) : cursos.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">Nenhum curso encontrado no momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map(curso => (
              <div key={curso.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-xl font-bold text-blue-800">{curso.titulo}</h3>
                <p className="text-gray-600 mt-2">Instrutor: {curso.instrutor}</p>
                <p className="text-sm text-gray-500 mt-1">⏱️ {curso.cargaHoraria} horas</p>
                <p className="text-sm text-gray-500">📅 Início: {new Date(curso.dataInicio).toLocaleDateString()}</p>
                <span className={inline-block mt-3 px-2 py-1 text-xs rounded }>
                  {curso.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}