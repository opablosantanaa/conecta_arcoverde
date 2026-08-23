import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, CheckCircle2, XCircle, Eye, Power, Ban, Building2, Filter } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

const statusConfig: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  RASCUNHO:              { label: 'Rascunho',              variant: 'default' },
  AGUARDANDO_APROVACAO:  { label: 'Aguardando aprovação',  variant: 'warning' },
  APROVADA:              { label: 'Aprovada',              variant: 'info' },
  PUBLICADA:             { label: 'Publicada',             variant: 'success' },
  ENCERRADA:             { label: 'Encerrada',             variant: 'default' },
  CANCELADA:             { label: 'Cancelada',             variant: 'error' },
};

export default function GerenciarVagas() {
  const queryClient = useQueryClient();
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modalNovaVaga, setModalNovaVaga] = useState(false);
  const [modalModerar, setModalModerar] = useState<{ id: number; aprovar: boolean } | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  // Formulário de nova vaga
  const [formVaga, setFormVaga] = useState({
    titulo: '', descricao: '', empresaId: '', areaId: '',
    requisitos: '', beneficios: '', salarioMinimo: '', salarioMaximo: '',
    tipoContrato: 'CLT', quantidadeVagas: '1', cidade: 'Arcoverde', estado: 'PE',
  });

  const { data: empresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => (await api.get('/empresas')).data,
  });

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => (await api.get('/areas')).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['aca-vagas', filtroEstado],
    queryFn: async () => {
      const url = filtroEstado ? `/aca/vagas/estado/${filtroEstado}?size=100` : '/aca/vagas?size=100';
      return (await api.get(url)).data;
    },
  });

  const criarMutation = useMutation({
    mutationFn: () => api.post('/aca/vagas', {
      ...formVaga,
      empresaId: Number(formVaga.empresaId),
      areaId: Number(formVaga.areaId),
      salarioMinimo: formVaga.salarioMinimo ? Number(formVaga.salarioMinimo) : null,
      salarioMaximo: formVaga.salarioMaximo ? Number(formVaga.salarioMaximo) : null,
      quantidadeVagas: Number(formVaga.quantidadeVagas) || 1,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aca-vagas'] });
      setModalNovaVaga(false);
      setFormVaga({ titulo: '', descricao: '', empresaId: '', areaId: '', requisitos: '', beneficios: '', salarioMinimo: '', salarioMaximo: '', tipoContrato: 'CLT', quantidadeVagas: '1', cidade: 'Arcoverde', estado: 'PE' });
    },
  });

  const moderarMutation = useMutation({
    mutationFn: () => api.post(`/aca/vagas/${modalModerar?.id}/moderar`, {
      aprovar: modalModerar?.aprovar,
      motivo: modalModerar?.aprovar ? null : motivoRejeicao,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aca-vagas'] });
      setModalModerar(null);
      setMotivoRejeicao('');
    },
  });

  const publicarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/aca/vagas/${id}/publicar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aca-vagas'] }),
  });

  const encerrarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/aca/vagas/${id}/encerrar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aca-vagas'] }),
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/aca/vagas/${id}/cancelar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aca-vagas'] }),
  });

  const vagas = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Gerenciar Vagas</h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Cadastre, modere e publique vagas de emprego.
          </p>
        </div>
        <Button onClick={() => setModalNovaVaga(true)}>
          <Plus className="w-4 h-4" /> Nova Vaga
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFiltroEstado('')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!filtroEstado ? 'bg-primary-500 text-white border-primary-500' : 'bg-surface dark:bg-surface-dark-secondary text-content-secondary border-border dark:border-border-dark hover:border-primary-500'}`}>
          Todas
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFiltroEstado(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filtroEstado === key ? 'bg-primary-500 text-white border-primary-500' : 'bg-surface dark:bg-surface-dark-secondary text-content-secondary border-border dark:border-border-dark hover:border-primary-500'}`}>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Lista de vagas */}
      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} padding="md"><Skeleton className="h-20 w-full" /></Card>)}</div>
      ) : vagas.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<Building2 className="w-8 h-8" />} title="Nenhuma vaga encontrada" description="Cadastre a primeira vaga ou ajuste os filtros." />
        </Card>
      ) : (
        <div className="space-y-4">
          {vagas.map((vaga: any) => {
            const st = statusConfig[vaga.estadoVaga] || statusConfig.RASCUNHO;
            return (
              <Card key={vaga.id} padding="md">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                      <h3 className="font-semibold text-content dark:text-content-dark text-lg">{vaga.titulo}</h3>
                      <Badge variant={st.variant} size="md">{st.label}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-content-muted">
                      <span>{vaga.nomeEmpresa}</span>
                      <span>{vaga.areaNome}</span>
                      <span>{vaga.cidade}, {vaga.estado}</span>
                      <span>{new Date(vaga.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Ações contextuais */}
                  <div className="flex flex-wrap gap-2">
                    {vaga.estadoVaga === 'AGUARDANDO_APROVACAO' && (
                      <>
                        <Button size="sm" onClick={() => setModalModerar({ id: vaga.id, aprovar: true })}>
                          <CheckCircle2 className="w-4 h-4" /> Aprovar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setModalModerar({ id: vaga.id, aprovar: false })}>
                          <XCircle className="w-4 h-4" /> Rejeitar
                        </Button>
                      </>
                    )}
                    {vaga.estadoVaga === 'APROVADA' && (
                      <Button size="sm" onClick={() => publicarMutation.mutate(vaga.id)} isLoading={publicarMutation.isPending}>
                        <Eye className="w-4 h-4" /> Publicar
                      </Button>
                    )}
                    {vaga.estadoVaga === 'PUBLICADA' && (
                      <Button size="sm" variant="outline" onClick={() => encerrarMutation.mutate(vaga.id)} isLoading={encerrarMutation.isPending}>
                        <Power className="w-4 h-4" /> Encerrar
                      </Button>
                    )}
                    {!['ENCERRADA', 'CANCELADA'].includes(vaga.estadoVaga) && (
                      <Button size="sm" variant="ghost" onClick={() => cancelarMutation.mutate(vaga.id)} isLoading={cancelarMutation.isPending}>
                        <Ban className="w-4 h-4" /> Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Nova Vaga */}
      {modalNovaVaga && (
        <Modal title="Cadastrar Nova Vaga" onClose={() => setModalNovaVaga(false)}>
          <div className="space-y-4">
            <Input label="Título da vaga *" value={formVaga.titulo} onChange={e => setFormVaga(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: Assistente Administrativo" />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Empresa *</label>
                <select value={formVaga.empresaId} onChange={e => setFormVaga(f => ({ ...f, empresaId: e.target.value }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Selecione...</option>
                  {(empresas || []).map((e: any) => <option key={e.id} value={e.id}>{e.nomeFantasia}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Área *</label>
                <select value={formVaga.areaId} onChange={e => setFormVaga(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Selecione...</option>
                  {(areas || []).map((a: any) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Descrição *</label>
              <textarea value={formVaga.descricao} onChange={e => setFormVaga(f => ({ ...f, descricao: e.target.value }))} rows={4}
                className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Salário mínimo" type="number" value={formVaga.salarioMinimo} onChange={e => setFormVaga(f => ({ ...f, salarioMinimo: e.target.value }))} />
              <Input label="Salário máximo" type="number" value={formVaga.salarioMaximo} onChange={e => setFormVaga(f => ({ ...f, salarioMaximo: e.target.value }))} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Tipo de contrato</label>
                <select value={formVaga.tipoContrato} onChange={e => setFormVaga(f => ({ ...f, tipoContrato: e.target.value }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  <option value="CLT">CLT</option>
                  <option value="TEMPORARIO">Temporário</option>
                  <option value="ESTAGIO">Estágio</option>
                  <option value="AUTONOMO">Autônomo</option>
                  <option value="OUTROS">Outros</option>
                </select>
              </div>
              <Input label="Qtd. vagas" type="number" value={formVaga.quantidadeVagas} onChange={e => setFormVaga(f => ({ ...f, quantidadeVagas: e.target.value }))} />
              <Input label="Cidade" value={formVaga.cidade} onChange={e => setFormVaga(f => ({ ...f, cidade: e.target.value }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Requisitos</label>
              <textarea value={formVaga.requisitos} onChange={e => setFormVaga(f => ({ ...f, requisitos: e.target.value }))} rows={3}
                className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Benefícios</label>
              <textarea value={formVaga.beneficios} onChange={e => setFormVaga(f => ({ ...f, beneficios: e.target.value }))} rows={2}
                className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={() => criarMutation.mutate()} isLoading={criarMutation.isPending}
                disabled={!formVaga.titulo || !formVaga.empresaId || !formVaga.areaId || !formVaga.descricao}>
                Cadastrar Vaga
              </Button>
              <Button variant="outline" onClick={() => setModalNovaVaga(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Moderação (rejeição com motivo) */}
      {modalModerar && !modalModerar.aprovar && (
        <Modal title="Rejeitar Vaga" onClose={() => setModalModerar(null)}>
          <div className="space-y-4">
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Informe o motivo da rejeição. A empresa será notificada.
            </p>
            <textarea value={motivoRejeicao} onChange={e => setMotivoRejeicao(e.target.value)} rows={4}
              placeholder="Motivo da rejeição..."
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            <div className="flex gap-2">
              <Button variant="danger" onClick={() => moderarMutation.mutate()} isLoading={moderarMutation.isPending} disabled={!motivoRejeicao.trim()}>
                Confirmar Rejeição
              </Button>
              <Button variant="outline" onClick={() => setModalModerar(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Moderação (aprovação) */}
      {modalModerar && modalModerar.aprovar && (
        <Modal title="Aprovar Vaga" onClose={() => setModalModerar(null)}>
          <div className="space-y-4">
            <p className="text-sm text-content-secondary dark:text-content-secondary">
              Confirma a aprovação desta vaga? Após aprovada, ela poderá ser publicada.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => moderarMutation.mutate()} isLoading={moderarMutation.isPending}>
                <CheckCircle2 className="w-4 h-4" /> Confirmar Aprovação
              </Button>
              <Button variant="outline" onClick={() => setModalModerar(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}