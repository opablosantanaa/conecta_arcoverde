import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText, Search, Eye, Download } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

const acaoVariant = (acao: string): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' => {
  if (acao.includes('CRIAR') ||acao.includes('CADASTRAR')) return 'success';
  if (acao.includes('ATUALIZAR') || acao.includes('EDITAR')) return 'info';
  if (acao.includes('REMOVER') || acao.includes('EXCLUIR') || acao.includes('DESATIVAR')) return 'error';
  if (acao.includes('LOGIN') || acao.includes('ACESSAR')) return 'primary';
  if (acao.includes('VALIDAR') || acao.includes('APROVAR')) return 'success';
  if (acao.includes('REJEITAR') || acao.includes('CANCELAR')) return 'warning';
  return 'default';
};

export default function Auditoria() {
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(0);
  const [logSelecionado, setLogSelecionado] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-auditoria', pagina],
    queryFn: async () => (await api.get(`/admin/auditoria?page=${pagina}&size=20`)).data,
  });

  const logs = (data?.content ?? []).filter((l: any) =>
    !busca ||
    l.acao?.toLowerCase().includes(busca.toLowerCase()) ||
    l.entidade?.toLowerCase().includes(busca.toLowerCase()) ||
    l.usuario?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const exportarCSV = () => {
    const csv = [
      ['Data', 'Usuário', 'Ação', 'Entidade', 'ID', 'IP'].join(';'),
      ...logs.map((l: any) => [
        new Date(l.criadoEm).toLocaleString('pt-BR'),
        l.usuario?.nome || '',
        l.acao,
        l.entidade,
        l.entidadeId || '',
        l.ipOrigem || '',
      ].join(';')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Auditoria</h1>
          <p className="text-content-secondary dark:text-content-secondary">Logs de todas as ações administrativas do sistema.</p>
        </div>
        <Button variant="outline" onClick={exportarCSV}>
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <Card padding="md">
        <Input
          placeholder="Buscar por ação, entidade ou usuário..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : logs.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<ScrollText className="w-8 h-8" />} title="Nenhum registro encontrado" description="As ações administrativas aparecerão aqui." />
        </Card>
      ) : (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark text-left">
                <th className="px-4 py-3 font-medium text-content-muted">Data/Hora</th>
                <th className="px-4 py-3 font-medium text-content-muted">Usuário</th>
                <th className="px-4 py-3 font-medium text-content-muted">Ação</th>
                <th className="px-4 py-3 font-medium text-content-muted">Entidade</th>
                <th className="px-4 py-3 font-medium text-content-muted">IP</th>
                <th className="px-4 py-3 font-medium text-content-muted text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-surface-tertiary/50 dark:hover:bg-surface-dark-tertiary/50 transition-colors">
                  <td className="px-4 py-3 text-content-muted whitespace-nowrap">
                    {new Date(log.criadoEm).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-content dark:text-content-dark">{log.usuario?.nome || '-'}</td>
                  <td className="px-4 py-3"><Badge variant={acaoVariant(log.acao)}>{log.acao}</Badge></td>
                  <td className="px-4 py-3 text-content-secondary">{log.entidade}</td>
                  <td className="px-4 py-3 text-content-muted font-mono text-xs">{log.ipOrigem || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setLogSelecionado(log)} className="p-2 rounded-btn text-content-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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

      {/* Modal de detalhes */}
      {logSelecionado && (
        <Modal title="Detalhes do Log" onClose={() => setLogSelecionado(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-content-muted mb-1">Data/Hora</div>
                <div className="font-medium text-content dark:text-content-dark">{new Date(logSelecionado.criadoEm).toLocaleString('pt-BR')}</div>
              </div>
              <div>
                <div className="text-xs text-content-muted mb-1">Usuário</div>
                <div className="font-medium text-content dark:text-content-dark">{logSelecionado.usuario?.nome}</div>
              </div>
              <div>
                <div className="text-xs text-content-muted mb-1">Ação</div>
                <Badge variant={acaoVariant(logSelecionado.acao)}>{logSelecionado.acao}</Badge>
              </div>
              <div>
                <div className="text-xs text-content-muted mb-1">Entidade</div>
                <div className="font-medium text-content dark:text-content-dark">{logSelecionado.entidade} #{logSelecionado.entidadeId}</div>
              </div>
              <div>
                <div className="text-xs text-content-muted mb-1">IP de origem</div>
                <div className="font-mono text-sm text-content dark:text-content-dark">{logSelecionado.ipOrigem || '-'}</div>
              </div>
            </div>
            {logSelecionado.detalhes && (
              <div>
                <div className="text-xs text-content-muted mb-1">Detalhes (JSON)</div>
                <pre className="p-3 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-xs overflow-x-auto text-content dark:text-content-dark">
                  {typeof logSelecionado.detalhes === 'string'
                    ? logSelecionado.detalhes
                    : JSON.stringify(logSelecionado.detalhes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}