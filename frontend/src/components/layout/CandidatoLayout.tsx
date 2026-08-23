import { LayoutGrid, FileText, Briefcase, BookOpen, User } from 'lucide-react';
import { PortalLayout } from './PortalLayout';

const candidateNavItems = [
  { to: '/candidato',             label: 'Dashboard',           icon: LayoutGrid },
  { to: '/candidato/curriculo',   label: 'Meu Currículo',       icon: FileText },
  { to: '/candidato/candidaturas', label: 'Minhas Candidaturas', icon: Briefcase },
  { to: '/candidato/cursos',      label: 'Cursos Inscritos',    icon: BookOpen },
  { to: '/candidato/perfil',      label: 'Perfil',              icon: User },
];

export function CandidatoLayout() {
  return <PortalLayout items={candidateNavItems} saudacao="Portal do Candidato" />;
}