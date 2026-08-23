import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface Experiencia {
  id?: number; empresa: string; cargo: string; descricao: string;
  dataInicio: string; dataFim: string; atual: boolean;
}
interface Formacao {
  id?: number; instituicao: string; curso: string; nivel: string;
  dataInicio: string; dataFim: string; concluido: boolean;
}
interface CursoLivre {
  id?: number; nome: string; instituicao: string; cargaHoraria: number | ''; anoConclusao: number | '';
}

interface CurriculoData {
  objetivo: string;
  resumoProfissional: string;
  experiencias: Experiencia[];
  formacoes: Formacao[];
  cursosLivres: CursoLivre[];
  areasInteresseIds: number[];
}

const niveisFormacao = [
  'FUNDAMENTAL', 'MEDIO', 'TECNICO', 'SUPERIOR',
  'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO'
];

const estadoLabels: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }> = {
  RASCUNHO:            { label: 'Rascunho',            variant: 'default' },
  PENDENTE_VALIDACAO:  { label: 'Em validação',        variant: 'warning' },
  VALIDADO:            { label: 'Validado',            variant: 'success' },
  REJEITADO:           { label: 'Rejeitado',           variant: 'error' },
};

export default function Curriculo() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<CurriculoData>({
    objetivo: '',
    resumoProfissional: '',
    experiencias: [],
    formacoes: [],
    cursosLivres: [],
    areasInteresseIds: [],
  });
  const [estado, setEstado] = useState<string>('RASCUNHO');
  const [motivoRejeicao, setMotivoRejeicao] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => (await api.get('/areas')).data,
  });

  const { isLoading } = useQuery({
    queryKey: ['meu-curriculo'],
    queryFn: async () => {
      try {
        const r = await api.get('/candidato/curriculo');
        const c = r.data;
        setData({
          objetivo: c.objetivo || '',
          resumoProfissional: c.resumoProfissional || '',
          experiencias: c.experiencias || [],
          formacoes: c.formacoes || [],
          cursosLivres: c.cursosLivres || [],
          areasInteresseIds: (c.areasInteresse || []).map((a: any) => a.id),
        });
        setEstado(c.estado || 'RASCUNHO');
        setMotivoRejeicao(c.motivoRejeicao || '');
      } catch {
        // Currículo ainda não existe.
      }
      return null;
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => api.put('/candidato/curriculo', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meu-curriculo'] });
      setErrorMsg('');
      setSuccessMsg('Currículo salvo com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: (error: any) => {
      setSuccessMsg('');
      setErrorMsg(error.response?.data?.message || 'Não foi possível salvar o currículo. Revise os campos e tente novamente.');
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => api.post('/candidato/curriculo/submeter'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meu-curriculo'] });
      setErrorMsg('');
      setEstado('PENDENTE_VALIDACAO');
      setSuccessMsg('Currículo enviado para validação!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: (error: any) => {
      setSuccessMsg('');
      setErrorMsg(error.response?.data?.message || 'Não foi possível enviar o currículo para validação.');
    },
  });

  const salvarEEnviarParaValidacao = async () => {
    try {
      await saveMutation.mutateAsync();
      await submitMutation.mutateAsync();
    } catch {
      // A mensagem retornada pela API é exibida pelos handlers onError das mutações.
    }
  };

  const addExperiencia = () => setData(d => ({
    ...d, experiencias: [...d.experiencias, { empresa: '', cargo: '', descricao: '', dataInicio: '', dataFim: '', atual: false }]
  }));
  const updateExperiencia = (i: number, patch: Partial<Experiencia>) => setData(d => ({
    ...d, experiencias: d.experiencias.map((e, idx) => idx === i ? { ...e, ...patch } : e)
  }));
  const removeExperiencia = (i: number) => setData(d => ({
    ...d, experiencias: d.experiencias.filter((_, idx) => idx !== i)
  }));

  const addFormacao = () => setData(d => ({
    ...d, formacoes: [...d.formacoes, { instituicao: '', curso: '', nivel: 'SUPERIOR', dataInicio: '', dataFim: '', concluido: false }]
  }));
  const updateFormacao = (i: number, patch: Partial<Formacao>) => setData(d => ({
    ...d, formacoes: d.formacoes.map((f, idx) => idx === i ? { ...f, ...patch } : f)
  }));
  const removeFormacao = (i: number) => setData(d => ({
    ...d, formacoes: d.formacoes.filter((_, idx) => idx !== i)
  }));

  const addCursoLivre = () => setData(d => ({
    ...d, cursosLivres: [...d.cursosLivres, { nome: '', instituicao: '', cargaHoraria: '', anoConclusao: '' }]
  }));
  const updateCursoLivre = (i: number, patch: Partial<CursoLivre>) => setData(d => ({
    ...d, cursosLivres: d.cursosLivres.map((c, idx) => idx === i ? { ...c, ...patch } : c)
  }));
  const removeCursoLivre = (i: number) => setData(d => ({
    ...d, cursosLivres: d.cursosLivres.filter((_, idx) => idx !== i)
  }));

  const toggleArea = (id: number) => setData(d => ({
    ...d,
    areasInteresseIds: d.areasInteresseIds.includes(id)
      ? d.areasInteresseIds.filter(x => x !== id)
      : [...d.areasInteresseIds, id],
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const st = estadoLabels[estado] || estadoLabels.RASCUNHO;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
            Meu Currículo
          </h1>
          <p className="text-content-secondary dark:text-content-secondary">
            Mantenha seu currículo atualizado e validado para se candidatar.
          </p>
        </div>
        <Badge variant={st.variant} size="md">{st.label}</Badge>
      </div>

      {motivoRejeicao && estado === 'REJEITADO' && (
        <Card padding="md" className="border-l-4 border-l-error bg-error/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-content dark:text-content-dark mb-1">Motivo da rejeição</h3>
              <p className="text-sm text-content-secondary dark:text-content-secondary">{motivoRejeicao}</p>
            </div>
          </div>
        </Card>
      )}

      {successMsg && (
        <Card padding="md" className="border-l-4 border-l-success bg-success/5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">{successMsg}</span>
          </div>
        </Card>
      )}

      {errorMsg && (
        <Card padding="md" className="border-l-4 border-l-error bg-error/5" role="alert">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error" />
            <span className="text-sm font-medium text-error">{errorMsg}</span>
          </div>
        </Card>
      )}

      {/* Objetivo e resumo */}
      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Informações profissionais</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">
              Objetivo profissional
            </label>
            <textarea
              value={data.objetivo}
              onChange={e => setData(d => ({ ...d, objetivo: e.target.value }))}
              rows={3}
              maxLength={2000}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Ex: Atuar como analista administrativo em empresa de médio porte..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">
              Resumo profissional
            </label>
            <textarea
              value={data.resumoProfissional}
              onChange={e => setData(d => ({ ...d, resumoProfissional: e.target.value }))}
              rows={5}
              maxLength={3000}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Descreva brevemente sua trajetória, habilidades principais e diferenciais..."
            />
          </div>
        </div>
      </Card>

      {/* Experiências */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-content dark:text-content-dark">Experiência profissional</h2>
          <Button variant="outline" size="sm" onClick={addExperiencia}>
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>
        {data.experiencias.length === 0 ? (
          <p className="text-sm text-content-muted text-center py-6">
            Nenhuma experiência adicionada. Clique em "Adicionar" para começar.
          </p>
        ) : (
          <div className="space-y-4">
            {data.experiencias.map((exp, i) => (
              <div key={i} className="p-4 border border-border dark:border-border-dark rounded-card space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeExperiencia(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-btn text-content-muted hover:text-error hover:bg-error/10 transition-colors"
                  aria-label="Remover experiência"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input label="Empresa" value={exp.empresa} onChange={e => updateExperiencia(i, { empresa: e.target.value })} />
                  <Input label="Cargo" value={exp.cargo} onChange={e => updateExperiencia(i, { cargo: e.target.value })} />
                  <Input label="Data início" type="month" value={exp.dataInicio} onChange={e => updateExperiencia(i, { dataInicio: e.target.value })} />
                  <Input
                    label="Data fim"
                    type="month"
                    value={exp.dataFim}
                    onChange={e => updateExperiencia(i, { dataFim: e.target.value })}
                    disabled={exp.atual}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Descrição das atividades</label>
                  <textarea
                    value={exp.descricao}
                    onChange={e => updateExperiencia(i, { descricao: e.target.value })}
                    rows={3}
                    className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="Descreva suas principais responsabilidades e conquistas..."
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.atual}
                    onChange={e => updateExperiencia(i, { atual: e.target.checked, dataFim: e.target.checked ? '' : exp.dataFim })}
                    className="rounded border-border text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-content-secondary dark:text-content-secondary">Ainda trabalho aqui</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Formações */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-content dark:text-content-dark">Formação acadêmica</h2>
          <Button variant="outline" size="sm" onClick={addFormacao}>
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>
        {data.formacoes.length === 0 ? (
          <p className="text-sm text-content-muted text-center py-6">
            Nenhuma formação adicionada.
          </p>
        ) : (
          <div className="space-y-4">
            {data.formacoes.map((f, i) => (
              <div key={i} className="p-4 border border-border dark:border-border-dark rounded-card space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeFormacao(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-btn text-content-muted hover:text-error hover:bg-error/10"
                  aria-label="Remover formação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input label="Instituição" value={f.instituicao} onChange={e => updateFormacao(i, { instituicao: e.target.value })} />
                  <Input label="Curso" value={f.curso} onChange={e => updateFormacao(i, { curso: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Nível</label>
                    <select
                      value={f.nivel}
                      onChange={e => updateFormacao(i, { nivel: e.target.value })}
                      className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    >
                      {niveisFormacao.map(n => <option key={n} value={n}>{n.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <Input label="Data início" type="month" value={f.dataInicio} onChange={e => updateFormacao(i, { dataInicio: e.target.value })} />
                  <Input
                    label="Data fim"
                    type="month"
                    value={f.dataFim}
                    onChange={e => updateFormacao(i, { dataFim: e.target.value })}
                    disabled={f.concluido && !f.dataFim}
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={f.concluido}
                    onChange={e => updateFormacao(i, { concluido: e.target.checked })}
                    className="rounded border-border text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-content-secondary dark:text-content-secondary">Curso concluído</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Cursos livres */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-content dark:text-content-dark">Cursos e certificações</h2>
          <Button variant="outline" size="sm" onClick={addCursoLivre}>
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>
        {data.cursosLivres.length === 0 ? (
          <p className="text-sm text-content-muted text-center py-6">
            Nenhum curso adicionado.
          </p>
        ) : (
          <div className="space-y-4">
            {data.cursosLivres.map((c, i) => (
              <div key={i} className="p-4 border border-border dark:border-border-dark rounded-card space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeCursoLivre(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-btn text-content-muted hover:text-error hover:bg-error/10"
                  aria-label="Remover curso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input label="Nome do curso" value={c.nome} onChange={e => updateCursoLivre(i, { nome: e.target.value })} />
                  <Input label="Instituição" value={c.instituicao} onChange={e => updateCursoLivre(i, { instituicao: e.target.value })} />
                  <Input
                    label="Carga horária (h)"
                    type="number"
                    value={c.cargaHoraria}
                    onChange={e => updateCursoLivre(i, { cargaHoraria: e.target.value ? Number(e.target.value) : '' })}
                  />
                  <Input
                    label="Ano de conclusão"
                    type="number"
                    value={c.anoConclusao}
                    onChange={e => updateCursoLivre(i, { anoConclusao: e.target.value ? Number(e.target.value) : '' })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Áreas de interesse */}
      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Áreas de interesse</h2>
        <p className="text-sm text-content-secondary dark:text-content-secondary mb-4">
          Selecione as áreas em que você tem interesse em trabalhar. Isso nos ajuda a recomendar vagas adequadas ao seu perfil.
        </p>
        <div className="flex flex-wrap gap-2">
          {(areas || []).map((a: any) => {
            const selected = data.areasInteresseIds.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleArea(a.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                  selected
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-surface dark:bg-surface-dark-secondary text-content-secondary border-border dark:border-border-dark hover:border-primary-500 hover:text-primary-500'
                )}
              >
                {a.nome}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Ações */}
      <Card padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-content-muted">
            {estado === 'VALIDADO' && 'Seu currículo está validado. Edições voltarão ao estado de rascunho.'}
            {estado === 'PENDENTE_VALIDACAO' && 'Seu currículo está em análise. Você pode continuar editando.'}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => saveMutation.mutate()}
              isLoading={saveMutation.isPending}
              disabled={submitMutation.isPending}
            >
              <Save className="w-4 h-4" /> Salvar rascunho
            </Button>
            <Button
              onClick={salvarEEnviarParaValidacao}
              isLoading={submitMutation.isPending || saveMutation.isPending}
              disabled={estado === 'VALIDADO' || estado === 'PENDENTE_VALIDACAO'}
            >
              <Send className="w-4 h-4" /> Enviar para validação
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
