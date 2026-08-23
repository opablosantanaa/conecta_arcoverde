import { useState } from 'react';
import { Settings, Save, Shield, Bell, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Configuracoes() {
  const [form, setForm] = useState({
    nomePlataforma: 'Conecta Arcoverde',
    emailSuporte: 'suporte@conecta.arcoverde',
    expiracaoToken: '24',
    politicaSenha: '8 caracteres, 1 maiúscula, 1 número',
  });

  const update = (campo: string, valor: string) => setForm(f => ({ ...f, [campo]: valor }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Configurações</h1>
        <p className="text-content-secondary dark:text-content-secondary">Configurações gerais do sistema.</p>
      </div>

      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-500" /> Geral
        </h2>
        <div className="space-y-4">
          <Input label="Nome da plataforma" value={form.nomePlataforma} onChange={e => update('nomePlataforma', e.target.value)} />
          <Input label="E-mail de suporte" value={form.emailSuporte} onChange={e => update('emailSuporte', e.target.value)} />
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="font-semibold text-content dark:text-content-dark mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" /> Segurança
        </h2>
        <div className="space-y-4">
          <Input label="Expiração do token (horas)" value={form.expiracaoToken} onChange={e => update('expiracaoToken', e.target.value)} />
          <Input label="Política de senha" value={form.politicaSenha} onChange={e => update('politicaSenha', e.target.value)} />
        </div>
      </Card>

      <Button size="lg">
        <Save className="w-4 h-4" /> Salvar Configurações
      </Button>
    </div>
  );
}