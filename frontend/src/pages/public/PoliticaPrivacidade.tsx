import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PoliticaPrivacidade() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" /> Voltar para a Home
          </Link>
        </Button>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-content dark:text-content-dark">
            Política de Privacidade
          </h1>
        </div>
        <p className="text-sm text-content-muted mb-8">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="space-y-8 text-content-secondary dark:text-content-secondary leading-relaxed">
          <section className="p-4 rounded-card bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800">
            <p className="text-sm">
              Esta Política de Privacidade descreve como a <strong>Prefeitura Municipal de Arcoverde-PE</strong>{' '}
              coleta, usa, compartilha e protege os dados pessoais dos usuários da plataforma{' '}
              <strong>Conecta Arcoverde</strong>, em conformidade com a{' '}
              <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">1. Controlador dos Dados</h2>
            <p>
              <strong>Prefeitura Municipal de Arcoverde-PE</strong><br />
              CNPJ: [Inserir CNPJ]<br />
              Endereço: [Inserir endereço da Prefeitura]<br />
              E-mail do Encarregado de Dados (DPO): privacidade@arcoverde.pe.gov.br
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">2. Dados Coletados</h2>
            <h3 className="font-semibold text-content dark:text-content-dark mt-4 mb-2">2.1 Dados fornecidos pelo usuário:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Candidatos:</strong> nome, e-mail, CPF, telefone, data de nascimento, gênero, endereço, cidade, estado, informações curriculares (experiências, formação, cursos).</li>
              <li><strong>Empresas:</strong> razão social, nome fantasia, CNPJ, e-mail de contato, telefone, endereço.</li>
              <li><strong>Usuários administrativos:</strong> nome, e-mail, telefone, perfil de acesso.</li>
            </ul>
            <h3 className="font-semibold text-content dark:text-content-dark mt-4 mb-2">2.2 Dados coletados automaticamente:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Endereço IP e data/hora de acesso.</li>
              <li>Logs de auditoria de ações administrativas.</li>
              <li>Preferências de navegação (tema claro/escuro).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">3. Finalidade do Tratamento</h2>
            <p>Os dados pessoais são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Conectar candidatos a oportunidades de emprego em Arcoverde.</li>
              <li>Validar currículos e garantir a qualidade das informações.</li>
              <li>Permitir que empresas visualizem candidatos de suas próprias vagas.</li>
              <li>Gerenciar cursos de capacitação oferecidos pela Prefeitura.</li>
              <li>Gerar indicadores de empregabilidade para políticas públicas.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
              <li>Garantir a segurança da plataforma através de logs de auditoria.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">4. Base Legal para o Tratamento</h2>
            <p>
              O tratamento de dados é realizado com fundamento nas seguintes bases legais da LGPD (Art. 7º):
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Consentimento (Art. 7º, I):</strong> coletado no momento do cadastro.</li>
              <li><strong>Execução de políticas públicas (Art. 7º, III):</strong> programas de empregabilidade municipal.</li>
              <li><strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> quando aplicável.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">5. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados com:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Empresas cadastradas na plataforma:</strong> apenas quando você se candidata a uma vaga.
                A empresa terá acesso somente ao seu currículo e dados de contato, nunca a currículos de outros candidatos.
              </li>
              <li>
                <strong>Equipe da ACA e Prefeitura:</strong> para validação de currículos, moderação de vagas e suporte.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Nunca vendemos ou alugamos seus dados pessoais.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">6. Seus Direitos (Art. 18 da LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Confirmação</strong> da existência de tratamento de dados.</li>
              <li><strong>Acesso</strong> aos seus dados pessoais.</li>
              <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização, bloqueio ou eliminação</strong> de dados desnecessários.</li>
              <li><strong>Portabilidade</strong> dos dados a outro fornecedor.</li>
              <li><strong>Eliminação</strong> dos dados tratados com consentimento.</li>
              <li><strong>Informação</strong> sobre compartilhamento de dados.</li>
              <li><strong>Revogação do consentimento</strong> a qualquer momento.</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, envie e-mail para{' '}
              <strong>privacidade@arcoverde.pe.gov.br</strong> com o assunto "Solicitação LGPD".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">7. Segurança dos Dados</h2>
            <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Senhas armazenadas com hash BCrypt (nunca em texto puro).</li>
              <li>Comunicação criptografada via HTTPS.</li>
              <li>Controle de acesso por perfil (RBAC) e princípio do menor privilégio.</li>
              <li>Logs de auditoria para rastreamento de ações administrativas.</li>
              <li>Isolamento de dados entre empresas (uma empresa nunca acessa dados de outra).</li>
              <li>Currículos nunca são expostos publicamente.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">8. Retenção de Dados</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contas ativas:</strong> dados mantidos enquanto a conta estiver ativa.</li>
              <li><strong>Contas excluídas:</strong> dados pessoais são eliminados em até 30 dias após a solicitação, exceto dados que devem ser mantidos por obrigação legal.</li>
              <li><strong>Logs de auditoria:</strong> mantidos por 5 anos conforme legislação aplicável.</li>
              <li><strong>Dados estatísticos:</strong> mantidos de forma anonimizada para indicadores de políticas públicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">9. Cookies</h2>
            <p>
              Utilizamos apenas cookies essenciais para o funcionamento da plataforma (autenticação e preferências).
              Não utilizamos cookies de rastreamento ou publicidade de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">10. Transferência Internacional</h2>
            <p>
              Seus dados são armazenados em servidores localizados no Brasil. Não realizamos transferência
              internacional de dados pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">11. Alterações nesta Política</h2>
            <p>
              Esta Política poderá ser atualizada para refletir mudanças legais ou operacionais. Alterações
              relevantes serão comunicadas através da plataforma com antecedência mínima de 15 dias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">12. Contato e Encarregado de Dados</h2>
            <p>
              Para questões sobre privacidade e proteção de dados, entre em contato com o Encarregado de Dados (DPO):
            </p>
            <div className="mt-3 p-4 rounded-card bg-surface-tertiary dark:bg-surface-dark-tertiary">
              <p><strong>E-mail:</strong> privacidade@arcoverde.pe.gov.br</p>
              <p><strong>Endereço:</strong> Prefeitura Municipal de Arcoverde-PE</p>
              <p><strong>Horário de atendimento:</strong> Segunda a sexta, das 8h às 17h</p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark">
          <p className="text-sm text-content-muted">
            Prefeitura Municipal de Arcoverde-PE · Conecta Arcoverde · Em conformidade com a LGPD
          </p>
        </div>
      </Card>
    </div>
  );
}