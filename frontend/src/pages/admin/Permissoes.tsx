import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Save } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const funcionalidades = [
  { chave: 'VAGAS_CADASTRAR',    label: 'Cadastrar vagas' },
  { chave: 'VAGAS_EDITAR',       label: 'Editar vagas' },
  { chave: 'VAGAS_APROVAR',      label: 'Aprovar vagas' },
  { chave: 'VAGAS_PUBLICAR',     label: 'Publicar vagas' },
  { chave: 'CURRICULOS_VALIDAR', label: 'Validar currículos' },
  { chave: 'CURRICULOS_VER',     label: 'Ver todos currículos' },
  { chave: 'CURSOS_CADASTRAR',   label: 'Cadastrar cursos' },
  { chave: 'INDICADORES_VER',    label: 'Ver indicadores' },
  { chave: 'USUARIOS_GERIR',     label: 'Gerenciar usuários' },
  { chave: 'AUDITORIA_VER',      label: 'Ver auditoria' },
];

export default function Permissoes() {
  const queryClient = useQueryClient();
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [permissoes, setPermissoes] = useState<Record<string, boolean>>({});

  const { data: usuarios } = useQuery({
    queryKey: ['admin-usuarios-permissoes'],
    queryFn: async () => (await api.get('/admin/usuarios?size=100')).data,
  });

  const { isLoading: loadingPerms } = useQuery({
    queryKey: ['admin-permissoes', usuarioSelecionado],
    queryFn: async () => {
      if (!usuarioSelecionado) return null;
      const r = await api.get(`/admin/permissoes/usuarios/${usuarioSelecionado}`);
      const mapa: Record<string, boolean> = {};
      (r.data || []).forEach((p: any) => { mapa[p.funcionalidade] = p.permitido; });
      setPermissoes(mapa);
      return r.data;
    },
    enabled: !!usuarioSelecionado,
  });

  const salvarMutation = useMutation({
    mutationFn: async () => {
      for (const [func, permitido] of Object.entries(permissoes)) {
        await api.put(`/admin/permissoes/usuarios/${usuarioSelecionado}`, {
          funcionalidade: func,
          permitido,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissoes'] });
    },
  });

  const usuariosAdmin = (usuarios?.content ?? []).filter((u: any) =>
    ['ACA', 'PREFEITURA', 'ADMIN', 'EMPRESA'].includes(u.perfil)
  );

  const toggle = (chave: string) => setPermissoes(p => ({ ...p, [chave]: !p[chave] }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Permissões</h1>
        <p className="text-content-secondary dark:text-content-secondary">Controle granular de acesso por usuário e funcionalidade.</p>
      </div>

      {/* Seleção de usuário */}
      <Card padding="md">
        <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Selecione o usuário</label>
        <select
          value={usuarioSelecionado ?? ''}
          onChange={e => setUsuarioSelecionado(e.target.value ? Number(e.target.value) : null)}
          className="w-full md:max-w-md rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
        >
          <option value="">Selecione um usuário...</option>
          {usuariosAdmin.map((u: any) => (
            <option key={u.id} value={u.id}>{u.nome} ({u.perfil})</option>
          ))}
        </select>
      </Card>

      {!usuarioSelecionado ? (
        <Card padding="lg">
          <EmptyState
            icon={<Shield className="w-8 h-8" />}
            title="Selecione um usuário"
            description="Escolha um usuário acima para visualizar e editar as permissões."
          />
        </Card>
      ) : loadingPerms ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : (
        <>
          {/* Matriz de permissões */}
          <Card padding="none">
            <div className="p-5 border-b border-border dark:border-border-dark">
              <h2 className="font-semibold text-content dark:text-content-dark">Matriz de Permissões</h2>
            </div>
            <div className="divide-y divide-border dark:divide-border-dark">
              {funcionalidades.map(f => (
                <div key={f.chave} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="font-medium text-sm text-content dark:text-content-dark">{f.label}</div>
                    <div className="text-xs text-content-muted font-mono">{f.chave}</div>
                  </div>
                  <button
                    onClick={() => toggle(f.chave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      permissoes[f.chave] ? 'bg-primary-500' : 'bg-border dark:bg-border-dark'
                    }`}
                    role="switch"
                    aria-checked={!!permissoes[f.chave]}
                    aria-label={`Permissão: ${f.label}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      permissoes[f.chave] ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={() => salvarMutation.mutate()} isLoading={salvarMutation.isPending}>
              <Save className="w-4 h-4" /> Salvar Permissões
            </Button>
          </div>
        </>
      )}
    </div>
  );
}