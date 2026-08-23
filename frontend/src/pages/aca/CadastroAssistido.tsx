import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, CheckCircle2, Info } from 'lucide-react';
import api from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CadastroAssistido() {
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    dataNascimento: '', genero: '', endereco: '', cidade: 'Arcoverde', estado: 'PE',
    objetivo: '', resumoProfissional: '',
  });
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post('/aca/cadastro-assistido', {
      ...form,
      curriculo: {
        objetivo: form.objetivo,
        resumoProfissional: form.resumoProfissional,
        experiencias: [], formacoes: [], cursosLivres: [], areasInteresseIds: [],
      },
    }),
    onSuccess: () => { setSucesso(true); setErro(''); },
    onError: (err: any) => { setErro(err?.response?.data?.erro || 'Erro ao cadastrar.'); setSucesso(false); },
  });

  const update = (campo: string, valor: string) => setForm(f => ({ ...f, [campo]: valor }));

  if (sucesso) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card padding="lg" className="text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-content dark:text-content-dark mb-2">Cadastro realizado com sucesso!</h2>
          <p className="text-content-secondary dark:text-content-secondary mb-6">
            O candidato foi cadastrado com currículo validado. Informe as credenciais geradas ao candidato.
          </p>
          <Button onClick={() => { setSucesso(false); setForm({ nome: '', email: '', cpf: '', telefone: '', dataNascimento: '', genero: '', endereco: '', cidade: 'Arcoverde', estado: 'PE', objetivo: '', resumoProfissional: '' }); }}>
            Cadastrar outro candidato
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Cadastro Assistido</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Cadastre um candidato que não possui acesso à tecnologia. O currículo será criado já validado.
        </p>
      </div>

      <Card padding="md" className="border-l-4 border-l-info bg-info/5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-content-secondary dark:text-content-secondary">
            <strong>Importante:</strong> Após este cadastro, você (ACA/Prefeitura) NÃO poderá editar o currículo.
            Apenas o próprio candidato poderá atualizá-lo ao acessar com suas credenciais.
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Dados do candidato</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Nome completo *" value={form.nome} onChange={e => update('nome', e.target.value)} />
          </div>
          <Input label="E-mail *" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          <Input label="CPF" value={form.cpf} onChange={e => update('cpf', e.target.value)} placeholder="000.000.000-00" />
          <Input label="Telefone" value={form.telefone} onChange={e => update('telefone', e.target.value)} placeholder="(87) 99999-9999" />
          <Input label="Data de nascimento" type="date" value={form.dataNascimento} onChange={e => update('dataNascimento', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Gênero</label>
            <select value={form.genero} onChange={e => update('genero', e.target.value)}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500">
              <option value="">Prefiro não informar</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <Input label="Cidade" value={form.cidade} onChange={e => update('cidade', e.target.value)} />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Endereço</label>
          <textarea value={form.endereco} onChange={e => update('endereco', e.target.value)} rows={2}
            className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4">Currículo inicial</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Objetivo profissional</label>
            <textarea value={form.objetivo} onChange={e => update('objetivo', e.target.value)} rows={2}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-content dark:text-content-dark mb-1.5">Resumo profissional</label>
            <textarea value={form.resumoProfissional} onChange={e => update('resumoProfissional', e.target.value)} rows={4}
              className="w-full rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-secondary px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
          </div>
        </div>
      </Card>

      {erro && (
        <Card padding="md" className="border-l-4 border-l-error bg-error/5">
          <p className="text-sm text-error">{erro}</p>
        </Card>
      )}

      <Button size="lg" onClick={() => mutation.mutate()} isLoading={mutation.isPending} disabled={!form.nome || !form.email}>
        <UserPlus className="w-5 h-5" /> Cadastrar Candidato
      </Button>
    </div>
  );
}