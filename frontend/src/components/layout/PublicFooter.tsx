import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter } from 'lucide-react';

const navLinks = [
  { label: 'Home',   to: '/' },
  { label: 'Vagas',  to: '/vagas' },
  { label: 'Cursos', to: '/cursos' },
];

const institucionais = [
  { label: 'Sobre',               to: '/sobre' },
  { label: 'Contato',             to: '/contato' },
  { label: 'Termos de Uso', to: '/termos' },
  { label: 'PolÃ­tica de Privacidade', to: '/privacidade' },
];

export function PublicFooter() {
  return (
    <footer className="bg-surface-dark dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-btn bg-primary-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                Conecta<span className="text-primary-500">Arcoverde</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma oficial de empregabilidade da Prefeitura Municipal de Arcoverde-PE.
              Conectando pessoas a oportunidades.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-300">NavegaÃ§Ã£o</h4>
            <ul className="space-y-2">
              {navLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-primary-500 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-300">Institucional</h4>
            <ul className="space-y-2">
              {institucionais.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-primary-500 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-300">Redes Sociais</h4>
            <div className="flex gap-3">
              {[
                { icon: Github,   href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter,  href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-btn bg-surface-dark-tertiary hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  aria-label="Rede social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          Â© {new Date().getFullYear()} Prefeitura Municipal de Arcoverde. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}