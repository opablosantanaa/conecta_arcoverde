export const PERFIS_ADMINISTRATIVOS = ['ACA', 'ADMIN', 'PREFEITURA'];

export function isPerfilAdministrativo(perfil?: string): boolean {
  return !!perfil && PERFIS_ADMINISTRATIVOS.includes(perfil);
}

export function podeCandidatar(perfil?: string): boolean {
  return perfil === 'CANDIDATO';
}

export function podeCriarCurriculo(perfil?: string): boolean {
  return perfil === 'CANDIDATO';
}