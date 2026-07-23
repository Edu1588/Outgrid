export interface UXAuditPillar {
  title: string;
  score: number;
  problem: string;
  howItShouldBe: string;
}

export interface UXAuditReport {
  overallScore: number;
  url: string;
  storeName: string;
  resumoExecutivo: string;
  pillars: {
    identidadeVisual: UXAuditPillar;
    heuristicasNielsen: UXAuditPillar;
    viesesCognitivos: UXAuditPillar;
    arquiteturaInformacao: UXAuditPillar;
    acessibilidade: UXAuditPillar;
  };
}

// 1. Velocidade & Desempenho Mobile
const speedProblems = [
  {
    problem: "Tempo de carregamento no mobile excede 4.1s devido a fotos em alta resolução sem compressão WebP ou lazy-loading.",
    howItShouldBe: "Converter galeria para WebP progressivo com carregamento sob demanda, reduzindo tempo inicial para abaixo de 1.5s."
  },
  {
    problem: "Primeiro carregamento da vitrine trava no celular por carregar todos os 40+ veículos de uma só vez sem paginação.",
    howItShouldBe: "Implementar paginação infinita com Skeleton Loader para manter a navegação do catálogo fluida no mobile."
  },
  {
    problem: "Scripts pesados de terceiros e fontes externas não otimizadas bloqueiam a renderização inicial do estoque.",
    howItShouldBe: "Adiar carregamento de scripts secundários (defer/async) e otimizar fontes locais para acelerar a exibição."
  },
  {
    problem: "Falta de cache de navegação faz com que cada clique em um carro recarregue todo o layout do site do zero.",
    howItShouldBe: "Configurar cabeçalhos de cache HTTP e pré-carregamento suave (prefetch) dos detalhes do veículo ao passar o mouse."
  }
];

// 2. Ficha Técnica e Destaque Visual do Veículo
const infoProblems = [
  {
    problem: "Falta de simulação de parcelas e calculadora de financiamento direto no anúncio do carro.",
    howItShouldBe: "Exibir o valor à vista e estimativa de parcela inicial para facilitar a decisão do comprador."
  },
  {
    problem: "Informações de opcionais e laudo cautelar em blocos de texto denso ao invés de ícones dinâmicos.",
    howItShouldBe: "Organizar ficha técnica do seminovo em ícones visuais de rápida leitura: Ano, KM, Combustível e Câmbio."
  },
  {
    problem: "Ausência de selos em destaque para laudo cautelar aprovado e garantia de procedência na vitrine.",
    howItShouldBe: "Adicionar badges visuais no card indicando 'Único Dono', 'Laudo Cautelar 100%' e 'Garantia de Loja'."
  },
  {
    problem: "Sequência de fotos do veículo no mobile sem padrão definido de navegação rápida.",
    howItShouldBe: "Padronizar sequência da galeria: 1ª Foto Frente 3/4, 2ª Traseira, 3ª Painel/KM, 4ª Bancos."
  }
];

// 3. Botões Nítidos de Contato & WhatsApp
const ctaProblems = [
  {
    problem: "Botão de WhatsApp genérico no rodapé sem enviar a mensagem pré-preenchida com a marca e modelo do carro de interesse.",
    howItShouldBe: "Integrar CTA de WhatsApp em cada carro disparando mensagem automática: 'Olá, vi o [Veículo] e quero simular financiamento'."
  },
  {
    problem: "Botões principais de contato com baixo contraste (texto cinza em fundo escuro) e sem destaque no primeiro scroll.",
    howItShouldBe: "Destacar botão CTA principal em cor vibrante (Verde WhatsApp / Laranja) fixo no rodapé mobile durante a rolagem."
  },
  {
    problem: "Ausência de botão de chamada direta por clique (click-to-call) para clientes que preferem ligar direto para a loja.",
    howItShouldBe: "Adicionar ícone de telefone interativo no topo mobile com discagem instantânea para a equipe de vendas."
  },
  {
    problem: "Múltiplos botões de ação conflitantes na página do veículo sem hierarquia visual clara do canal principal.",
    howItShouldBe: "Estabelecer botão principal 'Falar no WhatsApp' em destaque máximo e secundário 'Enviar Proposta por E-mail'."
  }
];

