import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const portalRoutes: Record<string, string> = {
  CANDIDATO:  '/candidato',
  EMPRESA:    '/empresa',
  ACA:        '/aca',
  PREFEITURA: '/prefeitura',
  ADMIN:      '/admin',
};

export function SmartRedirect() {
  const user = useAuthStore(s => s.user);
  const perfil = user?.perfil || 'CANDIDATO';
  const destino = portalRoutes[perfil] || '/candidato';

  return <Navigate to={destino} replace />;
}

export function getPortalRoute(perfil: string): string {
  return portalRoutes[perfil] || '/candidato';
}