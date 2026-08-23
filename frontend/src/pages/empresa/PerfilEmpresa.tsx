import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PerfilEmpresa() {
  const user = useAuthStore(s => s.user);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Perfil da Empresa
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Visualize os dados cadastrais da sua empresa.
        </p>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-organic bg-primary-500 text-white flex items-center justify-center">
            <Building2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark">
              {user?.nome || 'Empresa'}
            </h2>
            <p className="text-sm text-content-muted">Perfil Empresarial</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input label="E-mail de contato" value={user?.email || ''} leftIcon={<Mail className="w-4 h-4" />} disabled />
          <Input label="Telefone" value={user?.telefone || 'Não informado'} leftIcon={<Phone className="w-4 h-4" />} disabled />
        </div>

        <div className="mt-6 p-4 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-sm text-content-secondary dark:text-content-secondary">
          <strong>Nota:</strong> Para atualizar os dados da sua empresa, entre em contato com a ACA pelo e-mail{' '}
          <a href="mailto:aca@conecta.arcoverde" className="text-primary-500 hover:underline">aca@conecta.arcoverde</a>.
        </div>
      </Card>
    </div>
  );
}