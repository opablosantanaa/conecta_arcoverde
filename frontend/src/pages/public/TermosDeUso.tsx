import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TermosDeUso() {
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
        <h1 className="text-3xl font-bold text-content dark:text-content-dark mb-2">
          Termos de Uso
        </h1>
        <p className="text-sm text-content-muted mb-8">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="space-y-8 text-content-secondary dark:text-content-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">1. Sobre a Plataforma</h2>
            <p>
              O <strong>Conecta Arcoverde</strong> é uma plataforma de empregabilidade desenvolvida pela{' '}
              <strong>Prefeitura Municipal de Arcoverde-PE</strong>, com o objetivo de conectar candidatos a
              oportunidades de emprego no município, promover cursos de capacitação e facilitar o processo
              seletivo entre empresas e trabalhadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">2. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar esta plataforma, você concorda integralmente com estes Termos de Uso e com a
              nossa Política de Privacidade. Se não concordar com qualquer disposição, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">3. Cadastro e Conta</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>O cadastro é gratuito e destinado a pessoas físicas (candidatos) e jurídicas (empresas).</li>
              <li>Você é responsável pela veracidade das informações fornecidas no cadastro.</li>
              <li>A senha é pessoal e intransferível. Você é responsável por mantê-la em sigilo.</li>
              <li>A Prefeitura e a ACA poderão realizar o <strong>cadastro assistido</strong> para cidadãos sem acesso à tecnologia, conforme previsto na legislação municipal.</li>
              <li>Contas com informações falsas ou uso indevido poderão ser suspensas ou excluídas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">4. Uso da Plataforma</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Candidatos podem criar currículos, candidatar-se a vagas e inscrever-se em cursos.</li>
              <li>Empresas podem visualizar candidatos que se candidataram às <strong>suas próprias vagas</strong>, sendo vedado o acesso a dados de outras empresas.</li>
              <li>O cadastro de vagas é realizado exclusivamente pela ACA ou Prefeitura.</li>
              <li>A validação de currículos é feita pela equipe da ACA/Prefeitura antes da liberação para candidaturas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">5. Obrigações do Usuário</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras, completas e atualizadas.</li>
              <li>Não utilizar a plataforma para fins ilegais, discriminatórios ou fraudulentos.</li>
              <li>Não tentar acessar dados de outros usuários ou empresas sem autorização.</li>
              <li>Respeitar os direitos de propriedade intelectual da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">6. Limitação de Responsabilidade</h2>
            <p>
              A plataforma atua como intermediadora entre candidatos e empresas. A Prefeitura de Arcoverde não se
              responsabiliza por:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Decisões de contratação ou não contratação tomadas pelas empresas.</li>
              <li>Veracidade das informações fornecidas pelas empresas nas vagas.</li>
              <li>Relações trabalhistas estabelecidas entre candidatos e empresas.</li>
              <li>Indisponibilidade temporária da plataforma por manutenção ou problemas técnicos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">7. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma (textos, imagens, logotipos, código) é de propriedade da Prefeitura
              Municipal de Arcoverde ou de seus licenciadores, sendo vedada a reprodução sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">8. Modificações dos Termos</h2>
            <p>
              Estes Termos poderão ser atualizados a qualquer momento. Alterações relevantes serão comunicadas
              através da plataforma. O uso contínuo após a publicação das alterações implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">9. Encerramento de Conta</h2>
            <p>
              Você pode solicitar a exclusão da sua conta a qualquer momento através do canal de atendimento da
              Prefeitura. A exclusão seguirá os procedimentos previstos na Política de Privacidade e na LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">10. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de Arcoverde-PE
              para dirimir quaisquer controvérsias relacionadas a este documento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-content dark:text-content-dark mb-3">11. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato com a Prefeitura Municipal de Arcoverde
              através dos canais oficiais de atendimento.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark">
          <p className="text-sm text-content-muted">
            Prefeitura Municipal de Arcoverde-PE · Conecta Arcoverde
          </p>
        </div>
      </Card>
    </div>
  );
}