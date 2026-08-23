import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileCheck, Send, ArrowRight, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

const partners = [
  'Comércio Arcoverde', 'Grupo Ferreira', 'TechNordeste', 'Construtora Silva',
  'Supermercado Central', 'Clínica Vida',
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search ? `/vagas?titulo=${encodeURIComponent(search)}` : '/vagas');
  };

  return (
    <div className="animate-fade-in">
      {/* HERO com busca centralizada */}
      <section className="relative overflow-hidden">
        {/* Formas orgânicas decorativas */}
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

            {/* Barra de busca centralizada */}
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

            {/* Buscas populares */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-content-muted">Populares:</span>
              {['Vendedor', 'Administrativo', 'Tecnologia', 'Saúde'].map(t => (
                <button
                  key={t}
                  onClick={() => navigate(`/vagas?titulo=${encodeURIComponent(t)}`)}
                  className="px-3 py-1 rounded-full border border-border dark:border-border-dark text-content-secondary dark:text-content-secondary hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS de empresas parceiras */}
      <section className="py-10 border-y border-border dark:border-border-dark bg-surface-secondary dark:bg-surface-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-content-muted mb-6">
            Empresas que contratam pela plataforma
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map(p => (
              <span key={p} className="text-content-muted dark:text-content-muted font-semibold text-sm lg:text-base opacity-70 hover:opacity-100 transition-opacity">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20">
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
                <Card key={i} hoverable padding="lg" className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-extrabold text-primary-50 dark:text-primary-900/30 select-none">
                    0{i + 1}
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-organic-sm bg-primary-500 text-white flex items-center justify-center mb-5 shadow-glow">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-content dark:text-content-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-content-secondary dark:text-content-secondary leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ATALHOS rápidos */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <Card hoverable padding="lg" className="flex items-center gap-5 group cursor-pointer" onClick={() => navigate('/vagas')}>
            <div className="w-16 h-16 rounded-organic bg-primary-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-content dark:text-content-dark mb-1">Explorar vagas</h3>
              <p className="text-sm text-content-secondary dark:text-content-secondary">Veja todas as oportunidades abertas em Arcoverde e região.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
          </Card>

          <Card hoverable padding="lg" className="flex items-center gap-5 group cursor-pointer" onClick={() => navigate('/cursos')}>
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
      </section>

      {/* CTA FINAL */}
      <section className="pb-20">
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