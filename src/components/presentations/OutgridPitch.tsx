import React from 'react';
import { Settings, BarChart, Users, TrendingUp } from 'lucide-react';

export const slideTemplates = [
  // Slide 0
  (data: any) => (
    <div className="w-full h-full relative bg-[#041630] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#041630] via-[#041630]/80 to-transparent"></div>
      
      <div className="relative z-10 flex items-center mb-8">
        <h1 className="text-8xl md:text-[12rem] font-black text-white tracking-tighter leading-none">{data.titleLeft}</h1>
        <div className="bg-[#E95800] rounded-2xl px-6 py-2 ml-4 shadow-[0_0_40px_rgba(233,88,0,0.4)]">
          <h1 className="text-8xl md:text-[12rem] font-black text-white tracking-tighter leading-none">{data.titleRight}</h1>
        </div>
      </div>
      
      <p className="relative z-10 text-2xl md:text-3xl text-white font-medium mt-8">
        <span className="text-[#E95800]">{data.sub1}</span> {data.sub1Text} <span className="text-[#E95800] mx-2">|</span> <span className="text-[#E95800]">{data.sub2}</span> {data.sub2Text} <span className="text-[#E95800] mx-2">|</span> <span className="text-[#E95800]">{data.sub3}</span> {data.sub3Text}
      </p>
    </div>
  ),

  // Slide 1
  (data: any) => (
    <div className="w-full h-full flex bg-black">
      <div className="w-1/2 relative bg-[#111] overflow-hidden border-r-4 border-[#E95800]">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: `url('${data.bgLeft}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl p-6 w-3/4 shadow-2xl flex flex-wrap justify-center gap-4 text-black font-bold">
           <span className="text-2xl opacity-60">{data.tag1}</span>
           <span className="text-2xl opacity-60">{data.tag2}</span>
        </div>
        <div className="absolute bottom-12 w-full text-center">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">{data.titleLeft}</h2>
        </div>
      </div>
      <div className="w-1/2 relative bg-[#E95800] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${data.bgRight}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#E95800] to-transparent"></div>
        <div className="absolute bottom-12 w-full text-center">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">{data.titleRight}</h2>
        </div>
      </div>
    </div>
  ),

  // Slide 2
  (data: any) => (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute right-0 top-0 h-full w-2/5 bg-[#041630] rounded-l-[4rem] shadow-2xl flex items-center p-16">
        <h2 className="text-5xl leading-tight font-medium text-white" dangerouslySetInnerHTML={{ __html: data.text }}></h2>
      </div>
    </div>
  ),

  // Slide 3
  (data: any) => (
    <div className="w-full h-full relative flex bg-[#041630]">
      <div className="w-3/5 p-20 flex flex-col justify-center">
        <h2 className="text-6xl font-medium text-white mb-16 leading-tight" dangerouslySetInnerHTML={{ __html: data.title }}></h2>
        <ul className="space-y-8">
          {(data.bullets || []).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-3 h-3 bg-white mt-3 flex-shrink-0"></div>
              <p className="text-3xl text-white" dangerouslySetInnerHTML={{ __html: b }}></p>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/5 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity" style={{ backgroundImage: `url('${data.bgRight}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041630] to-transparent"></div>
      </div>
    </div>
  ),

  // Slide 4
  (data: any) => (
    <div className="w-full h-full relative bg-[#efefef] flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute top-32 left-16 z-10">
        <h1 className="text-[10rem] font-black text-red-600 drop-shadow-xl tracking-tighter leading-none" style={{ textShadow: '4px 4px 0 #990000, 8px 8px 20px rgba(0,0,0,0.5)' }}>
          {data.bigText}
        </h1>
      </div>
      
      <div className="relative z-20 bg-[#041630] w-full p-16 rounded-tr-[4rem]">
        <h2 className="text-5xl font-medium text-white mb-12" dangerouslySetInnerHTML={{ __html: data.title }}></h2>
        <ul className="space-y-6">
          {(data.bullets || []).map((b: string, i: number) => (
            <li key={i} className="flex items-center gap-4">
              <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
              <p className="text-3xl text-white" dangerouslySetInnerHTML={{ __html: b }}></p>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-8 right-12 flex items-center opacity-50">
          <span className="text-white font-black text-3xl tracking-tighter">{data.logoLeft}</span>
          <div className="bg-[#E95800] px-2 py-0.5 rounded ml-1">
            <span className="text-white font-black text-3xl tracking-tighter">{data.logoRight}</span>
          </div>
        </div>
      </div>
    </div>
  ),

  // Slide 5
  (data: any) => (
    <div className="w-full h-full flex bg-[#041630]">
      <div className="w-2/5 bg-[#E95800] relative rounded-r-[4rem] flex items-center justify-center p-12 overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <img src={data.leftImage} alt="Laptop" className="w-full h-auto rounded-xl shadow-2xl relative z-20 border-4 border-white/20" />
      </div>
      <div className="w-3/5 p-20 flex flex-col justify-center relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#D14F00] text-white px-8 py-3 rounded-b-3xl font-bold text-2xl tracking-widest shadow-lg">
          {data.badge}
        </div>
        
        <div className="flex items-center mb-16 mt-8 justify-center">
          <h1 className="text-8xl font-black text-white tracking-tighter leading-none">{data.logoLeft}</h1>
          <div className="bg-[#E95800] rounded-2xl px-6 py-2 ml-4">
            <h1 className="text-8xl font-black text-white tracking-tighter leading-none">{data.logoRight}</h1>
          </div>
        </div>
        
        <ul className="space-y-12">
          {(data.bullets || []).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-6">
              <div className="w-4 h-4 bg-white mt-3 flex-shrink-0"></div>
              <p className="text-3xl text-white leading-tight" dangerouslySetInnerHTML={{ __html: b }}></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  // Slide 6
  (data: any) => (
    <div className="w-full h-full relative bg-black flex flex-col pt-32">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-12 py-4 rounded-3xl shadow-lg z-20 border-4 border-[#E95800]">
        <h1 className="text-6xl font-medium text-[#D14F00]" dangerouslySetInnerHTML={{ __html: data.mainTitle }}></h1>
      </div>
      
      <div className="flex-1 flex w-full">
        <div className="w-1/2 relative p-16 flex flex-col bg-[#041630]">
          <div className="absolute inset-0 bg-cover opacity-20 mix-blend-luminosity" style={{ backgroundImage: `url('${data.bgLeft}')` }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-[#E95800] text-white text-5xl font-black px-12 py-4 rounded-3xl mb-16 shadow-lg">{data.titleLeft}</div>
            
            <ul className="space-y-10 w-full max-w-lg mx-auto">
              {(data.bulletsLeft || []).map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-6 text-2xl text-white">
                  <span className="font-bold text-3xl">-</span> <span dangerouslySetInnerHTML={{ __html: b }}></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="w-1/2 relative p-16 flex flex-col bg-[#E95800]">
          <div className="absolute inset-0 bg-cover opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${data.bgRight}')` }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-[#041630] text-white text-5xl font-black px-12 py-4 rounded-3xl mb-16 shadow-lg flex items-center" dangerouslySetInnerHTML={{ __html: data.titleRight }}>
            </div>
            
            <ul className="space-y-10 w-full max-w-lg mx-auto">
              {(data.bulletsRight || []).map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-6 text-2xl text-white">
                  <span className="font-bold text-3xl">-</span> <span dangerouslySetInnerHTML={{ __html: b }}></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-t-3xl flex items-center z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <span className="text-[#041630] font-black text-4xl tracking-tighter">{data.logoLeft}</span>
        <div className="bg-[#E95800] px-2 py-0.5 rounded ml-1">
          <span className="text-white font-black text-4xl tracking-tighter">{data.logoRight}</span>
        </div>
      </div>
    </div>
  ),

  // Slide 7
  (data: any) => {
    // Need a helper to get icon by name
    const getIcon = (name: string) => {
      switch (name) {
        case 'Settings': return <Settings className="w-16 h-16" />;
        case 'BarChart': return <BarChart className="w-16 h-16" />;
        case 'Users': return <Users className="w-16 h-16" />;
        case 'TrendingUp': return <TrendingUp className="w-16 h-16" />;
        default: return <Settings className="w-16 h-16" />;
      }
    };
    
    return (
      <div className="w-full h-full relative bg-[#041630] flex flex-col items-center justify-center p-16">
        <div className="absolute inset-0 bg-cover opacity-10 mix-blend-luminosity" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
        
        <h1 className="text-6xl font-medium text-white mb-24 relative z-10 text-center" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
        
        <div className="flex justify-between items-start w-full max-w-6xl relative z-10">
          {(data.steps || []).map((step: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center text-center w-1/5 px-4 relative">
              {idx < (data.steps.length - 1) && <div className="absolute right-[-10%] top-8 text-white text-4xl font-bold">›</div>}
              <div className="text-[#E95800] mb-6">
                {getIcon(step.icon)}
              </div>
              <h3 className="text-white font-bold text-2xl mb-6 h-16">{step.title}</h3>
              <div className="w-10 h-10 border-2 border-[#E95800] rounded flex items-center justify-center text-[#E95800] mb-6 rotate-180">^</div>
              <p className="text-gray-300 italic text-lg leading-snug">→ {step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },

  // Slide 8
  (data: any) => (
    <div className="w-full h-full relative bg-[#041630] p-24 flex flex-col justify-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#041630] via-[#041630]/90 to-transparent"></div>
      
      <div className="relative z-10 w-2/3">
        <h1 className="text-7xl font-medium text-white mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
        
        <p className="text-3xl text-white mt-16 mb-12" dangerouslySetInnerHTML={{ __html: data.subtitle }}></p>
        
        <ul className="space-y-8">
          {(data.bullets || []).map((b: string, i: number) => (
            <li key={i} className="flex items-center gap-6">
              <div className="w-3 h-3 bg-white mt-2 flex-shrink-0"></div>
              <p className="text-4xl text-white leading-tight" dangerouslySetInnerHTML={{ __html: b }}></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  // Slide 9
  (data: any) => (
    <div className="w-full h-full relative bg-[#041630] p-20 flex flex-col justify-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#041630] via-[#041630]/90 to-transparent"></div>
      
      <div className="relative z-10 w-3/4">
        <h1 className="text-7xl font-medium text-white mb-16" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
        
        <div className="space-y-12">
          {(data.pillars || []).map((pillar: any, idx: number) => (
            <div key={idx}>
              <div className="inline-block bg-[#E95800] text-white text-3xl font-black px-6 py-2 mb-6 shadow-lg">{pillar.title}</div>
              <ul className="space-y-4 pl-8">
                {(pillar.bullets || []).map((b: string, i: number) => (
                  <li key={i} className="flex items-center gap-4 text-3xl text-white">
                    <div className="w-2 h-2 bg-white flex-shrink-0"></div> 
                    <span dangerouslySetInnerHTML={{ __html: b }}></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  // Slide 10
  (data: any) => (
    <div className="w-full h-full relative bg-[#041630] p-24 flex flex-col justify-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('${data.bgImage}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#041630] via-[#041630]/90 to-transparent"></div>
      
      <div className="relative z-10 w-2/3">
        <div className="inline-block mb-16">
          <h1 className="text-8xl font-black text-[#041630] bg-white px-8 py-2 relative" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
        </div>
        
        <ul className="space-y-6">
          {(data.bullets || []).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-6">
              <div className="w-3 h-3 bg-white mt-4 flex-shrink-0"></div>
              <p className="text-4xl text-white leading-tight" dangerouslySetInnerHTML={{ __html: b }}></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
];

export const defaultSlidesData = [
  {
    bgImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    titleLeft: 'OUT',
    titleRight: 'GRID',
    sub1: 'Otimize', sub1Text: 'suas vendas',
    sub2: 'Construa', sub2Text: 'sua audiência',
    sub3: 'Valorize', sub3Text: 'sua marca.'
  },
  {
    bgLeft: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    bgRight: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tag1: 'Portais',
    tag2: 'Concorrentes',
    titleLeft: 'Preso ao Sistema',
    titleRight: 'Independência OUTGRID'
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1600346014493-9c869fb7df57?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    text: 'Sua loja se<br/> torna <span className="text-[#E95800] font-black">refém</span><br/> dos <span className="text-[#E95800] font-black">grandes Portais.</span>'
  },
  {
    bgRight: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    title: 'Deixe de ser <span className="text-[#E95800] font-black">refém</span><br/> dos <span className="text-[#E95800] font-black">grandes portais</span>',
    bullets: [
      'O portal <span className="text-[#E95800] font-bold">não é seu sócio</span>, é o dono <span className="text-[#E95800] font-bold">do seu cliente</span>',
      'Se amanhã ele <span className="text-[#E95800] font-bold">desligar seus anúncios</span>, você <span className="text-[#E95800] font-bold">para de vender</span>.',
      'Enquanto <span className="text-[#E95800] font-bold">você vende carros</span>, o portal <span className="text-[#E95800] font-bold">constrói a marca dele</span> não a sua.',
      'Vender pelos portais <span className="text-[#E95800] font-bold">custa cerca de 74% a mais</span> do que vender pelo <span className="text-[#E95800] font-bold">seu próprio canal</span>.'
    ]
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1587313028292-628464303d27?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    bigText: 'minha Loja',
    title: '<span className="text-[#E95800] font-black text-6xl">O Caminho</span> é ter o que <span className="text-[#E95800] font-black text-6xl">é seu!</span>',
    bullets: [
      '<span className="font-bold">Invista</span> na <span className="font-bold">sua marca</span>, no seu ecossistema e no seu canal direto com o cliente.',
      'Use portais como <span className="font-bold">parceiros</span> mas não como base.',
      'Construa a autoridade de <span className="font-bold">sua própria marca</span>.'
    ],
    logoLeft: 'OUT',
    logoRight: 'GRID'
  },
  {
    leftImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badge: 'A SOLUÇÃO',
    logoLeft: 'OUT',
    logoRight: 'GRID',
    bullets: [
      'A <span className="text-[#E95800] font-bold">Outgrid</span> é uma mentoria que une <span className="text-[#E95800] font-bold">estratégia</span> e <span className="text-[#E95800] font-bold">marketing automotivo.</span>',
      'Ela transforma a <span className="text-[#E95800] font-bold">operação da sua loja</span> em uma máquina de <span className="text-[#E95800] font-bold">geração de leads</span> e <span className="text-[#E95800] font-bold">vendas</span>, com <span className="text-[#E95800] font-bold">performance, independência</span> e <span className="text-[#E95800] font-bold">domínio total</span> sobre os <span className="text-[#E95800] font-bold">seus resultados.</span>'
    ]
  },
  {
    mainTitle: '<span className="font-black">Quadro</span> Comparativo',
    bgLeft: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    titleLeft: 'Com Portais',
    bulletsLeft: [
      'Dependência total de terceiros para gerar tráfego e leads.',
      'Custo médio por venda: <span className="font-bold">R$ 1.500</span>.',
      'O portal é dono da audiência e da sua visibilidade.',
      'Pouca diferenciação de marca.',
      'Se o portal desliga seus anúncios, as vendas param.'
    ],
    bgRight: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    titleRight: 'Com Out<span className="text-[#E95800]">grid</span>',
    bulletsRight: [
      'Total controle sobre sua audiência e seus leads.',
      'Custo médio por venda: <span className="font-bold">R$ 390</span>.',
      'Seu canal se torna sua principal fonte de vendas.',
      'Fortalece a marca e a autoridade da sua loja.',
      'Independência e previsibilidade nos resultados.'
    ],
    logoLeft: 'OUT',
    logoRight: 'GRID'
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    title: 'Como Funciona a <span className="font-black">Out<span className="text-[#E95800]">grid</span></span>',
    steps: [
      { title: "1. Diagnóstico", desc: "Análise da operação comercial da loja.", icon: "Settings" },
      { title: "2. Posicionamento", desc: "Otimização do site e marca da loja.", icon: "BarChart" },
      { title: "3. Campanhas", desc: "Captação e geração ativa de leads.", icon: "Users" },
      { title: "4. Funil de Vendas", desc: "Qualificação e abordagem estruturada.", icon: "Users" },
      { title: "5. Resultados", desc: "Conversão previsível e escalável.", icon: "TrendingUp" }
    ]
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    title: 'Seu website como<br/> <span className="text-[#E95800] font-black">Máquina de Vendas</span>',
    subtitle: 'O cliente navega como em um <span className="text-[#E95800] font-bold">grande portal</span>, mas dentro <span className="text-[#E95800] font-bold">da loja</span>:',
    bullets: [
      'Envía <span className="text-[#E95800] font-bold">propostas</span> e simula <span className="text-[#E95800] font-bold">parcelas</span>.',
      'Adiciona o seu carro na troca.',
      'Fala direto com o vendedor.',
      'Cada clique é um lead qualificado, pronto para fechar negócio.'
    ]
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    title: 'Os 3 Pilares <span className="text-[#E95800] font-black">Outgrid</span>',
    pillars: [
      {
        title: '1. Novo Website Automotivo',
        bullets: ['Design moderno e responsivo.', 'SEO e performance otimizados.', 'Prova social e integração CRM.']
      },
      {
        title: '2. SITE DO VENDEDOR / SITE DE MESA NA LOJA',
        bullets: ['Estratégia comercial avançada.', 'Hotsites exclusivos por vendedor.', 'Leads direcionados e negociáveis.']
      },
      {
        title: '3. API Inteligente',
        bullets: ['Integração em tempo real com sistema de gestão.', 'Atualização rápida e segura.', 'Estrutura escalável e preparada para o crescimento.']
      }
    ]
  },
  {
    bgImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    title: '<span className="relative z-10 bg-[#E95800] text-white px-6">Benefícios</span> Reais',
    bullets: [
      '+30% de conversão em leads.',
      'Custo por venda até 80% menor.',
      'Independência total dos portais.',
      'Maior autoridade e reconhecimento da sua marca.',
      'Vendedores com autonomia digital.',
      'Conversão previsível.',
      '100% Otimizado para Google (SEO)'
    ]
  }
];

export const outgridSlides = defaultSlidesData.map((data, index) => slideTemplates[index](data));
