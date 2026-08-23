import { LayoutGrid, Briefcase, FileCheck, Users, UserPlus, FileWarning } from 'lucide-react';
import { PortalLayout } from './PortalLayout';

const acaNavItems = [
  { to: '/aca',                    label: 'Dashboard',             icon: LayoutGrid },
  { to: '/aca/vagas',              label: 'Gerenciar Vagas',       icon: Briefcase },
  { to: '/aca/curriculos',         label: 'Validar Currículos',    icon: FileCheck },
  { to: '/aca/candidaturas',       label: 'Candidaturas',          icon: Users },
  { to: '/aca/cadastro-assistido', label: 'Cadastro Assistido',    icon: UserPlus },
  { to: '/aca/solicitacoes',       label: 'Solicitações',          icon: FileWarning },
];

export function AcaLayout() {
  return <PortalLayout items={acaNavItems} saudacao="Portal ACA" />;
}