import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning';
}

export function useNotificacoes() {
  const user = useAuthStore(s => s.user);
  const perfil = user?.perfil;
  const isCandidato = perfil === 'CANDIDATO';
  const isEmpresa = perfil === 'EMPRESA';

  // ===== CANDIDATO =====
  const { data: curriculo } = useQuery({
    queryKey: ['notif-curriculo'],
    queryFn: async () => (await api.get('/candidato/curriculo')).data,
    enabled: isCandidato,
    retry: false,
  });

  const { data: vagasData } = useQuery({
    queryKey: ['notif-vagas'],
    queryFn: async () => (await api.get('/vagas/public?size=50')).data,
    enabled: isCandidato,
    retry: false,
  });

  // ===== EMPRESA =====
  const { data: candidaturasEmpresa } = useQuery({
    queryKey: ['notif-empresa-candidaturas'],
    queryFn: async () => {
      const vagasRes = await api.get('/empresa/vagas?size=100');
      const vagas = vagasRes.data?.content ?? [];

      const todas = await Promise.all(
        vagas.map(async (vaga: any) => {
          try {
            const candRes = await api.get(`/empresa/vagas/${vaga.id}/candidaturas?size=100`);
            const cands = candRes.data?.content ?? [];
            return cands.map((c: any) => ({ ...c, tituloVaga: vaga.titulo, vagaId: vaga.id }));
          } catch {
            return [];
          }
        })
      );
      return todas.flat();
    },
    enabled: isEmpresa,
    retry: false,
  });

  const notificacoes: Notificacao[] = [];

  // Notificações do CANDIDATO
  if (isCandidato && curriculo) {
    if (curriculo.estado === 'VALIDADO') {
      const visto = localStorage.getItem('notif_curriculo_validado');
      if (!visto) {
        notificacoes.push({
          id: 'curriculo_validado',
          titulo: 'Currículo registrado',
          mensagem: 'Seu currículo foi validado pela ACA. Você já pode se candidatar a vagas.',
          tipo: 'success',
        });
      }
    }

    const areasInteresse = curriculo.areasInteresse || [];
    const nomesAreas = areasInteresse.map((a: any) => a.nome);
    const agora = new Date();
    const limite48h = new Date(agora.getTime() - 48 * 60 * 60 * 1000);

    const vagasRecentes = (vagasData?.content || []).filter((v: any) => {
      const dataCriacao = new Date(v.criadoEm);
      return nomesAreas.includes(v.area) && dataCriacao >= limite48h;
    });

    vagasRecentes.forEach((v: any) => {
      const key = `notif_vaga_${v.id}`;
      if (!localStorage.getItem(key)) {
        notificacoes.push({
          id: `vaga_${v.id}`,
          titulo: 'Nova vaga na sua área de interesse',
          mensagem: `${v.titulo} em ${v.cidade}`,
          tipo: 'info',
        });
      }
    });
  }

  // Notificações da EMPRESA
  if (isEmpresa && candidaturasEmpresa) {
    const agora = new Date();
    const limite48h = new Date(agora.getTime() - 48 * 60 * 60 * 1000);

    const candidaturasRecentes = candidaturasEmpresa.filter((c: any) => {
      const dataCand = new Date(c.dataCandidatura);
      return dataCand >= limite48h;
    });

    candidaturasRecentes.forEach((c: any) => {
      const key = `notif_candidatura_${c.candidaturaId}`;
      if (!localStorage.getItem(key)) {
        notificacoes.push({
          id: `candidatura_${c.candidaturaId}`,
          titulo: 'Nova candidatura recebida',
          mensagem: `${c.nomeCandidato} se candidatou à vaga "${c.tituloVaga}"`,
          tipo: 'info',
        });
      }
    });
  }

  const marcarComoLida = (id: string) => {
    if (id === 'curriculo_validado') {
      localStorage.setItem('notif_curriculo_validado', 'true');
    } else {
      localStorage.setItem(`notif_${id}`, 'true');
    }
  };

  return { notificacoes, totalNaoLidas: notificacoes.length, marcarComoLida };
}