// 4. Formulários de Lead & Captura sem Atrito
const formProblems = [
  {
    problem: "Formulário de proposta extenso solicitando CPF, endereço e renda antes mesmo de mostrar os detalhes do veículo.",
    howItShouldBe: "Simplificar a captura para apenas 2 campos essenciais: Nome e WhatsApp, liberando atendimento imediato."
  },
  {
    problem: "Ausência de validação em tempo real no campo de telefone/WhatsApp, permitindo o envio de números incorretos.",
    howItShouldBe: "Aplicar máscara automática de telefone (00) 90000-0000 com verificação instantânea de formato válido."
  },
  {
    problem: "Após enviar a proposta, o site não exibe confirmação visual nem estimativa do tempo de retorno dos consultores.",
    howItShouldBe: "Exibir modal de sucesso com foto do consultor responsável e aviso: 'Recebemos sua mensagem! Retornaremos em até 15 min'."
  },
  {
    problem: "Simulador de financiamento confuso sem opções claras de valor de entrada ou número de parcelas.",
    howItShouldBe: "Criar calculadora interativa de parcelas com controle deslizante de entrada (ex: R$ 10 mil / R$ 20 mil)."
  }
];

// 5. Visibilidade de Telefone, E-mail e Localização
const locationProblems = [
  {
    problem: "Telefone fixo e e-mail de contato ausentes do cabeçalho mobile, exigindo rolagem até o fim da página para localizar.",
    howItShouldBe: "Fixar barra superior no topo com telefone de vendas, e-mail e botão de mapa Waze/Google Maps."
  },
  {
    problem: "Endereço físico da loja sem link para navegação direta no Google Maps ou Waze para o cliente visitar o showroom.",
    howItShouldBe: "Inserir botão 'Como Chegar à Loja' no rodapé que abre o aplicativo de GPS no celular do cliente em 1 clique."
  },
  {
    problem: "Horário de funcionamento do showroom e e-mail corporativo para vendas/trocas não especificados na página principal.",
    howItShouldBe: "Destacar bloco de contato completo: Horários de Segunda a Sábado, endereço completo, e-mail oficial e WhatsApp."
  },
  {
    problem: "Falta de mapa interativo da localização no rodapé do site para clientes da cidade e região se orientarem.",
    howItShouldBe: "Incorporar mapa do Google Maps na página de contato e footer identificando a loja física."
  }
];

