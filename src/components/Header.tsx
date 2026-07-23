import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHomeLink = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  const menuItems = [
    { label: 'O Problema', href: '#problema' },
    { label: 'Análise do Negócio', href: '#simulador' },
    { label: 'Recursos', href: '#recursos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Resultados', href: '#resultados' }
  ];

  return (
    <header className="py-4 md:py-6 relative z-50 border-b border-white/5 bg-black-main/80 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <Logo className="text-white h-5 md:h-6" />
            <span className="text-[10px] md:text-xs font-normal text-white/70 leading-tight border-l border-white/20 pl-2 ml-2">Inteligência<br/>Automotiva</span>
          </Link>
        </motion.div>
        
        {/* Desktop Menu */}
        <motion.ul 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex gap-8 items-center"
        >
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link to={getHomeLink(item.href)} className="text-[14px] font-semibold transition-colors text-gray-300 hover:text-white relative group pb-1">
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li>
            <Link 
              to={getHomeLink('#simulador')} 
              className="bg-orange-primary text-black-main px-4 py-2 rounded-full text-[14px] font-bold hover:bg-white transition-colors"
            >
              Solicitar Análise
            </Link>
          </li>
        </motion.ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black-main border-b border-white/10 py-4 px-6 flex flex-col gap-4 md:hidden"
        >
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={getHomeLink(item.href)} 
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-300 hover:text-white block py-2"
            >
              {item.label}
            </Link>
          ))}
          <Link 
            to={getHomeLink('#simulador')} 
            onClick={() => setIsOpen(false)}
            className="bg-orange-primary text-black-main px-4 py-3 rounded-xl text-base font-bold text-center mt-2"
          >
            Solicitar Análise
          </Link>
        </motion.div>
      )}
    </header>
  );
}
