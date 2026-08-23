export interface Vaga {
  id: number;
  titulo: string;
  descricao: string;
  nomeEmpresa: string;
  empresaOculta: boolean;
  area: string;
  requisitos: string;
  beneficios: string;
  salarioMinimo: number | null;
  salarioMaximo: number | null;
  tipoContrato: string;
  quantidadeVagas: number;
  cidade: string;
  estado: string;
  criadoEm: string;
}

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  areaId: number | null;
  areaNome: string | null;
  linkInscricao: string;
  linkPlataforma: string;
  cargaHoraria: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  estado: string;
  expirado: boolean;
  cadastradoPorId: number;
  cadastradoPorNome: string;
  criadoEm: string;
}

export interface Area {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  perfil: string;
}