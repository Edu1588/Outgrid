import { useState, useRef } from 'react';
import { ProtectedPage } from './ProtectedPage';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { ImagePlus, Loader2, X, Plus, ExternalLink, Trash2 } from 'lucide-react';

interface MoodboardImage {
  id: string;
  url: string;
  name: string;
}

interface ReferenceLink {
  id: string;
  url: string;
  title: string;
}

export function Estrategia() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [links, setLinks] = useState<ReferenceLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [images, setImages] = useState<MoodboardImage[]>([
    {
      id: 'default-1',
      url: 'https://res.cloudinary.com/ifuatk2z/image/upload/v1784649912/ChatGPT_Image_21_de_jul._de_2026_13_03_31_tm1lry.png',
      name: 'Lucas Correa - Mentor',
    },
    {
      id: 'default-2',
      url: 'https://res.cloudinary.com/ifuatk2z/image/upload/v1784650580/criativoLucas_o6byvu.png',
      name: 'Estilo de Criativo',
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          let quality = 0.9;
          const compress = () => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'));
                return;
              }
              if (blob.size > 1024 * 1024 && quality > 0.1) {
                quality -= 0.1;
                compress();
              } else {
                const extension = file.name.split('.').pop() || 'jpg';
                const newName = `outgrid-moodboard-${Date.now()}.${extension}`;
                resolve(new File([blob], newName, { type: blob.type || 'image/jpeg' }));
              }
            }, file.type || 'image/jpeg', quality);
          };
          compress();
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const compressedFile = await compressImage(file);
      
      const { data, error } = await supabase.storage
        .from('moodboard')
        .upload(compressedFile.name, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('moodboard')
        .getPublicUrl(data.path);

      setImages(prev => [...prev, {
        id: data.path,
        url: publicUrl,
        name: 'Nova Referência'
      }]);

    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Verifique se o bucket "moodboard" existe e é público no Supabase.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    
    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newLink: ReferenceLink = {
      id: Date.now().toString(),
      title: newLinkTitle.trim(),
      url: formattedUrl
    };

    setLinks([...links, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ProtectedPage title="Plano de Conteúdo e Estratégia">
      <Helmet>
        <title>Estratégia e Checklist - OUTGRID</title>
        <meta name="description" content="Checklists, moodboard e base estratégica OUTGRID." />
        <meta property="og:image" content="https://res.cloudinary.com/ifuatk2z/image/upload/v1784647657/Outgrid_1_voq4bn.png" />
      </Helmet>
      <div className={`estrategia-wrapper ${theme}`} data-theme={theme}>
        <style>{`
          .estrategia-wrapper {
            --accent: #FF5722;
            --accent-soft: #FF8A65;
            --accent-deep: #E8481B;
            --accent-glow: rgba(255, 87, 34, 0.22);
            --bg: #0A0A0A;
            --surface: #141414;
            --surface-2: #1C1B1A;
            --border: rgba(255, 255, 255, 0.09);
            --border-strong: rgba(255, 255, 255, 0.16);
            --text: #F5F3F1;
            --text-2: #C4BEB8;
            --text-muted: #8E877F;
            --grid-line: rgba(255, 255, 255, 0.03);
            --good: #4ADE80;
            --bad: #6B635C;

            font-family: 'Manrope', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
            position: relative;
            overflow-x: hidden;
            min-height: 100vh;
            width: 100%;
          }

          .estrategia-wrapper[data-theme="light"] {
            --accent: #E8481B;
            --accent-soft: #C43C15;
            --accent-deep: #E8481B;
            --accent-glow: rgba(232, 72, 27, 0.14);
            --bg: #F7F4F1;
            --surface: #FFFFFF;
            --surface-2: #FBF9F7;
            --border: rgba(26, 21, 18, 0.10);
            --border-strong: rgba(26, 21, 18, 0.20);
            --text: #1A1512;
            --text-2: #4A423B;
            --text-muted: #857B72;
            --grid-line: rgba(26, 21, 18, 0.035);
            --good: #16A34A;
            --bad: #A39B94;
          }

          .estrategia-wrapper * {
            box-sizing: border-box;
          }

          .estrategia-wrapper .mono {
            font-family: 'JetBrains Mono', monospace;
            font-variant-numeric: tabular-nums;
          }

          .estrategia-wrapper .wrap {
            position: relative;
            z-index: 1;
            max-width: 940px;
            margin: 0 auto;
            padding: 0 32px;
          }

          .estrategia-wrapper .toggle {
            position: fixed;
            top: 20px; right: 220px;
            z-index: 50;
            background: var(--surface);
            border: 1px solid var(--border-strong);
            color: var(--text-2);
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 1px;
            padding: 9px 14px;
            border-radius: 8px;
            cursor: pointer;
            transition: all .2s;
          }
          .estrategia-wrapper .toggle:hover { border-color: var(--accent); color: var(--accent); }

          .estrategia-wrapper .cover {
            padding: 120px 0 70px;
            border-bottom: 1px solid var(--border);
          }
          .estrategia-wrapper .brandrow {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 56px;
          }
          .estrategia-wrapper .brandrow img { height: 20px; width: auto; }
          .estrategia-wrapper[data-theme="light"] .brandrow img { filter: invert(1) brightness(0.35); }
          .estrategia-wrapper .brandrow .sep { width: 1px; height: 22px; background: var(--border-strong); }
          .estrategia-wrapper .brandrow .kicker {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
          }

          .estrategia-wrapper .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--accent);
            margin-bottom: 26px;
          }
          .estrategia-wrapper .eyebrow::before {
            content: '';
            width: 26px; height: 1px;
            background: var(--accent);
          }

          .estrategia-wrapper h1 {
            font-size: clamp(42px, 7vw, 78px);
            font-weight: 800;
            line-height: 1.02;
            letter-spacing: -2.5px;
            text-wrap: balance;
            margin-bottom: 28px;
            margin-top: 0;
          }
          .estrategia-wrapper h1 .g {
            background: linear-gradient(120deg, var(--accent), var(--accent-soft));
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .estrategia-wrapper .lead {
            font-size: clamp(18px, 2.4vw, 22px);
            color: var(--text-2);
            max-width: 620px;
            line-height: 1.6;
          }
          .estrategia-wrapper .cover-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 14px 40px;
            margin-top: 48px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--text-muted);
          }
          .estrategia-wrapper .cover-meta b { color: var(--text-2); font-weight: 500; }

          .estrategia-wrapper .index {
            padding: 44px 0 8px;
          }
          .estrategia-wrapper .index ol {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            padding: 0;
            margin: 0;
          }
          .estrategia-wrapper .index a {
            display: flex;
            gap: 12px;
            padding: 18px 20px;
            background: var(--surface);
            color: var(--text-2);
            text-decoration: none;
            font-size: 14px;
            transition: background .2s, color .2s;
            align-items: baseline;
          }
          .estrategia-wrapper .index a:hover { background: var(--surface-2); color: var(--accent); }
          .estrategia-wrapper .index a .n { font-family:'JetBrains Mono',monospace; font-size:12px; color: var(--accent); }

          .estrategia-wrapper section.block {
            padding: 68px 0;
            border-top: 1px solid var(--border);
            scroll-margin-top: 20px;
            margin: 0;
          }
          .estrategia-wrapper .sec-head {
            display: flex;
            align-items: baseline;
            gap: 18px;
            margin-bottom: 34px;
          }
          .estrategia-wrapper .sec-num {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--accent);
            letter-spacing: 1px;
            padding-top: 6px;
            flex-shrink: 0;
          }
          .estrategia-wrapper h2 {
            font-size: clamp(28px, 4.4vw, 42px);
            font-weight: 800;
            letter-spacing: -1.2px;
            line-height: 1.1;
            text-wrap: balance;
            margin: 0;
          }
          .estrategia-wrapper .sec-sub {
            font-size: 18px;
            color: var(--text-2);
            max-width: 640px;
            margin-top: 14px;
          }
          .estrategia-wrapper p { color: var(--text-2); margin: 0; }
          .estrategia-wrapper p + p { margin-top: 14px; }
          .estrategia-wrapper strong { color: var(--text); font-weight: 700; }

          .estrategia-wrapper .quote {
            border-left: 3px solid var(--accent);
            background: linear-gradient(90deg, var(--accent-glow), transparent 80%);
            padding: 26px 30px;
            border-radius: 0 14px 14px 0;
            margin-top: 8px;
          }
          .estrategia-wrapper .quote .say {
            font-size: clamp(20px, 3vw, 27px);
            font-weight: 700;
            color: var(--text);
            letter-spacing: -0.5px;
            line-height: 1.3;
          }
          .estrategia-wrapper .quote .not {
            margin-top: 16px;
            font-size: 15px;
            color: var(--text-muted);
            text-decoration: line-through;
            text-decoration-color: var(--accent);
          }

          .estrategia-wrapper .metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin: 8px 0 34px;
          }
          .estrategia-wrapper .metric {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 26px 24px;
          }
          .estrategia-wrapper .metric .big {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 40px;
            color: var(--accent);
            line-height: 1;
            letter-spacing: -1px;
          }
          .estrategia-wrapper .metric p { font-size: 14px; margin-top: 12px; color: var(--text-2); }

          .estrategia-wrapper .pains { list-style: none; display: grid; gap: 2px; padding: 0; margin: 0; }
          .estrategia-wrapper .pains li {
            display: flex; gap: 16px; align-items: flex-start;
            padding: 18px 22px;
            background: var(--surface);
            border: 1px solid var(--border);
            font-size: 16px; color: var(--text-2);
          }
          .estrategia-wrapper .pains li:first-child { border-radius: 12px 12px 0 0; }
          .estrategia-wrapper .pains li:last-child { border-radius: 0 0 12px 12px; }
          .estrategia-wrapper .pains li + li { border-top: none; }
          .estrategia-wrapper .pains .x { color: var(--accent); font-weight: 700; font-size: 20px; line-height: 1.4; flex-shrink: 0; }

          .estrategia-wrapper .checks { list-style: none; display: grid; gap: 14px; margin-top: 6px; padding: 0; margin: 0;}
          .estrategia-wrapper .checks li { display: flex; gap: 14px; font-size: 17px; color: var(--text-2); align-items: flex-start; }
          .estrategia-wrapper .checks li b { color: var(--text); }
          .estrategia-wrapper .checks .c {
            flex-shrink: 0; width: 22px; height: 22px; margin-top: 3px;
            border-radius: 6px; background: var(--accent-glow);
            border: 1px solid var(--accent);
            display: flex; align-items: center; justify-content: center;
            color: var(--accent); font-size: 13px; font-weight: 700;
          }

          .estrategia-wrapper .products { display: grid; gap: 18px; }
          .estrategia-wrapper .product {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 34px;
            position: relative;
            overflow: hidden;
            transition: border-color .25s, transform .25s;
          }
          .estrategia-wrapper .product:hover { border-color: var(--border-strong); transform: translateY(-3px); }
          .estrategia-wrapper .product.hero { border: 1.5px solid var(--accent); background: linear-gradient(135deg, var(--accent-glow), transparent 60%); }
          .estrategia-wrapper .product .tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
            color: var(--accent); margin-bottom: 12px;
          }
          .estrategia-wrapper .product h3 { font-size: 25px; font-weight: 800; letter-spacing: -0.6px; margin-bottom: 8px; margin-top:0; }
          .estrategia-wrapper .product .role { color: var(--text-muted); font-size: 14px; margin-bottom: 22px; }
          .estrategia-wrapper .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
          .estrategia-wrapper .chip {
            font-size: 13px; padding: 7px 13px; border-radius: 100px;
            background: var(--surface-2); border: 1px solid var(--border-strong);
            color: var(--text-2);
          }
          .estrategia-wrapper .objective {
            display: flex; gap: 10px; align-items: baseline;
            border-top: 1px dashed var(--border-strong); padding-top: 18px;
            font-size: 15px; color: var(--text);
          }
          .estrategia-wrapper .objective .lbl { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:1px; color: var(--accent); text-transform: uppercase; flex-shrink:0; }

          .estrategia-wrapper .funnel { display: grid; gap: 12px; counter-reset: step; }
          .estrategia-wrapper .step {
            display: grid; grid-template-columns: 52px 1fr; gap: 20px;
            align-items: center;
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 14px; padding: 20px 24px;
            position: relative;
          }
          .estrategia-wrapper .step .sn {
            width: 42px; height: 42px; border-radius: 10px;
            border: 1.5px solid var(--accent); color: var(--accent);
            font-family:'JetBrains Mono',monospace; font-weight:700; font-size: 17px;
            display:flex; align-items:center; justify-content:center;
          }
          .estrategia-wrapper .step h4 { font-size: 18px; font-weight: 700; margin-bottom: 3px; margin-top:0; }
          .estrategia-wrapper .step p { font-size: 14px; color: var(--text-muted); margin: 0; }

          .estrategia-wrapper .talk { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 30px; }
          .estrategia-wrapper .talk-col { border-radius: 16px; padding: 28px; border: 1px solid var(--border); }
          .estrategia-wrapper .talk-col.yes { background: linear-gradient(160deg, var(--accent-glow), transparent 70%); border-color: var(--accent); }
          .estrategia-wrapper .talk-col.no { background: var(--surface); }
          .estrategia-wrapper .talk-col h4 {
            font-family:'JetBrains Mono',monospace; font-size: 12px; letter-spacing: 1.5px;
            text-transform: uppercase; margin-bottom: 18px; display:flex; gap:8px; align-items:center; margin-top:0;
          }
          .estrategia-wrapper .talk-col.yes h4 { color: var(--accent); }
          .estrategia-wrapper .talk-col.no h4 { color: var(--text-muted); }
          .estrategia-wrapper .talk-col ul { list-style: none; display: grid; gap: 11px; padding:0; margin:0;}
          .estrategia-wrapper .talk-col li { font-size: 15.5px; display: flex; gap: 10px; align-items: flex-start; }
          .estrategia-wrapper .talk-col.yes li { color: var(--text); }
          .estrategia-wrapper .talk-col.no li { color: var(--text-muted); }
          .estrategia-wrapper .talk-col.no li span:last-child { text-decoration: line-through; text-decoration-color: var(--bad); }
          .estrategia-wrapper .talk-col .mk { flex-shrink: 0; font-weight: 700; }
          .estrategia-wrapper .talk-col.yes .mk { color: var(--accent); }
          .estrategia-wrapper .talk-col.no .mk { color: var(--bad); }

          .estrategia-wrapper .angles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .estrategia-wrapper .angle {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 14px; padding: 22px 24px;
          }
          .estrategia-wrapper .angle .ah { font-weight: 700; font-size: 16px; color: var(--text); margin-bottom: 6px; }
          .estrategia-wrapper .angle .ap { font-size: 14px; color: var(--text-muted); }

          .estrategia-wrapper .road { display: grid; gap: 14px; }
          .estrategia-wrapper .road-row {
            display: grid; grid-template-columns: 130px 1fr; gap: 24px;
            border: 1px solid var(--border); border-radius: 14px;
            background: var(--surface); padding: 22px 26px; align-items: baseline;
          }
          .estrategia-wrapper .road-row .wk {
            font-family:'JetBrains Mono',monospace; font-size: 12px; letter-spacing:1px;
            color: var(--accent); text-transform: uppercase;
          }
          .estrategia-wrapper .road-row .rt { font-weight: 700; font-size: 17px; margin-bottom: 4px; }
          .estrategia-wrapper .road-row .rd { font-size: 14px; color: var(--text-muted); }

          .estrategia-wrapper footer {
            border-top: 1px solid var(--border);
            padding: 50px 0 70px;
            margin-top: 40px;
          }
          .estrategia-wrapper footer .fnote {
            font-family:'JetBrains Mono',monospace; font-size: 12px; color: var(--text-muted);
            letter-spacing: 0.5px; line-height: 1.8;
          }
          .estrategia-wrapper footer .big-cta {
            font-size: clamp(24px, 4vw, 36px); font-weight: 800; letter-spacing: -1px;
            margin-bottom: 24px; text-wrap: balance;
          }
          .estrategia-wrapper footer .big-cta .g {
            background: linear-gradient(120deg, var(--accent), var(--accent-soft));
            -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          }

          @media (max-width: 720px) {
            .estrategia-wrapper .wrap { padding: 0 20px; }
            .estrategia-wrapper .index ol { grid-template-columns: 1fr; }
            .estrategia-wrapper .metrics { grid-template-columns: 1fr; }
            .estrategia-wrapper .talk { grid-template-columns: 1fr; }
            .estrategia-wrapper .angles { grid-template-columns: 1fr; }
            .estrategia-wrapper .road-row { grid-template-columns: 1fr; gap: 8px; }
            .estrategia-wrapper .cover { padding: 90px 0 50px; }
            .estrategia-wrapper .sec-head { flex-direction: column; gap: 8px; }
          }
        `}</style>

        <button className="toggle mono" onClick={toggleTheme}>☀ / ☾ TEMA</button>

        <div className="wrap">
          {/* COVER */}
          <header className="cover">
            <div className="brandrow">
              <img src="https://lightgrey-penguin-300079.hostingersite.com/wp-content/uploads/2026/01/LOGO-OUTGRID.png" alt="OUTGRID" />
              <div className="sep"></div>
              <span className="kicker">Documento interno · Base do projeto</span>
            </div>
            <span className="eyebrow">Acelerador de Vendas</span>
            <h1>A estratégia que faz a loja <span className="g">vender mais carros</span> pela internet.</h1>
            <p className="lead">Base estratégica do projeto de mentoria: posicionamento, promessa, produtos, comunicação e funil. É daqui que saem a landing page, os anúncios e todo o conteúdo.</p>
            <div className="cover-meta">
              <span>PROJETO&nbsp;&nbsp;<b>Acelerador de Vendas · OUTGRID</b></span>
              <span>NICHO&nbsp;&nbsp;<b>Lojas de veículos / seminovos</b></span>
              <span>DATA&nbsp;&nbsp;<b>Jul / 2026</b></span>
            </div>
          </header>

          {/* INDEX */}
          <nav className="index" aria-label="Índice">
            <ol>
              <li><a href="#s0"><span className="n">00</span> Visão geral</a></li>
              <li><a href="#s1"><span className="n">01</span> Para quem é</a></li>
              <li><a href="#s2"><span className="n">02</span> Posicionamento</a></li>
              <li><a href="#s3"><span className="n">03</span> Promessa</a></li>
              <li><a href="#s4"><span className="n">04</span> Os 3 produtos</a></li>
              <li><a href="#s5"><span className="n">05</span> Como funciona</a></li>
              <li><a href="#s6"><span className="n">06</span> Comunicação</a></li>
              <li><a href="#s7"><span className="n">07</span> Ângulos de conteúdo</a></li>
              <li><a href="#s8"><span className="n">08</span> Primeiros 30 dias</a></li>
            </ol>
          </nav>

          {/* 00 VISÃO */}
          <section className="block" id="s0">
            <div className="sec-head">
              <span className="sec-num">00</span>
              <div><h2>A ideia central em uma frase</h2></div>
            </div>
            <p>O Acelerador de Vendas é a frente de mentoria e estratégia do OUTGRID para <strong>lojas de veículos que querem vender mais carros todo mês</strong> usando o digital — sem depender só dos portais.</p>
            <p>Não vendemos “projeto de tecnologia”. Vendemos <strong>carros vendidos</strong>. Tudo o que fazemos — campanha, leads e plataforma — existe para colocar mais oportunidades na mesa do vendedor e fechar mais negócios. Essa é a sensação que o dono da loja precisa ter:</p>
            <div className="quote">
              <div className="say">“O OUTGRID vai montar uma estratégia para a minha loja vender mais carros.”</div>
              <div className="not">Não: “O OUTGRID vai transformar a minha empresa.”</div>
            </div>
          </section>

          {/* 01 PARA QUEM */}
          <section className="block" id="s1">
            <div className="sec-head">
              <span className="sec-num">01</span>
              <div>
                <h2>Para quem é — e o que tira o sono dele</h2>
                <p className="sec-sub">Dono e gestor de loja de veículos / seminovos que já vende, mas sente que perde oportunidade todos os dias.</p>
              </div>
            </div>

            <div className="metrics">
              <div className="metric">
                <div className="big">70%</div>
                <p>dos leads chegam fora do horário comercial — a loja fecha às 18h e o cliente só começa a procurar carro depois.</p>
              </div>
              <div className="metric">
                <div className="big">18h+</div>
                <p>é quando o cliente entra no site, manda mensagem e pergunta preço. Quem responder primeiro, vende.</p>
              </div>
              <div className="metric">
                <div className="big">1º</div>
                <p>a responder leva o carro. O lead esfria em minutos e vai para o concorrente que atendeu na hora.</p>
              </div>
            </div>

            <p style={{marginBottom:'22px',color:'var(--text-muted)',fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',textTransform:'uppercase'}}>Os desafios que ele enfrenta hoje</p>
            <ul className="pains">
              <li><span className="x">×</span> Recebe poucos leads e o movimento depende do dia.</li>
              <li><span className="x">×</span> Os leads que chegam vêm desqualificados — curioso, sem perfil, sem intenção real de compra.</li>
              <li><span className="x">×</span> Depende de portais, OLX e Marketplace: quem constrói a marca são eles, não a loja.</li>
              <li><span className="x">×</span> Os vendedores não respondem a tempo e deixam a oportunidade esfriar.</li>
              <li><span className="x">×</span> Já contratou agência e “não funcionou” — teve post bonito, mas não teve carro vendido.</li>
            </ul>
          </section>

          {/* 02 POSICIONAMENTO */}
          <section className="block" id="s2">
            <div className="sec-head">
              <span className="sec-num">02</span>
              <div>
                <h2>Posicionamento</h2>
                <p className="sec-sub">Como o mercado precisa enxergar o OUTGRID.</p>
              </div>
            </div>
            <ul className="checks">
              <li><span className="c">→</span><span><b>Especialista em aceleração de vendas</b> para lojas de veículos.</span></li>
              <li><span className="c">→</span><span>Estratégias para <b>vender mais carros através do digital</b>.</span></li>
              <li><span className="c">→</span><span><b>Geração de leads qualificados</b> e aumento da conversão.</span></li>
            </ul>
          </section>

          {/* 03 PROMESSA */}
          <section className="block" id="s3">
            <div className="sec-head">
              <span className="sec-num">03</span>
              <div>
                <h2>Promessa</h2>
                <p className="sec-sub">O que o dono da loja ganha ao trabalhar com o OUTGRID.</p>
              </div>
            </div>
            <ul className="checks">
              <li><span className="c">✓</span><span><b>Venda mais carros</b> todos os meses.</span></li>
              <li><span className="c">✓</span><span><b>Mais oportunidades qualificadas</b> chegando na equipe.</span></li>
              <li><span className="c">✓</span><span><b>Pare de depender</b> apenas dos portais.</span></li>
            </ul>
          </section>

          {/* 04 PRODUTOS */}
          <section className="block" id="s4">
            <div className="sec-head">
              <span className="sec-num">04</span>
              <div>
                <h2>Os 3 produtos do Acelerador</h2>
                <p className="sec-sub">Três frentes que trabalham juntas: montar a estratégia, gerar as oportunidades e converter em venda.</p>
              </div>
            </div>

            <div className="products">
              <div className="product hero">
                <div className="tag">Produto 1 · O cérebro</div>
                <h3>Acelerador de Vendas</h3>
                <p className="role">A estratégia por trás de tudo — a campanha que realmente vende carros.</p>
                <div className="chips">
                  <span className="chip">Diagnóstico da operação comercial</span>
                  <span className="chip">Planejamento da campanha</span>
                  <span className="chip">Definição da oferta</span>
                  <span className="chip">Estruturação do funil de vendas</span>
                  <span className="chip">Estratégia de conversão dos leads</span>
                  <span className="chip">Plano de ação de 30 dias</span>
                </div>
                <div className="objective"><span className="lbl">Objetivo</span><span>Criar uma campanha que realmente vende carros.</span></div>
              </div>

              <div className="product">
                <div className="tag">Produto 2 · O combustível</div>
                <h3>Geração de Leads</h3>
                <p className="role">Colocar oportunidades qualificadas na mesa da equipe comercial.</p>
                <div className="chips">
                  <span className="chip">Meta Ads</span>
                  <span className="chip">Google Ads</span>
                  <span className="chip">Landing Pages</span>
                  <span className="chip">Captação de leads qualificados</span>
                  <span className="chip">Otimização das campanhas</span>
                </div>
                <div className="objective"><span className="lbl">Objetivo</span><span>Colocar oportunidades na mesa do comercial.</span></div>
              </div>

              <div className="product">
                <div className="tag">Produto 3 · A máquina</div>
                <h3>OUTGRID</h3>
                <p className="role">A plataforma de vendas que transforma visitante em lead e lead em venda.</p>
                <div className="chips">
                  <span className="chip">Plataforma de vendas</span>
                  <span className="chip">Página dos veículos</span>
                  <span className="chip">Site do vendedor</span>
                  <span className="chip">IA de atendimento</span>
                  <span className="chip">Integração com estoque</span>
                  <span className="chip">Ferramentas de conversão</span>
                </div>
                <div className="objective"><span className="lbl">Objetivo</span><span>Transformar visitantes em leads e leads em vendas.</span></div>
              </div>
            </div>
          </section>

          {/* 05 FUNIL */}
          <section className="block" id="s5">
            <div className="sec-head">
              <span className="sec-num">05</span>
              <div>
                <h2>Como funciona — o caminho até a venda</h2>
                <p className="sec-sub">Do anúncio até o carro vendido, com a máquina trabalhando inclusive fora do horário comercial.</p>
              </div>
            </div>
            <div className="funnel">
              <div className="step"><span className="sn">1</span><div><h4>Anúncio que atrai o comprador certo</h4><p>Meta Ads e Google Ads mirando quem está procurando carro na região.</p></div></div>
              <div className="step"><span className="sn">2</span><div><h4>Qualificação antes do vendedor</h4><p>Aplicação / quiz e landing page filtram o curioso e passam só o lead com perfil de compra.</p></div></div>
              <div className="step"><span className="sn">3</span><div><h4>Página do veículo e do vendedor</h4><p>O lead vê o carro, o preço e fala com a loja — no site que é seu, não no portal.</p></div></div>
              <div className="step"><span className="sn">4</span><div><h4>IA de atendimento responde na hora</h4><p>Atende no minuto que o lead chega — inclusive às 22h — e segura a oportunidade até o vendedor assumir.</p></div></div>
              <div className="step"><span className="sn">5</span><div><h4>Vendedor fecha o negócio</h4><p>Recebe leads quentes e organizados, com plano de conversão para transformar contato em carro vendido.</p></div></div>
            </div>
          </section>

          {/* 06 COMUNICAÇÃO */}
          <section className="block" id="s6">
            <div className="sec-head">
              <span className="sec-num">06</span>
              <div>
                <h2>Comunicação — as palavras importam</h2>
                <p className="sec-sub">O dono de loja quer vender carro, não “transformar a empresa”. Toda copy passa por este filtro.</p>
              </div>
            </div>
            <div className="talk">
              <div className="talk-col yes">
                <h4>✓ Falar</h4>
                <ul>
                  <li><span className="mk">›</span><span>Vender mais carros</span></li>
                  <li><span className="mk">›</span><span>Mais leads qualificados</span></li>
                  <li><span className="mk">›</span><span>Mais oportunidades</span></li>
                  <li><span className="mk">›</span><span>Melhor conversão</span></li>
                  <li><span className="mk">›</span><span>Funil de vendas</span></li>
                  <li><span className="mk">›</span><span>Campanhas que geram resultado</span></li>
                  <li><span className="mk">›</span><span>Estratégia para vender mais</span></li>
                </ul>
              </div>
              <div className="talk-col no">
                <h4>× Não falar</h4>
                <ul>
                  <li><span className="mk">×</span><span>Transformação digital</span></li>
                  <li><span className="mk">×</span><span>Reestruturação da operação</span></li>
                  <li><span className="mk">×</span><span>Consultoria empresarial</span></li>
                  <li><span className="mk">×</span><span>Gestão operacional</span></li>
                  <li><span className="mk">×</span><span>Ecossistema</span></li>
                </ul>
              </div>
            </div>
            <div className="quote">
              <div className="say">A régua: se a frase não deixa claro que a loja vai <em>vender mais carros</em>, ela não entra.</div>
            </div>
          </section>

          {/* 07 ÂNGULOS */}
          <section className="block" id="s7">
            <div className="sec-head">
              <span className="sec-num">07</span>
              <div>
                <h2>Ângulos de conteúdo e anúncio</h2>
                <p className="sec-sub">Ganchos prontos para criativos, LP e conteúdo — cada um nasce de uma dor real da seção 01.</p>
              </div>
            </div>
            <div className="angles">
              <div className="angle"><div className="ah">“Sua loja fechou às 18h. Seu cliente começou a procurar carro agora.”</div><div className="ap">Dor: 70% dos leads fora do horário. Solução: IA que atende na hora.</div></div>
              <div className="angle"><div className="ah">“Pare de depender dos portais.”</div><div className="ap">Dor: refém de OLX/Marketplace. Solução: canal e marca próprios.</div></div>
              <div className="angle"><div className="ah">“Chega de lead curioso. Quero comprador.”</div><div className="ap">Dor: leads desqualificados. Solução: funil que filtra antes do vendedor.</div></div>
              <div className="angle"><div className="ah">“Seu vendedor demorou. O concorrente vendeu.”</div><div className="ap">Dor: resposta lenta. Solução: atendimento imediato + leads organizados.</div></div>
              <div className="angle"><div className="ah">“Já contratou agência e só veio post bonito?”</div><div className="ap">Dor: agência sem resultado. Solução: campanha medida em carros vendidos.</div></div>
              <div className="angle"><div className="ah">“Quer vender 50 a 70 carros por mês?”</div><div className="ap">Aplicação/quiz de qualificação como porta de entrada do funil.</div></div>
            </div>
          </section>

          {/* 08 30 DIAS */}
          <section className="block" id="s8">
            <div className="sec-head">
              <span className="sec-num">08</span>
              <div>
                <h2>Primeiros 30 dias do projeto</h2>
                <p className="sec-sub">O plano de ação para tirar o Acelerador do papel — o que construímos a seguir.</p>
              </div>
            </div>
            <div className="road">
              <div className="road-row"><span className="wk">Semana 1</span><div><div className="rt">Base + oferta</div><div className="rd">Fechar posicionamento, definir a oferta do Acelerador e a promessa de cada produto.</div></div></div>
              <div className="road-row"><span className="wk">Semana 2</span><div><div className="rt">Landing page</div><div className="rd">Adaptar o site OUTGRID para o novo foco: copy nova, funil de captação e reunião como CTA.</div></div></div>
              <div className="road-row"><span className="wk">Semana 3</span><div><div className="rt">Funil + criativos</div><div className="rd">Montar a aplicação/quiz de qualificação e os anúncios (estilo AEG) para Meta e Google.</div></div></div>
              <div className="road-row"><span className="wk">Semana 4</span><div><div className="rt">No ar e otimizando</div><div className="rd">Subir campanhas, medir leads qualificados e conversão, ajustar oferta e criativos.</div></div></div>
            </div>
          </section>

          {/* 09 CHECKLISTS */}
          <section className="block" id="s9">
            <div className="sec-head">
              <span className="sec-num">09</span>
              <div>
                <h2>Checklists de Objetivos</h2>
                <p className="sec-sub">Passo a passo prático para execução das etapas da estratégia.</p>
              </div>
            </div>
            
            <div className="road">
              <div className="road-row">
                <span className="wk">Oferta</span>
                <div>
                  <div className="rt">Posicionamento & Copy</div>
                  <ul className="list-none space-y-2 mt-4 text-[#C1C1C1]">
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Definir ICP (Perfil de Cliente Ideal) da loja</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Escrever os ganchos principais (ex: Pare de depender dos portais)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Estruturar a promessa de valor do funil</li>
                  </ul>
                </div>
              </div>

              <div className="road-row">
                <span className="wk">Captação</span>
                <div>
                  <div className="rt">Funil & LP</div>
                  <ul className="list-none space-y-2 mt-4 text-[#C1C1C1]">
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Criar landing page otimizada (mobile first)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Configurar formulário de qualificação (Quiz)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Instalar pixels de rastreamento (Meta/Google)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Configurar eventos de conversão no site</li>
                  </ul>
                </div>
              </div>

              <div className="road-row">
                <span className="wk">Tráfego</span>
                <div>
                  <div className="rt">Campanhas & Anúncios</div>
                  <ul className="list-none space-y-2 mt-4 text-[#C1C1C1]">
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Gravar vídeos curtos seguindo os ângulos (Sec 07)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Subir campanha no Meta Ads (foco em Lead)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Subir campanha no Google Ads (fundo de funil)</li>
                    <li className="flex items-start gap-2"><span className="text-orange-primary">☐</span> Acompanhar CPL e taxa de conversão diária</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 10 LINKS GERAIS */}
          <section className="block" id="s10">
            <div className="sec-head">
              <span className="sec-num">10</span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2>Links & Referências</h2>
                  <p className="sec-sub">Links úteis, benchmarks e referências gerais do projeto.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--surface-2)] rounded-xl border border-[var(--border)] p-4 md:p-6 mt-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input 
                  type="text"
                  placeholder="Título do link (ex: Referência gringa)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <input 
                  type="url"
                  placeholder="URL (ex: https://...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <button
                  onClick={handleAddLink}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-primary hover:bg-[#FF7043] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>

              {links.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {links.map((link) => (
                    <div key={link.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 group relative pr-12">
                      <h4 className="text-[var(--text)] font-bold mb-2 pr-4 truncate">{link.title}</h4>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-primary hover:text-[#FF7043] text-sm flex items-center gap-1.5 transition-colors truncate"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span className="truncate">{link.url}</span>
                      </a>
                      
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-500/10"
                        title="Remover link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--text-soft)] text-sm border-2 border-dashed border-[var(--border)] rounded-lg">
                  Nenhum link adicionado ainda. Use os campos acima para salvar suas referências.
                </div>
              )}
            </div>
          </section>

          {/* 11 MOODBOARD */}
          <section className="block" id="s11">
            <div className="sec-head">
              <span className="sec-num">11</span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2>Moodboard & Referências</h2>
                  <p className="sec-sub">Imagens, criativos e referências visuais para manter a identidade alinhada.</p>
                </div>
                <div className="shrink-0">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-primary hover:bg-[#FF7043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4" />
                    )}
                    {isUploading ? 'Enviando...' : 'Adicionar Imagem'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 auto-rows-[200px]">
              {images.map((img, idx) => (
                <div 
                  key={img.id} 
                  className={`rounded-xl overflow-hidden bg-black-main relative group cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="big-cta">Tudo neste documento existe para uma coisa: <span className="g">a loja vender mais carros.</span></div>
            <div className="fnote">
              OUTGRID · Acelerador de Vendas — Base estratégica<br/>
              Documento vivo · atualizar conforme a oferta e os criativos evoluem · Jul / 2026
            </div>
          </footer>

        </div>
      </div>
      
      {/* Lightbox / Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-orange-primary transition-colors bg-black/50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Moodboard Zoom" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </ProtectedPage>
  );
}
