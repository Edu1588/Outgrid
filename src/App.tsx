import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { TheProblem } from "./components/TheProblem";
import { Cost } from "./components/Cost";
import { Pricing } from "./components/Pricing";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Solution } from "./components/Solution";
import { Comparison } from "./components/Comparison";
import { Proof } from "./components/Proof";
import { Trust } from "./components/Trust";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FixedButtons } from "./components/FixedButtons";
import { SectionDivider } from "./components/SectionDivider";
import { Loader } from "./components/Loader";
import { TermsOfUse } from "./components/TermsOfUse";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { ApresentacaoComercial } from "./components/ApresentacaoComercial";
import { Estrategia } from "./components/Estrategia";
import { Captacao } from "./components/Captacao";
import { Admin } from "./components/Admin";
import { trackPageView } from "./lib/storage";

function smoothScroll(targetY: number, duration: number) {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  function step(currentTime: number) {
    const progress = (currentTime - startTime) / duration;
    if (progress < 1) {
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + difference * ease);
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
    }
  }
  window.requestAnimationFrame(step);
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80; // approximate header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        smoothScroll(offsetPosition, 600); // 600ms duration for fluid and fast scroll
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function PageTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      trackPageView(pathname);
    }
  }, [pathname]);
  return null;
}

function MainApp() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-black-main font-sans selection:bg-orange-primary/30 selection:text-white relative">
      <Helmet>
        <title>OUTGRID - Aceleração Automotiva</title>
        <meta name="description" content="Pare de depender dos portais. Construa a presença digital da sua loja de carros e aumente suas vendas." />
        <meta property="og:image" content="https://res.cloudinary.com/ifuatk2z/image/upload/v1784647657/Outgrid_1_voq4bn.png" />
      </Helmet>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      
      <Header />
      
      <main className={isLoaded ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        <Hero />
        <Marquee />
        <TheProblem />
        <SectionDivider bgTop="#F9FAFB" bgBottom="black-main" />
        <Cost />
        <Pricing />
        
        <SectionDivider bgTop="black-main" bgBottom="#F4F4F5" />
        
        <Features />
        
        <HowItWorks />
        
        <SectionDivider bgTop="white" bgBottom="black-main" />
        
        <Solution />
        <Proof />
        
        <SectionDivider bgTop="black-main" bgBottom="#F4F4F5" />
        
        <Comparison />
        
        <SectionDivider bgTop="#F4F4F5" bgBottom="black-main" />
        
        <Trust />
        <FAQ />
        
        <Contact />
      </main>
      
      <FixedButtons />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <PageTracker />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/termos" element={<TermsOfUse />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/apresentacao-comercial" element={<ApresentacaoComercial />} />
        <Route path="/estrategia" element={<Estrategia />} />
        <Route path="/captacao" element={<Captacao />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
