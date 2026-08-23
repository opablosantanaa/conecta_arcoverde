import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

export default function GerenciarCursos() {
  const queryClient = useQueryClient();
  const [modalCurso, setModalCurso] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    titulo: '', descricao: '', instituicao: '', areaId: '',
    linkInscricao: '', linkPlataforma: '', cargaHoraria: '', dataInicio: '', dataFim: '',
  });

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => (await api.get('/areas')).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['prefeitura-cursos'],
    queryFn: async () => (await api.get('/prefeitura/cursos?size=100')).data,
  });

  const salvarMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        areaId: form.areaId ? Number(form.areaId) : null,
        cargaHoraria: form.cargaHoraria ? Number(form.cargaHoraria) : null,
      };
      if (cursoEditando) return api.put(`/prefeitura/cursos/${cursoEditando.id}`, payload);
      return api.post('/prefeitura/cursos', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prefeitura-cursos'] });
      setErrorMsg('');
      fecharModal();
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Não foi possível salvar o curso. Tente novamente.');
    },
  });

  const desativarMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/prefeitura/cursos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prefeitura-cursos'] });
      setErrorMsg('');
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Não foi possível desativar o curso. Tente novamente.');
    },
  });

  const abrirNovo = () => {
    setCursoEditando(null);
    setErrorMsg('');
    setForm({ titulo: '', descricao: '', instituicao: '', areaId: '', linkInscricao: '', linkPlataforma: '', cargaHoraria: '', dataInicio: '', dataFim: '' });
    setModalCurso(true);
  };

  const abrirEdicao = (curso: any) => {
    setCursoEditando(curso);
    setErrorMsg('');
    setForm({
      titulo: curso.titulo || '', descricao: curso.descricao || '', instituicao: curso.instituicao || '',
      areaId: curso.areaId ? String(curso.areaId) : '', linkInscricao: curso.linkInscricao || '',
      linkPlataforma: curso.linkPlataforma || '', cargaHoraria: curso.cargaHoraria ? String(curso.cargaHoraria) : '',
      dataInicio: curso.dataInicio || '', dataFim: curso.dataFim || '',
    });
    setModalCurso(true);
  };

  const fecharModal = () => { setModalCurso(false); setCursoEditando(null); };

  const cursos = data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Gerenciar Cursos</h1>
          <p className="text-content-secondary dark:text-content-secondary">Cadastre e gerencie cursos de capacitação.</p>
        </div>
        <Button onClick={abrirNovo}><Plus className="w-4 h-4" /> Novo Curso</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} padding="md"><Skeleton className="h-20 w-full" /></Card>)}</div>
      ) : cursos.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={<GraduationCap className="w-8 h-8" />} title="Nenhum curso cadastrado" description="Cadastre o primeiro curso de capacitação." />
        </Card>
      ) : (
        <div className="space-y-4">
          {cursos.map((curso: any) => (
            <Card key={curso.id} padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-btn bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="font-semibold text-content dark:text-content-dark">{curso.titulo}</h3>
                    <Badge variant={curso.estado === 'ATIVO' ? 'success' : 'default'}>{curso.estado}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-sm text-content-muted mt-1">
                    {curso.instituicao && <span>{curso.instituicao}</span>}
                    {curso.cargaHoraria && <span>{curso.cargaHoraria}h</span>}
                    {curso.areaNome && <span>{curso.areaNome}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => abrirEdicao(curso)}>
                    <Pencil className="w-4 h-4" /> Editar
                  </Button>
                  {curso.estado === 'ATIVO' && (
                    <Button variant="ghost" size="sm" onClick={() => desativarMutation.mutate(curso.id)} isLoading={desativarMutation.isPending}>
                      <Trash2 className="w-4 h-4" /> Desativar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modalCurso && (
        <Modal title={cursoEditando ? 'Editar Curso' : 'Novo Curso'} onClose={fecharModal}>
          <div className="space-y-4">
            {errorMsg && <p role="alert" className="text-sm text-error">{errorMsg}</p>}
            <Input label="Título do curso *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3}
                className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Instituição" value={form.instituicao} onChange={e => setForm(f => ({ ...f, instituicao: e.target.value }))} />
              <div>
                <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Área</label>
                <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Sem área</option>
                  {(areas || []).map((a: any) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Link de inscrição" value={form.linkInscricao} onChange={e => setForm(f => ({ ...f, linkInscricao: e.target.value }))} placeholder="https://..." />
              <Input label="Carga horária (h)" type="number" value={form.cargaHoraria} onChange={e => setForm(f => ({ ...f, cargaHoraria: e.target.value }))} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Data de início" type="date" value={form.dataInicio} onChange={e => setForm(f => ({ ...f, dataInicio: e.target.value }))} />
              <Input label="Data de fim" type="date" value={form.dataFim} onChange={e => setForm(f => ({ ...f, dataFim: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => salvarMutation.mutate()} isLoading={salvarMutation.isPending} disabled={!form.titulo}>
                {cursoEditando ? 'Salvar Alterações' : 'Cadastrar Curso'}
              </Button>
              <Button variant="outline" onClick={fecharModal}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
