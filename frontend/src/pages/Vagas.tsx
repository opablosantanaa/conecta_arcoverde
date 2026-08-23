import { useEffect, useState } from 'react';
import api from '../services/api';

interface Vaga {
  id: number;
  titulo: string;
  empresa: { nome: string };
  localizacao: string;
  salarioMinimo: number;
  salarioMaximo: number;
  tipoContrato: string;
}

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await api.get('/vagas');
        setVagas(response.data || []);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        setError('Não foi possível carregar as vagas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Vagas Disponíveis</h1>
      
      {vagas.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhuma vaga encontrada no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{vaga.titulo}</h2>
              <p className="text-gray-700 font-medium mb-1">{vaga.empresa?.nome || 'Empresa não informada'}</p>
              <p className="text-gray-500 text-sm mb-4 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {vaga.localizacao || 'Local não informado'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {vaga.tipoContrato || 'Indefinido'}
                </span>
                {(vaga.salarioMinimo || vaga.salarioMaximo) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    R$ {vaga.salarioMinimo?.toFixed(2)} - R$ {vaga.salarioMaximo?.toFixed(2)}
                  </span>
                )}
              </div>

              <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Candidatar-se
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}