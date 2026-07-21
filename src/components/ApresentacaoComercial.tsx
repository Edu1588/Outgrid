import { useState } from "react";
import { ProtectedPage } from "./ProtectedPage";
import { motion } from "motion/react";
import { Play, Edit3, Plus, FileText, CheckCircle2 } from "lucide-react";
import { PresentationViewer } from "./PresentationViewer";
import { PresentationEditor } from "./PresentationEditor";
import { defaultSlidesData, slideTemplates } from "./presentations/OutgridPitch";

export function ApresentacaoComercial() {
  const [showViewer, setShowViewer] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // Lifted state
  const [presentationData, setPresentationData] = useState(() => ({
    slidesData: [...defaultSlidesData],
    slidesOrder: defaultSlidesData.map((_, index) => ({ id: index, visible: true }))
  }));

  // Build the rendered slides based on current state
  const renderedSlides = presentationData.slidesOrder
    .filter(s => s.visible)
    .map(s => slideTemplates[s.id](presentationData.slidesData[s.id]));

  return (
    <ProtectedPage title="Apresentação Comercial">
      {showViewer && (
        <PresentationViewer 
          slides={renderedSlides} 
          onClose={() => setShowViewer(false)} 
        />
      )}
      {showEditor && (
        <PresentationEditor 
          presentationData={presentationData}
          onSave={(newData) => {
            setPresentationData(newData);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)} 
        />
      )}
      
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
              Suas <span className="text-orange-primary">Apresentações</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie e apresente suas propostas comerciais com impacto.
            </p>
          </div>
          <button className="mt-6 md:mt-0 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 transition-colors border border-white/10">
            <Plus className="w-5 h-5" />
            Nova Apresentação
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Default Presentation Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-primary/50 transition-colors"
          >
            <div className="aspect-video bg-[#041630] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay"></div>
              <div className="relative z-10 flex items-center scale-75">
                <h1 className="text-6xl font-black text-white tracking-tighter leading-none">OUT</h1>
                <div className="bg-[#E95800] rounded-xl px-4 py-1 ml-2">
                  <h1 className="text-6xl font-black text-white tracking-tighter leading-none">GRID</h1>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => setShowViewer(true)}>
                <button 
                  className="bg-orange-primary text-white p-4 rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(233,88,0,0.5)]"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Apresentação Padrão</h3>
                  <p className="text-gray-400 text-sm">Pitch Comercial OUTGRID</p>
                </div>
                <span className="bg-orange-primary/20 text-orange-primary text-xs font-bold px-2 py-1 rounded">
                  Padrão
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <button 
                  onClick={() => setShowViewer(true)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Apresentar
                </button>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Create New Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:border-orange-primary/50 hover:bg-white/5 transition-all cursor-pointer min-h-[320px]"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Criar Nova</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
              Monte uma apresentação personalizada para um cliente específico.
            </p>
          </motion.div>
        </div>
      </div>
    </ProtectedPage>
  );
}
