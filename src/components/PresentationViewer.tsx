import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Maximize, Minimize } from "lucide-react";

interface PresentationViewerProps {
  slides: React.ReactNode[];
  onClose: () => void;
}

export function PresentationViewer({ slides, onClose }: PresentationViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen().catch(console.error);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, onClose, isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4 bg-black/50 p-2 rounded-full backdrop-blur-sm shadow-xl">
        <button onClick={toggleFullscreen} className="text-white hover:text-orange-primary transition-colors">
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
        <button onClick={onClose} className="text-white hover:text-red-500 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden" onClick={(e) => {
        // click right side to go next, left to go prev
        const rect = e.currentTarget.getBoundingClientRect();
        if (e.clientX > rect.width / 2) {
          nextSlide();
        } else {
          prevSlide();
        }
      }}>
        <div className="w-full h-full max-w-full max-h-full aspect-video bg-[#111] relative shadow-2xl flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              {slides[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-black/70 px-6 py-2 rounded-full backdrop-blur-sm shadow-xl">
        <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} disabled={currentIndex === 0} className="text-white hover:text-orange-primary disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <span className="text-white font-mono text-sm">
          {currentIndex + 1} / {slides.length}
        </span>
        <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} disabled={currentIndex === slides.length - 1} className="text-white hover:text-orange-primary disabled:opacity-30 transition-colors">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
