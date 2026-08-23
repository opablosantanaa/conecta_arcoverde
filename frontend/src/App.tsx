import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { CandidatoLayout } from '@/components/layout/CandidatoLayout';
import { EmpresaLayout } from '@/components/layout/EmpresaLayout';
import { AcaLayout } from '@/components/layout/AcaLayout';
import { PrefeituraLayout } from '@/components/layout/PrefeituraLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SmartRedirect } from '@/components/auth/SmartRedirect';

// PÃƒÂºblico
import Home               from '@/pages/public/Home';
import Vagas              from '@/pages/public/Vagas';
import Cursos             from '@/pages/public/Cursos';
import DetalheVagaPublica from '@/pages/public/DetalheVagaPublica';
import Login              from '@/pages/auth/Login';
import Register           from '@/pages/auth/Register';
import TermosDeUso        from '@/pages/public/TermosDeUso';
import PoliticaPrivacidade  from '@/pages/public/PoliticaPrivacidade';

// Candidato
import Dashboard       from '@/pages/candidato/Dashboard';
import Curriculo       from '@/pages/candidato/Curriculo';
import Candidaturas    from '@/pages/candidato/Candidaturas';
import CursosInscritos from '@/pages/candidato/CursosInscritos';
import Perfil          from '@/pages/candidato/Perfil';

// Empresa
import EmpresaDashboard    from '@/pages/empresa/Dashboard';
import MinhasVagas         from '@/pages/empresa/MinhasVagas';
import DetalheVaga         from '@/pages/empresa/DetalheVaga';
import CandidatosVaga      from '@/pages/empresa/CandidatosVaga';
import Solicitacoes        from '@/pages/empresa/Solicitacoes';
import SolicitarAlteracao  from '@/pages/empresa/SolicitarAlteracao';
import PerfilEmpresa       from '@/pages/empresa/PerfilEmpresa';
import Candidatos         from '@/pages/empresa/Candidatos';

// ACA
import AcaDashboard      from '@/pages/aca/Dashboard';
import GerenciarVagas    from '@/pages/aca/GerenciarVagas';
import ValidarCurriculos from '@/pages/aca/ValidarCurriculos';
import CadastroAssistido from '@/pages/aca/CadastroAssistido';
import SolicitacoesAca   from '@/pages/aca/SolicitacoesAca';

// Prefeitura
import PrefeituraDashboard from '@/pages/prefeitura/Dashboard';
import GerenciarCursos     from '@/pages/prefeitura/GerenciarCursos';

// Admin
import AdminDashboard  from '@/pages/admin/Dashboard';
import Usuarios        from '@/pages/admin/Usuarios';
import Permissoes      from '@/pages/admin/Permissoes';
import Auditoria       from '@/pages/admin/Auditoria';
import Configuracoes   from '@/pages/admin/Configuracoes';

function PublicOnly({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  return token ? <SmartRedirect /> : <>{children}</>;
}

function Protected({ children, perfis }: { children: React.ReactNode; perfis?: string[] }) {
  const token = useAuthStore(s => s.token);
  const user = useAuthStore(s => s.user);

  if (!token) return <Navigate to="/login" replace />;

  if (perfis && user?.perfil && !perfis.includes(user.perfil)) {
    return <SmartRedirect />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÃƒÂºblico */}
        <Route element={<PublicLayout />}>
          <Route path="/"          element={<Home />} />
          <Route path="/vagas"     element={<Vagas />} />
          <Route path="/vagas/:id" element={<DetalheVagaPublica />} />
          <Route path="/cursos"    element={<Cursos />} />
          <Route path="/termos"     element={<TermosDeUso />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
        </Route>

        {/* Auth */}
        <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/registro" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/dashboard" element={<SmartRedirect />} />

        {/* Portal do Candidato */}
        <Route element={<Protected perfis={['CANDIDATO']}><CandidatoLayout /></Protected>}>
          <Route path="/candidato"             element={<Dashboard />} />
          <Route path="/candidato/curriculo"    element={<Curriculo />} />
          <Route path="/candidato/candidaturas" element={<Candidaturas />} />
          <Route path="/candidato/cursos"       element={<CursosInscritos />} />
          <Route path="/candidato/perfil"       element={<Perfil />} />
        </Route>

        {/* Portal da Empresa */}
        <Route element={<Protected perfis={['EMPRESA']}><EmpresaLayout /></Protected>}>
          <Route path="/empresa"                               element={<EmpresaDashboard />} />
          <Route path="/empresa/vagas"                         element={<MinhasVagas />} />
          <Route path="/empresa/candidatos"                  element={<Candidatos />} />
          <Route path="/empresa/vagas/:id"                     element={<DetalheVaga />} />
          <Route path="/empresa/vagas/:id/candidatos"          element={<CandidatosVaga />} />
          <Route path="/empresa/vagas/:id/solicitar-alteracao" element={<SolicitarAlteracao />} />
          <Route path="/empresa/solicitacoes"                  element={<Solicitacoes />} />
          <Route path="/empresa/perfil"                        element={<PerfilEmpresa />} />
        </Route>

        {/* Portal ACA */}
        <Route element={<Protected perfis={['ACA', 'PREFEITURA', 'ADMIN']}><AcaLayout /></Protected>}>
          <Route path="/aca"                    element={<AcaDashboard />} />
          <Route path="/aca/vagas"              element={<GerenciarVagas />} />
          <Route path="/aca/curriculos"         element={<ValidarCurriculos />} />
          <Route path="/aca/candidaturas"       element={<ValidarCurriculos />} />
          <Route path="/aca/cadastro-assistido" element={<CadastroAssistido />} />
          <Route path="/aca/solicitacoes"       element={<SolicitacoesAca />} />
        </Route>

        {/* Portal Prefeitura (sem Indicadores e RelatÃƒÂ³rios) */}
        <Route element={<Protected perfis={['PREFEITURA', 'ADMIN']}><PrefeituraLayout /></Protected>}>
          <Route path="/prefeitura"        element={<PrefeituraDashboard />} />
          <Route path="/prefeitura/vagas"  element={<GerenciarVagas />} />
          <Route path="/prefeitura/cursos" element={<GerenciarCursos />} />
        </Route>

        {/* Portal Admin */}
        <Route element={<Protected perfis={['ADMIN']}><AdminLayout /></Protected>}>
          <Route path="/admin"               element={<AdminDashboard />} />
          <Route path="/admin/usuarios"      element={<Usuarios />} />
          <Route path="/admin/permissoes"    element={<Permissoes />} />
          <Route path="/admin/auditoria"     element={<Auditoria />} />
          <Route path="/admin/configuracoes" element={<Configuracoes />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;