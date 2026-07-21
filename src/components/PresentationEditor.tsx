import { useState } from "react";
import { X, Save, GripHorizontal, Eye, EyeOff, Edit2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { slideTemplates } from "./presentations/OutgridPitch";

interface PresentationEditorProps {
  presentationData: {
    slidesData: any[];
    slidesOrder: { id: number; visible: boolean }[];
  };
  onSave: (data: any) => void;
  onClose: () => void;
}

export function PresentationEditor({ presentationData, onSave, onClose }: PresentationEditorProps) {
  const [data, setData] = useState(presentationData);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  const toggleVisibility = (index: number) => {
    setData(prev => {
      const newOrder = [...prev.slidesOrder];
      newOrder[index].visible = !newOrder[index].visible;
      return { ...prev, slidesOrder: newOrder };
    });
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setData(prev => {
        const newOrder = [...prev.slidesOrder];
        const temp = newOrder[index];
        newOrder[index] = newOrder[index - 1];
        newOrder[index - 1] = temp;
        return { ...prev, slidesOrder: newOrder };
      });
    } else if (direction === 'down' && index < data.slidesOrder.length - 1) {
      setData(prev => {
        const newOrder = [...prev.slidesOrder];
        const temp = newOrder[index];
        newOrder[index] = newOrder[index + 1];
        newOrder[index + 1] = temp;
        return { ...prev, slidesOrder: newOrder };
      });
    }
  };

  const handleUpdateSlideData = (id: number, key: string, value: any) => {
    setData(prev => {
      const newSlidesData = [...prev.slidesData];
      newSlidesData[id] = { ...newSlidesData[id], [key]: value };
      return { ...prev, slidesData: newSlidesData };
    });
  };
  
  const handleUpdateBullet = (id: number, arrayKey: string, bulletIndex: number, value: string) => {
    setData(prev => {
      const newSlidesData = [...prev.slidesData];
      const newArray = [...(newSlidesData[id][arrayKey] || [])];
      newArray[bulletIndex] = value;
      newSlidesData[id] = { ...newSlidesData[id], [arrayKey]: newArray };
      return { ...prev, slidesData: newSlidesData };
    });
  };

  if (editingSlideId !== null) {
    const slideData = data.slidesData[editingSlideId];
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111]">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingSlideId(null)} className="p-2 hover:bg-white/10 rounded-full text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white">Editando Conteúdo do Slide</h2>
          </div>
          <button onClick={() => setEditingSlideId(null)} className="bg-orange-primary hover:bg-orange-primary/90 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Concluir Edição
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Sidebar */}
          <div className="w-96 bg-[#111] border-r border-white/10 p-6 overflow-y-auto">
            <h3 className="font-bold text-white mb-6">Propriedades</h3>
            
            <div className="space-y-4">
              {Object.entries(slideData).map(([key, value]) => {
                if (typeof value === 'string') {
                  const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('bg');
                  
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        {key}
                      </label>
                      {isImage ? (
                        <div className="flex items-center gap-2">
                           <ImageIcon className="w-4 h-4 text-gray-500" />
                           <input 
                            type="text" 
                            value={value} 
                            onChange={(e) => handleUpdateSlideData(editingSlideId, key, e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-orange-primary outline-none"
                          />
                        </div>
                      ) : value.length > 50 || value.includes('<') ? (
                        <textarea 
                          value={value} 
                          onChange={(e) => handleUpdateSlideData(editingSlideId, key, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-orange-primary outline-none h-24"
                        />
                      ) : (
                        <input 
                          type="text" 
                          value={value} 
                          onChange={(e) => handleUpdateSlideData(editingSlideId, key, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-orange-primary outline-none"
                        />
                      )}
                    </div>
                  );
                } else if (Array.isArray(value) && typeof value[0] === 'string') {
                  // Bullet array
                  return (
                    <div key={key} className="space-y-2 mt-6">
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        {key} (Lista)
                      </label>
                      {value.map((bullet, i) => (
                        <textarea 
                          key={i}
                          value={bullet} 
                          onChange={(e) => handleUpdateBullet(editingSlideId, key, i, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-orange-primary outline-none h-20"
                        />
                      ))}
                    </div>
                  )
                }
                return null;
              })}
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute top-4 right-4 bg-black/50 text-white/50 px-3 py-1 rounded text-xs">Pré-visualização ao vivo</div>
            <div className="w-full aspect-video bg-black relative rounded-xl border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center">
              <div className="w-[1920px] h-[1080px] origin-center scale-[0.4] xl:scale-[0.55] 2xl:scale-[0.7]">
                {slideTemplates[editingSlideId](slideData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111]">
        <div>
          <h2 className="text-2xl font-bold text-white">Editar Apresentação</h2>
          <p className="text-gray-400">Reorganize, oculte ou edite o conteúdo de cada slide.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white px-4 py-2">
            Cancelar
          </button>
          <button onClick={() => onSave(data)} className="bg-orange-primary hover:bg-orange-primary/90 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {data.slidesOrder.map((slideMeta, i) => (
            <div key={slideMeta.id} className={`flex items-center gap-6 p-4 rounded-xl border ${slideMeta.visible ? 'bg-[#111] border-white/10' : 'bg-black border-white/5 opacity-50'}`}>
              <div className="flex flex-col gap-2">
                <button onClick={() => moveSlide(i, 'up')} disabled={i === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-30">
                  ▲
                </button>
                <GripHorizontal className="text-gray-600" />
                <button onClick={() => moveSlide(i, 'down')} disabled={i === data.slidesOrder.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-30">
                  ▼
                </button>
              </div>
              
              <div className="text-gray-500 font-mono text-xl w-8">
                {i + 1}
              </div>

              <div className="w-48 aspect-video bg-black relative overflow-hidden rounded border border-white/10 pointer-events-none">
                <div className="absolute inset-0 origin-top-left" style={{ transform: 'scale(0.2)', width: '500%', height: '500%' }}>
                  {slideTemplates[slideMeta.id](data.slidesData[slideMeta.id])}
                </div>
              </div>

              <div className="flex-1 flex items-center gap-4">
                <h4 className="text-white font-medium">Slide {slideMeta.id + 1}</h4>
                {slideMeta.visible && (
                   <button 
                     onClick={() => setEditingSlideId(slideMeta.id)}
                     className="text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors"
                   >
                     <Edit2 className="w-3 h-3" /> Editar Conteúdo
                   </button>
                )}
              </div>

              <button 
                onClick={() => toggleVisibility(i)}
                className={`p-3 rounded-full ${slideMeta.visible ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}
                title={slideMeta.visible ? "Ocultar Slide" : "Exibir Slide"}
              >
                {slideMeta.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