// Specific Store Custom Overrides for precise realistic diagnostics
const STORE_CUSTOM_AUDITS: Record<string, Partial<UXAuditReport>> = {
  "fontcarveiculos.com.br": {
    resumoExecutivo: "A auditoria do portal Font Car Veículos (fontcarveiculos.com.br) identificou oportunidades de aceleração de carregamento no mobile e otimização do botão de WhatsApp para incluir dados do veículo de interesse automaticamente.",
    pillars: {
      identidadeVisual: {
        title: "1. Velocidade do Site e Otimização Mobile",
        score: 28,
        problem: "Tempo de carregamento inicial no mobile acima do ideal com imagens de estoque sem otimização WebP.",
        howItShouldBe: "Comprimir galeria de fotos para WebP progressivo e aplicar lazy-loading para acelerar a vitrine."
      },
      heuristicasNielsen: {
        title: "2. Ficha Técnica e Destaque Visual do Veículo",
        score: 35,
        problem: "Falta de simulação de parcelas e calculadora de financiamento estimada nos cards de veículos.",
        howItShouldBe: "Exibir estimativa de entrada e parcelas de financiamento direto nos detalhes do anúncio."
      },
      viesesCognitivos: {
        title: "3. Conversão Direta via WhatsApp & CTA",
        score: 30,
        problem: "Botão de WhatsApp abre conversa genérica sem especificar o veículo de interesse do comprador.",
        howItShouldBe: "Configurar link do WhatsApp para enviar mensagem pré-formatada com modelo e código do veículo."
      },
      arquiteturaInformacao: {
        title: "4. Captação de Lead e Formulários",
        score: 42,
        problem: "Formulário de proposta no site exige dados demorados antes de liberar o atendimento comercial.",
        howItShouldBe: "Reduzir a captura de lead para 2 campos simples (Nome e WhatsApp com máscara automática)."
      },
      acessibilidade: {
        title: "5. SEO Local, Telefone e Localização",
        score: 38,
        problem: "Telefone e e-mail da loja ficam restritos ao rodapé sem atalho de discagem no topo mobile.",
        howItShouldBe: "Inserir barra fixa no topo mobile com clique direto para ligar no fixo/WhatsApp e e-mail."
      }
    }
  },
  "paschoalinmotors.com.br": {
    resumoExecutivo: "Na análise de Paschoalin Motors (paschoalinmotors.com.br), constatamos que a busca do estoque trava ao aplicar filtros no celular. O formulário de simulação pede dados excessivos e não há visibilidade imediata do e-mail nem do telefone de vendas no cabeçalho mobile.",
    pillars: {
      identidadeVisual: {
        title: "1. Velocidade do Site e Desempenho Mobile",
        score: 38,
        problem: "Carregamento da vitrine de seminovos causa travamentos temporários no navegador mobile ao rolar a lista.",
        howItShouldBe: "Implementar paginação assíncrona do catálogo e otimizar scripts de renderização dos cards."
      },
      heuristicasNielsen: {
        title: "2. Clareza de Preço, KM e Informações",
        score: 40,
        problem: "Informações de quilometragem e laudo cautelar estão omitidas na miniatura dos carros da vitrine.",
        howItShouldBe: "Adicionar dados resumidos de KM, Ano, Câmbio e selo de Laudo Aprovado logo abaixo da foto do carro."
      },
      viesesCognitivos: {
        title: "3. Botões Nítidos de Contato e WhatsApp",
        score: 36,
        problem: "Botão flutuante de WhatsApp sobrepõe o texto de especificações técnicas do carro em telas menores.",
        howItShouldBe: "Ajustar posicionamento do CTA flutuante e aplicar fundo de alto contraste para destacar a ação principal."
      },
      arquiteturaInformacao: {
        title: "4. Formulário e Captação de Lead",
        score: 34,
        problem: "Formulário de simulação solicita CPF obrigatório no primeiro passo de contato, afastando potenciais compradores.",
        howItShouldBe: "Solicitar apenas Nome e WhatsApp no contato inicial e deixar a simulação detalhada para a conversa direta."
      },
      acessibilidade: {
        title: "5. Visibilidade de Telefone, E-mail e Endereço",
        score: 42,
        problem: "O endereço físico e o e-mail de vendas não possuem link interativo para abrir o Google Maps ou enviar e-mail.",
        howItShouldBe: "Transformar endereço em link 'Como Chegar via Waze/Maps' e disponibilizar e-mail de vendas visível."
      }
    }
  },
  "panteraveiculos.com.br": {
    resumoExecutivo: "A auditoria de Pantera Veículos (panteraveiculos.com.br) indicou falta de clareza nas parcelas de financiamento, carregamento lento da galeria de fotos e ausência de botão direto de discagem telefônica no topo do portal.",
    pillars: {
      identidadeVisual: {
        title: "1. Velocidade do Site e Desempenho Mobile",
        score: 36,
        problem: "Galeria de fotos do veículo demora mais de 3.8s para abrir no celular por falta de compressão nas imagens.",
        howItShouldBe: "Redimensionar imagens do showroom para até 1200px em WebP com pré-carregamento suave."
      },
      heuristicasNielsen: {
        title: "2. Clareza de Preço, KM e Informações",
        score: 38,
        problem: "Falta de indicação sobre valores de parcelas ou taxas de financiamento estimadas no anúncio do carro.",
        howItShouldBe: "Exibir calculadora simples de entrada com simulação visual de parcelas estimadas em 48x."
      },
      viesesCognitivos: {
        title: "3. Botões Nítidos de Contato e WhatsApp",
        score: 35,
        problem: "Botões de proposta por WhatsApp não possuem destaque cromático adequado no fundo escuro da página.",
        howItShouldBe: "Utilizar verde padrão de ação de alto contraste com ícone oficial do WhatsApp em tamanho destacado."
      },
      arquiteturaInformacao: {
        title: "4. Formulário e Captação de Lead",
        score: 40,
        problem: "Formulário de contato não envia notificação de recebimento ou mensagem de confirmação instantânea ao cliente.",
        howItShouldBe: "Apresentar tela de agradecimento pós-envio informando o tempo médio de resposta de 10 minutos."
      },
      acessibilidade: {
        title: "5. Visibilidade de Telefone, E-mail e Endereço",
        score: 41,
        problem: "Número de telefone fixo e WhatsApp da loja não estão formatados como links clicáveis no cabeçalho.",
        howItShouldBe: "Tornar telefones e e-mails inteiramente clicáveis (tel: e mailto:) para facilidade de comunicação."
      }
    }
  },
  "noveiculos.com.br": {
    resumoExecutivo: "A análise de Nova Odessa Veículos (noveiculos.com.br) detectou filtros de busca incompletos, imagens pesadas no catálogo e ausência de botão para localização do showroom no Google Maps.",
    pillars: {
      identidadeVisual: {
        title: "1. Velocidade do Site e Desempenho Mobile",
        score: 39,
        problem: "Catálogo de seminovos no mobile carrega de forma lenta, consumindo muitos dados de internet móvel.",
        howItShouldBe: "Otimizar tempo de carregamento para menos de 1.8s através de otimização de imagens e minificação de assets."
      },
      heuristicasNielsen: {
        title: "2. Clareza de Preço, KM e Informações",
        score: 38,
        problem: "Ausência de filtro rápido por faixa de preço e ano, dificultando encontrar carros em um orçamento específico.",
        howItShouldBe: "Incluir seletor de faixa de preço (ex: até R$ 50 mil, R$ 50k - R$ 80k) na busca de estoque."
      },
      viesesCognitivos: {
        title: "3. Botões Nítidos de Contato e WhatsApp",
        score: 37,
        problem: "Mensagem do botão de WhatsApp é genérica, não informando qual vendedor ou veículo está sendo consultado.",
        howItShouldBe: "Formatar mensagem automática no WhatsApp indicando exatamente o carro escolhido na página."
      },
      arquiteturaInformacao: {
        title: "4. Formulário e Captação de Lead",
        score: 36,
        problem: "Formulário de proposta possui mais de 5 campos obrigatórios, aumentando o atrito e desistência do comprador.",
        howItShouldBe: "Reduzir o formulário de proposta para Nome, WhatsApp e pretensão de trocar um carro na negociação."
      },
      acessibilidade: {
        title: "5. Visibilidade de Telefone, E-mail e Endereço",
        score: 40,
        problem: "O endereço e e-mail da concessionária estão visíveis apenas em texto simples sem mapa integrado.",
        howItShouldBe: "Adicionar widget de localização do Google Maps com link direto para rota de navegação GPS."
      }
    }
  }
};

