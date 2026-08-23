import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Curso { id: number; titulo: string; descricao: string; cargaHoraria: number; }

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cursos')
      .then(res => { setCursos(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4">Carregando cursos...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cursos Disponíveis</h1>
      {cursos.length === 0 ? <p>Nenhum curso encontrado.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {cursos.map(c => (
            <div key={c.id} className="border p-4 rounded shadow">
              <h2 className="font-bold text-lg">{c.titulo}</h2>
              <p className="text-gray-600">{c.cargaHoraria} horas</p>
              <p>{c.descricao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}