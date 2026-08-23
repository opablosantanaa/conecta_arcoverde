import { LayoutGrid, Briefcase, GraduationCap } from 'lucide-react';
import { PortalLayout } from './PortalLayout';

const prefeituraNavItems = [
  { to: '/prefeitura',       label: 'Dashboard',        icon: LayoutGrid },
  { to: '/prefeitura/vagas', label: 'Gerenciar Vagas',  icon: Briefcase },
  { to: '/prefeitura/cursos', label: 'Gerenciar Cursos', icon: GraduationCap },
];

export function PrefeituraLayout() {
  return <PortalLayout items={prefeituraNavItems} saudacao="Portal Prefeitura" />;
}