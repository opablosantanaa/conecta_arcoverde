import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Vaga { id: number; titulo: string; descricao: string; localizacao: string; }

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vagas')
      .then(res => { setVagas(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4">Carregando vagas...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vagas DisponÃ­veis</h1>
      {vagas.length === 0 ? <p>Nenhuma vaga encontrada.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {vagas.map(v => (
            <div key={v.id} className="border p-4 rounded shadow">
              <h2 className="font-bold text-lg">{v.titulo}</h2>
              <p className="text-gray-600">{v.localizacao}</p>
              <p>{v.descricao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}