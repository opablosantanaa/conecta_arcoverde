import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileCheck, Send, ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAreasPopulares } from '@/hooks/useAreasPopulares';

const steps = [
  {
    icon: Search,
    title: 'Busque oportunidades',
    description: 'Encontre vagas compatíveis com seu perfil usando filtros inteligentes.',
  },
  {
    icon: FileCheck,
    title: 'Cadastre seu currículo',
    description: 'Construa seu currículo de forma guiada e validado pela equipe da ACA.',
  },
  {
    icon: Send,
    title: 'Candidate-se',
    description: 'Envie candidaturas e acompanhe o status em tempo real.',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: areasPopulares, isLoading } = useAreasPopulares();

  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  const popularesAnimation = useScrollAnimation({ threshold: 0.2 });
  const messageAnimation = useScrollAnimation({ threshold: 0.3 });
  const stepsAnimation = useScrollAnimation({ threshold: 0.1 });
  const shortcutsAnimation = useScrollAnimation({ threshold: 0.1 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search ? '/vagas?titulo=' + encodeURIComponent(search) : '/vagas');
  };

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section
        ref={heroAnimation.ref}
        className={'relative overflow-hidden transition-all duration-700 ' +
          (heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-organic bg-primary-100 dark:bg-primary-900/20 opacity-60" />
          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-organic-sm bg-primary-50 dark:bg-primary-900/10 opacity-50" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-organic bg-primary-200 dark:bg-primary-800/20 animate-float" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 border border-primary-100 dark:border-primary-800">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Plataforma oficial da Prefeitura de Arcoverde
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-content dark:text-content-dark leading-tight text-balance mb-6">
              Encontre a vaga dos seus{' '}
              <span className="text-gradient-primary">sonhos</span>{' '}
              em Arcoverde
            </h1>

            <p className="text-lg text-content-secondary dark:text-content-secondary mb-10 max-w-2xl mx-auto">
              Conectamos talentos locais às melhores oportunidades de emprego. Cadastre-se, valide seu currículo e candidate-se em minutos.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-surface dark:bg-surface-dark-secondary border border-border dark:border-border-dark shadow-card">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-content-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cargo, palavra-chave ou empresa..."
                    className="w-full py-3 bg-transparent text-content dark:text-content-dark placeholder-content-muted focus:outline-none"
                    aria-label="Buscar vagas"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-xl">
                  Buscar vagas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Populares – dados dinâmicos do backend */}
            <div
              ref={popularesAnimation.ref}
              className={'flex flex-wrap items-center justify-center gap-2 text-sm transition-all duration-700 delay-200 ' +
                (popularesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
            >
              <span className="text-content-muted">Populares:</span>
              {isLoading ? (
                <span className="text-content-muted animate-pulse">Carregando...</span>
              ) : areasPopulares && areasPopulares.length > 0 ? (
                areasPopulares.map(area => (
                  <button
                    key={area.nome}
                    onClick={() => navigate('/vagas?titulo=' + encodeURIComponent(area.nome))}
                    className="px-3 py-1 rounded-full border border-border dark:border-border-dark text-content-secondary dark:text-content-secondary hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    {area.nome}
                  </button>
                ))
              ) : (
                ['Tecnologia', 'Saúde', 'Administrativo', 'Vendedor'].map(t => (
                  <button
                    key={t}
                    onClick={() => navigate('/vagas?titulo=' + encodeURIComponent(t))}
                    className="px-3 py-1 rounded-full border border-border dark:border-border-dark text-content-secondary dark:text-content-secondary hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    {t}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MENSAGEM INSTITUCIONAL */}
      <section
        ref={messageAnimation.ref}
        className={'py-12 border-y border-border dark:border-border-dark bg-surface-secondary dark:bg-surface-dark-secondary transition-all duration-700 ' +
          (messageAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm sm:text-base lg:text-lg font-semibold text-content-secondary dark:text-content-secondary max-w-3xl mx-auto leading-relaxed">
            Conectando trabalhadores ao mercado de trabalho, é a prefeitura de Arcoverde facilitando a sua vida!
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        ref={stepsAnimation.ref}
        className={'py-20 transition-all duration-700 ' +
          (stepsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-content dark:text-content-dark mb-3">Como funciona</h2>
            <p className="text-content-secondary dark:text-content-secondary max-w-2xl mx-auto">
              Em três passos simples você está pronto para se candidatar às melhores vagas da região.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="transition-all duration-500 ease-out"
                  style={{
                    transitionDelay: (i * 150) + 'ms',
                    opacity: stepsAnimation.isVisible ? 1 : 0,
                    transform: stepsAnimation.isVisible ? 'translateY(0)' : 'translateY(30px)',
                  }}
                >
                  <Card hoverable padding="lg" className="relative overflow-hidden h-full">
                    <div className="absolute top-4 right-4 text-6xl font-extrabold text-primary-50 dark:text-primary-900/30 select-none">
                      {'0' + (i + 1)}
                    </div>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-organic-sm bg-primary-500 text-white flex items-center justify-center mb-5 shadow-glow">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-content dark:text-content-dark mb-2">{step.title}</h3>
                      <p className="text-sm text-content-secondary dark:text-content-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ATALHOS */}
      <section
        ref={shortcutsAnimation.ref}
        className={'pb-20 transition-all duration-700 ' +
          (shortcutsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <div
            className="transition-all duration-500 ease-out"
            style={{
              transitionDelay: '0ms',
              opacity: shortcutsAnimation.isVisible ? 1 : 0,
              transform: shortcutsAnimation.isVisible ? 'translateX(0)' : 'translateX(-30px)',
            }}
          >
            <Card hoverable padding="lg" className="flex items-center gap-5 group cursor-pointer h-full" onClick={() => navigate('/vagas')}>
              <div className="w-16 h-16 rounded-organic bg-primary-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-content dark:text-content-dark mb-1">Explorar vagas</h3>
                <p className="text-sm text-content-secondary dark:text-content-secondary">Veja todas as oportunidades abertas em Arcoverde e região.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
            </Card>
          </div>

          <div
            className="transition-all duration-500 ease-out"
            style={{
              transitionDelay: '150ms',
              opacity: shortcutsAnimation.isVisible ? 1 : 0,
              transform: shortcutsAnimation.isVisible ? 'translateX(0)' : 'translateX(30px)',
            }}
          >
            <Card hoverable padding="lg" className="flex items-center gap-5 group cursor-pointer h-full" onClick={() => navigate('/cursos')}>
              <div className="w-16 h-16 rounded-organic-sm bg-primary-700 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-content dark:text-content-dark mb-1">Cursos gratuitos</h3>
                <p className="text-sm text-content-secondary dark:text-content-secondary">Capacite-se com os cursos oferecidos pela Prefeitura.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
            </Card>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        ref={ctaAnimation.ref}
        className={'pb-20 transition-all duration-700 ' +
          (ctaAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95')}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white p-10 lg:p-16 text-center shadow-2xl">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-organic bg-white/10" aria-hidden="true" />
            <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-organic-sm bg-white/5" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
                Pronto para dar o próximo passo na sua carreira?
              </h2>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                Junte-se a profissionais que já transformaram suas carreiras com o Conecta Arcoverde.
              </p>
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg">
                <Link to="/registro">Começar agora gratuitamente</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}