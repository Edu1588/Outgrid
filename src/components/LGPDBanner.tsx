import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function LGPDBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lgpd_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lgpd_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 md:p-6 z-50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
      <div className="text-sm text-slate-300 flex-1 max-w-4xl">
        <p>
          <strong>Aviso de Privacidade e LGPD:</strong> Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
          As informações de leads geradas por nossa plataforma são focadas estritamente no âmbito B2B (empresas), respeitando a Lei Geral de Proteção de Dados (LGPD).
          Ao continuar navegando, você concorda com nossos{" "}
          <Link to="/termos" className="text-orange-primary hover:underline">Termos de Uso</Link> e nossa{" "}
          <Link to="/privacidade" className="text-orange-primary hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
      <div className="flex gap-3 w-full md:w-auto shrink-0">
        <button
          onClick={handleAccept}
          className="w-full md:w-auto px-6 py-2.5 bg-orange-primary hover:bg-[#FF7043] text-white font-bold rounded-lg transition-colors text-sm"
        >
          Aceitar e Continuar
        </button>
      </div>
    </div>
  );
}
