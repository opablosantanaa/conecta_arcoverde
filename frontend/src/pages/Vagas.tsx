import { useEffect, useState } from 'react';
import api from '@/services/api';
import Navbar from '@/components/Navbar';

interface Vaga {
  id: number;
  titulo: string;
  empresa?: { nomeFantasia: string };
  localizacao: string;
  salarioMinimo: number;
  estado: string;
}

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vagas')
      .then(res => {
        setVagas(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar vagas:", err);
        setVagas([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Vagas Disponíveis</h1>
        
        {loading ? (
          <p className="text-center text-gray-500">Carregando vagas...</p>
        ) : vagas.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">Nenhuma vaga encontrada no momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vagas.map(vaga => (
              <div key={vaga.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-xl font-bold text-blue-800">{vaga.titulo}</h3>
                <p className="text-gray-600 mt-2">{vaga.empresa?.nomeFantasia || 'Empresa Confidencial'}</p>
                <p className="text-sm text-gray-500 mt-1">📍 {vaga.localizacao}</p>
                <p className="text-green-600 font-semibold mt-2">
                  R$ {Number(vaga.salarioMinimo).toFixed(2)}
                </p>
                <span className={inline-block mt-3 px-2 py-1 text-xs rounded }>
                  {vaga.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}