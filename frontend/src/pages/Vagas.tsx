import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Users } from 'lucide-react';

interface Vaga {
  id: number;
  titulo: string;
  descricao: string;
  localizacao?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  numeroVagas?: number;
  tipoContrato?: string;
  empresa?: { nome: string };
}

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await api.get('/vagas');
        setVagas(response.data);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        setError('Não foi possível carregar as vagas no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
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
        <p className="text-sm text-gray-500 mt-2">Verifique se o backend está rodando corretamente.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Vagas Disponíveis</h1>
      
      {vagas.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma vaga encontrada</h3>
          <p className="text-gray-500 mt-2">Ainda não há vagas cadastradas no sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vagas.map((vaga) => (
            <Card key={vaga.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{vaga.titulo}</CardTitle>
                {vaga.empresa && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Users size={14} /> {vaga.empresa.nome}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 line-clamp-3">{vaga.descricao}</p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {vaga.localizacao && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin size={12} /> {vaga.localizacao}
                    </Badge>
                  )}
                  {(vaga.salarioMinimo || vaga.salarioMaximo) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign size={12} />
                      {vaga.salarioMinimo?.toFixed(2)} - {vaga.salarioMaximo?.toFixed(2)}
                    </Badge>
                  )}
                  {vaga.numeroVagas && (
                    <Badge variant="secondary">
                      {vaga.numeroVagas} vaga(s)
                    </Badge>
                  )}
                  {vaga.tipoContrato && (
                    <Badge variant="default">{vaga.tipoContrato}</Badge>
                  )}
                </div>
                
                <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors">
                  Candidatar-se
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}