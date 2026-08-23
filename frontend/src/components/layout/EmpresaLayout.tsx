import { LayoutGrid, Briefcase, Users, FileWarning, Building2 } from 'lucide-react';
import { PortalLayout } from './PortalLayout';

const empresaNavItems = [
  { to: '/empresa',              label: 'Dashboard',          icon: LayoutGrid },
  { to: '/empresa/vagas',        label: 'Minhas Vagas',       icon: Briefcase },
  { to: '/empresa/candidatos',   label: 'Candidatos',         icon: Users },
  { to: '/empresa/solicitacoes', label: 'Solicitações',       icon: FileWarning },
  { to: '/empresa/perfil',       label: 'Perfil da Empresa',  icon: Building2 },
];

export function EmpresaLayout() {
  return <PortalLayout items={empresaNavItems} saudacao="Portal da Empresa" />;
}