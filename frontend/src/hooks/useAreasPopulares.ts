import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';

interface AreaPopular {
  nome: string;
  quantidade: number;
}

async function fetchAreasPopulares(): Promise<AreaPopular[]> {
  const { data } = await api.get('/public/areas-populares');
  return data;
}

export function useAreasPopulares() {
  return useQuery({
    queryKey: ['areas-populares'],
    queryFn: fetchAreasPopulares,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}