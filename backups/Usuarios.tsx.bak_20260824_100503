import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Search, Shield, ShieldOff, KeyRound, UserX, UserCheck } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

const perfilConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  CANDIDATO:  { label: 'Candidato',  variant: 'info' },
  EMPRESA:    { label: 'Empresa',    variant: 'primary' },
  ACA:        { label: 'ACA',        variant: 'warning' },
  PREFEITURA: { label: 'Prefeitura', variant: 'success' },
  ADMIN:      { label: 'Admin',      variant: 'error' },
};

const emptyForm = {
  nome: '', email: '', senha: '', cpf: '', telefone: '', perfil: 'ACA', ativo: true,
};

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState('');
  const [pagina, setPagina] = useState(0);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [modalReset, setModalReset] = useState<number | null>(null);
  const [novaSenha, setNovaSenha] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-usuarios', pagina, busca, filtroPerfil],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(pagina));
      params.set('size', '20');
      return (await api.get(`/admin/usuarios?${params}`)).data;
    },
  });

  const salvarMutation = useMutation({
    mutationFn: () => {
      const payload = { ...form, ativo: form.ativo };
      if (!payload.senha) delete (payload as any).senha;
      if (usuarioEditando) return api.put(`/admin/usuarios/${usuarioEditando.id}`, payload);
      return api.post('/admin/usuarios', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      fecharModal();
    },
  });

  const desativarMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/usuarios/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] }),
  });

  const abrirNovo = () => {
    setUsuarioEditando(null);
    setForm(emptyForm);
    setModalUsuario(true);
  };

  const abrirEdicao = (u: any) => {
    setUsuarioEditando(u);
    setForm({ nome: u.nome, email: u.email, senha: '', cpf: u.cpf || '', telefone: u.telefone || '', perfil: u.perfil, ativo: u.ativo });
    setModalUsuario(true);
  };

  const fecharModal = () => {
    setModalUsuario(false);
    setUsuarioEditando(null);
    setForm(emptyForm);
  };

  const usuarios = (data?.content ?? []).filter((u: any) => {
    const matchBusca = !busca || u.nome?.toLowerCase().includes(busca.toLowerCase()) || u.email?.toLowerCase().includes(busca.toLowerCase());
    const matchPerfil = !filtroPerfil || u.perfil === filtroPerfil;
    return matchBusca && matchPerfil;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Usuários</h1>
          <p className="text-content-secondary dark:text-content-secondary">Gerencie contas administrativas e operacionais.</p>
        </div>
        <Button onClick={abrirNovo}><Plus className="w-4 h-4" /> Novo Usuário</Button>
      </div>

      {/* Filtros */}
      <Card padding="md">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <select
            value={filtroPerfil}
            onChange={e => setFiltroPerfil(e.target.value)}
            className="rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os perfis</option>
            {Object.entries(perfilConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex items-center text-sm text-content-muted">
            {data?.totalElements ?? 0} usuários encontrados
          </div>
        </div>
      </Card>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : usuarios.length === 0 ? (
        <Card padding="lg">
          <EmptyState title="Nenhum usuário encontrado" description="Ajuste os filtros ou cadastre um novo usuário." />
        </Card>
      ) : (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark text-left">
                <th className="px-4 py-3 font-medium text-content-muted">Usuário</th>
                <th className="px-4 py-3 font-medium text-content-muted">Perfil</th>
                <th className="px-4 py-3 font-medium text-content-muted">Status</th>
                <th className="px-4 py-3 font-medium text-content-muted">Cadastro</th>
                <th className="px-4 py-3 font-medium text-content-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {usuarios.map((u: any) => {
                const cfg = perfilConfig[u.perfil] || perfilConfig.CANDIDATO;
                return (
                  <tr key={u.id} className="hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {u.nome?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-content dark:text-content-dark">{u.nome}</div>
                          <div className="text-xs text-content-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={cfg.variant}>{cfg.label}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge variant={u.ativo ? 'success' : 'default'}>{u.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-content-muted">
                      {u.criadoEm ? new Date(u.criadoEm).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => abrirEdicao(u)} className="p-2 rounded-btn text-content-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setModalReset(u.id)} className="p-2 rounded-btn text-content-muted hover:text-warning hover:bg-warning/10 transition-colors" title="Resetar senha">
                          <KeyRound className="w-4 h-4" />
                        </button>
                        {u.ativo ? (
                          <button onClick={() => desativarMutation.mutate(u.id)} className="p-2 rounded-btn text-content-muted hover:text-error hover:bg-error/10 transition-colors" title="Desativar">
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-2 rounded-btn text-content-muted hover:text-success hover:bg-success/10 transition-colors" title="Reativar">
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={pagina === 0} onClick={() => setPagina(p => p - 1)}>Anterior</Button>
          <span className="text-sm text-content-muted px-2">Página {pagina + 1} de {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={pagina >= data.totalPages - 1} onClick={() => setPagina(p => p + 1)}>Próxima</Button>
        </div>
      )}

      {/* Modal criar/editar usuário */}
      {modalUsuario && (
        <Modal title={usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'} onClose={fecharModal}>
          <div className="space-y-4">
            <Input label="Nome completo *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            <Input label="E-mail *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {!usuarioEditando && (
              <Input label="Senha *" type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} hint="Mínimo 8 caracteres" />
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="CPF" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
              <Input label="Telefone" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(87) 99999-9999" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Perfil *</label>
                <select value={form.perfil} onChange={e => setForm(f => ({ ...f, perfil: e.target.value }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  {Object.entries(perfilConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Status</label>
                <select value={form.ativo ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, ativo: e.target.value === 'true' }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => salvarMutation.mutate()} isLoading={salvarMutation.isPending} disabled={!form.nome || !form.email || (!usuarioEditando && !form.senha)}>
                {usuarioEditando ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
              <Button variant="outline" onClick={fecharModal}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal reset de senha */}
      {modalReset && (
        <Modal title="Resetar Senha" onClose={() => setModalReset(null)}>
          <div className="space-y-4">
            <p className="text-sm text-content-secondary dark:text-content-secondary">Defina uma nova senha para este usuário.</p>
            <Input label="Nova senha *" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} hint="Mínimo 8 caracteres" />
            <div className="flex gap-2">
              <Button onClick={() => { setModalReset(null); setNovaSenha(''); }} disabled={novaSenha.length < 8}>Confirmar Reset</Button>
              <Button variant="outline" onClick={() => setModalReset(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}