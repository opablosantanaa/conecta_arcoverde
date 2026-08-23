import { LayoutGrid, Users, Shield, ScrollText, Settings } from 'lucide-react';
import { PortalLayout } from './PortalLayout';

const adminNavItems = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutGrid },
  { to: '/admin/usuarios',     label: 'Usuários',     icon: Users },
  { to: '/admin/permissoes',   label: 'Permissões',   icon: Shield },
  { to: '/admin/auditoria',    label: 'Auditoria',    icon: ScrollText },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminLayout() {
  return <PortalLayout items={adminNavItems} saudacao="Portal Administrativo" />;
}