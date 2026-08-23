import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import './Vagas.css'; // Certifique-se que o CSS existe ou remova essa linha se não tiver

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  localizacao: string;
  tipoContrato: string;
  acessivelPcd: boolean;
}

export function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVagas() {
      try {
        const response = await api.get('/vagas');
        setVagas(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        setVagas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVagas();
  }, []);

  if (loading) return <div className="p-4 text-center">Carregando vagas...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vagas Disponíveis</h1>
      
      {vagas.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800">
          Nenhuma vaga encontrada no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg">{vaga.titulo}</h3>
              <p className="text-gray-600">{vaga.empresa}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-2">📍 {vaga.localizacao}</span>
                <span className="mr-2">💼 {vaga.tipoContrato}</span>
              </div>
              {vaga.acessivelPcd && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Acessível PCD
                </span>
              )}
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Candidatar-se
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}