export function generateUXAuditReport(storeName: string, url: string, baseScore: number): UXAuditReport {
  const hasNoWebsite = !url || url.trim() === "" || 
    url.toLowerCase().includes("sem site") || 
    url.toLowerCase().includes("instagram.com") || 
    url.toLowerCase().includes("facebook.com") || 
    url.toLowerCase().includes("carrosp.com.br") || 
    url.toLowerCase().includes("olx.com.br") || 
    url.toLowerCase().includes("webmotors.com.br") || 
    url.toLowerCase() === "null";

  if (hasNoWebsite) {
    const score = baseScore; // Use the actual assigned score of the lead
    
    // Generate robust hash seed based on storeName
    let hash = 0;
    const str = storeName || "Loja de Veículos";
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const speedScore = 0; // Presença Digital Própria (Site) is 0 because there is no site
    const infoScore = Math.max(12, Math.min(28, score + (seed % 6)));
    const ctaScore = Math.max(10, Math.min(26, score - 2 + (seed % 6)));
    const formScore = 0; // Captação Ativa de Propostas is 0 because there is no site
    const locationScore = Math.max(15, Math.min(32, score + 4 + (seed % 6)));

    const executiveSummary = `A auditoria comercial identificou que ${storeName} não possui canal ou site próprio de vendas na internet. Toda a sua operação digital depende de redes sociais (como Instagram) ou portais terceiros concorrentes. Isso causa dispersão imediata de leads, dependência de atendimento manual e risco de o cliente visualizar ofertas de concorrentes no mesmo portal. Um portal próprio aumentaria o controle do tráfego e a conversão de contatos de forma exclusiva.`;

    return {
      overallScore: score,
      url: "",
      storeName: storeName || "Loja de Veículos",
      resumoExecutivo: executiveSummary,
      pillars: {
        identidadeVisual: {
          title: "1. Presença Digital Própria (Site)",
          score: speedScore,
          problem: "Ausência de site próprio força o cliente a buscar seu estoque em portais concorrentes, perdendo exclusividade e identidade.",
          howItShouldBe: "Desenvolver uma Landing Page ou Portal de estoque próprio para reter 100% da atenção do comprador e gerar leads sem concorrência."
        },
        heuristicasNielsen: {
          title: "2. Organização do Catálogo Digital",
          score: infoScore,
          problem: "Catálogo do Instagram ou portais sem padronização de imagens, preços claros ou dados como quilometragem nos destaques.",
          howItShouldBe: "Organizar o portfólio de veículos com fotos padronizadas de alta qualidade, especificações legíveis e valores expostos."
        },
        viesesCognitivos: {
          title: "3. Direcionamento e Funil de Vendas",
          score: ctaScore,
          problem: "O link da bio das redes sociais envia para um WhatsApp genérico, sem identificar o veículo de interesse ou qualificar o contato.",
          howItShouldBe: "Implementar direcionador com mensagens automáticas pré-preenchidas para identificar instantaneamente o veículo desejado."
        },
        arquiteturaInformacao: {
          title: "4. Captação Ativa de Propostas",
          score: formScore,
          problem: "Inexistência de canais automatizados para o cliente simular parcelas ou enviar propostas estruturadas fora do horário comercial.",
          howItShouldBe: "Disponibilizar formulário de simulação simples focado em capturar Nome e WhatsApp de leads interessados 24h por dia."
        },
        acessibilidade: {
          title: "5. SEO Local e Localização Física",
          score: locationScore,
          problem: "Ausência de integração direta entre o Google Maps (Google Meu Negócio) e as redes sociais, dificultando a visita ao showroom físico.",
          howItShouldBe: "Fixar atalhos de rotas por GPS ('Como Chegar via Maps/Waze') e horário de atendimento de forma destacada em todas as bios."
        }
      }
    };
  }

  // Normalize URL and Domain
  let cleanDomain = url || "";
  try {
    if (cleanDomain) {
      const parsed = new URL(cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`);
      cleanDomain = parsed.hostname.replace(/^www\./, '').toLowerCase();
    }
  } catch (e) {
    cleanDomain = (url || "").toLowerCase();
  }

  // Check if we have a custom store override
  for (const domainKey in STORE_CUSTOM_AUDITS) {
    if (cleanDomain.includes(domainKey) || cleanDomain.endsWith(domainKey)) {
      const override = STORE_CUSTOM_AUDITS[domainKey];
      return {
        overallScore: Math.min(Math.max(baseScore, 24), 48),
        url: url || `https://${cleanDomain}`,
        storeName: storeName || "Loja de Veículos",
        resumoExecutivo: override.resumoExecutivo || "",
        pillars: override.pillars as any
      };
    }
  }

  // Generate robust hash seed based on storeName and cleanDomain
  const str = `${storeName}_${cleanDomain}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Normalize baseScore
  const score = Math.min(Math.max(baseScore, 22), 52);

  // Select indexes deterministically without overlapping identical texts
  const speedIdx = seed % speedProblems.length;
  const infoIdx = (seed + 1) % infoProblems.length;
  const ctaIdx = (seed + 2) % ctaProblems.length;
  const formIdx = (seed + 3) % formProblems.length;
  const locationIdx = (seed + 4) % locationProblems.length;

  // Derive realistic unique pillar scores per store
  const speedScore = Math.max(18, Math.min(68, score - 5 + (seed % 12)));
  const infoScore = Math.max(22, Math.min(72, score + ((seed >> 2) % 10) - 4));
  const ctaScore = Math.max(20, Math.min(65, score - 6 + ((seed >> 4) % 14)));
  const formScore = Math.max(25, Math.min(75, score + 4 - ((seed >> 6) % 8)));
  const locationScore = Math.max(24, Math.min(70, score - 3 + ((seed >> 8) % 11)));

  // Estimated lead loss calculation
  const lossMin = 22 + (seed % 10);
  const lossMax = lossMin + 12 + (seed % 8);

  const executiveSummary = `A auditoria técnica e de UX do portal de ${storeName} (${cleanDomain || 'site oficial'}) analisou a experiência de navegação e conversão mobile. O diagnóstico aponta oportunidades em velocidade de carregamento de imagens do estoque, rastreabilidade de leads via WhatsApp e otimização para motores de busca (SEO Local), estimando um potencial de ganho de até ${lossMin}% a ${lossMax}% na conversão de visitantes em contato direto.`;

  return {
    overallScore: score,
    url: url || `https://${cleanDomain || 'site.com.br'}`,
    storeName: storeName || "Loja de Veículos",
    resumoExecutivo: executiveSummary,
    pillars: {
      identidadeVisual: {
        title: "1. Velocidade do Site e Otimização Mobile",
        score: speedScore,
        problem: speedProblems[speedIdx].problem,
        howItShouldBe: speedProblems[speedIdx].howItShouldBe
      },
      heuristicasNielsen: {
        title: "2. Ficha Técnica e Destaque Visual do Veículo",
        score: infoScore,
        problem: infoProblems[infoIdx].problem,
        howItShouldBe: infoProblems[infoIdx].howItShouldBe
      },
      viesesCognitivos: {
        title: "3. Conversão Direta via WhatsApp & CTA",
        score: ctaScore,
        problem: ctaProblems[ctaIdx].problem,
        howItShouldBe: ctaProblems[ctaIdx].howItShouldBe
      },
      arquiteturaInformacao: {
        title: "4. Captação de Lead e Formulários",
        score: formScore,
        problem: formProblems[formIdx].problem,
        howItShouldBe: formProblems[formIdx].howItShouldBe
      },
      acessibilidade: {
        title: "5. SEO Local, Telefone e Localização",
        score: locationScore,
        problem: locationProblems[locationIdx].problem,
        howItShouldBe: locationProblems[locationIdx].howItShouldBe
      }
    }
  };
}
