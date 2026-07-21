import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHomeLink = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <footer className="py-16 bg-[#F4F4F5] border-t border-gray-200 relative z-10 text-black-main">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          <div className="col-span-1">
            <Link to="/" className="inline-block text-4xl font-extrabold tracking-tighter mb-2">
              <span className="text-orange-primary">OUT</span>GRID
            </Link>
            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Inteligência<br/>Automotiva</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Acesso rápido</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><Link to={getHomeLink("#home")} className="hover:text-orange-primary transition-colors">Home</Link></li>
              <li><Link to={getHomeLink("#problema")} className="hover:text-orange-primary transition-colors">O Problema</Link></li>
              <li><Link to={getHomeLink("#simulador")} className="hover:text-orange-primary transition-colors">Análise do Negócio</Link></li>
              <li><Link to={getHomeLink("#recursos")} className="hover:text-orange-primary transition-colors">Recursos</Link></li>
              <li><Link to={getHomeLink("#como-funciona")} className="hover:text-orange-primary transition-colors">Como funciona</Link></li>
              <li><Link to={getHomeLink("#resultados")} className="hover:text-orange-primary transition-colors">Resultados</Link></li>
              <li><Link to={getHomeLink("#contato")} className="hover:text-orange-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Informações</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><span>Outgrid Tecnologia LTDA.</span></li>
              <li><Link to="/termos" className="hover:text-orange-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="hover:text-orange-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/lucasr_correa/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-orange-primary rounded-md flex items-center justify-center text-white hover:bg-orange-600 hover:-translate-y-1 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/lucasrcorrea/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-orange-primary rounded-md flex items-center justify-center text-white hover:bg-orange-600 hover:-translate-y-1 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-300 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>
            © {currentYear} OUTGRID. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por <a href="https://www.fabricapublicidade.com.br/" target="_blank" rel="noopener noreferrer" className="text-black-main hover:text-orange-primary font-bold transition-colors">Fábrica Publicidade</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
