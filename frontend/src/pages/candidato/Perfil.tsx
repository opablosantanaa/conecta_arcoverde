import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function Perfil() {
  const user = useAuthStore(s => s.user);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">Meu Perfil</h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Visualize e atualize suas informações pessoais.
        </p>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold">
            {user?.nome?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark">{user?.nome}</h2>
            <p className="text-sm text-content-muted">{user?.perfil}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            value={user?.nome || ''}
            leftIcon={<User className="w-4 h-4" />}
            disabled
          />
          <Input
            label="E-mail"
            value={user?.email || ''}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled
          />
          <Input
            label="Telefone"
            value={user?.telefone || 'Não informado'}
            leftIcon={<Phone className="w-4 h-4" />}
            disabled
          />
          <Input
            label="Cidade"
            value={user?.cidade || 'Não informada'}
            leftIcon={<MapPin className="w-4 h-4" />}
            disabled
          />
        </div>

        <div className="mt-6 p-4 rounded-btn bg-surface-tertiary dark:bg-surface-dark-tertiary text-sm text-content-secondary dark:text-content-secondary">
          <strong>Nota:</strong> Para atualizar seus dados pessoais, entre em contato com a ACA pelo e-mail{' '}
          <a href="mailto:aca@conecta.arcoverde" className="text-primary-500 hover:underline">aca@conecta.arcoverde</a>
          .
        </div>
      </Card>
    </div>
  );
}