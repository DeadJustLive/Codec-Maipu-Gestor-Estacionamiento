import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Eye, EyeOff } from 'lucide-react';

import Slide0 from './components/slides/Slide0';
import Slide1 from './components/slides/Slide1';
import Slide2 from './components/slides/Slide2';
import Slide3 from './components/slides/Slide3';
import Slide4 from './components/slides/Slide4';
import Slide5 from './components/slides/Slide5';
import Slide6 from './components/slides/Slide6';
import Slide7 from './components/slides/Slide7';
import Slide8 from './components/slides/Slide8';
import Slide9 from './components/slides/Slide9';
import Slide10 from './components/slides/Slide10';

const slides = [
  { id: 'Portada', component: Slide0, isMain: true },
  { id: 'Contexto', component: Slide1, isMain: true },
  { id: 'Arquitectura', component: Slide2, isMain: true },
  { id: 'Actores', component: Slide3, isMain: true },
  { id: 'Modelo de Datos', component: Slide4, isMain: true },
  { id: 'Flujo Operacional', component: Slide5, isMain: true },
  { id: 'Mapa Interactivo', component: Slide10, isMain: true },
  { id: 'Dashboard y KPIs', component: Slide6, isMain: true },
  { id: 'Seguridad', component: Slide7, isMain: true },
  { id: 'PWA y Offline', component: Slide8, isMain: true },
  { id: 'Conclusiones', component: Slide9, isMain: true },
];

function detectAspectRatio(): '4-3' | '16-9' | 'wide' {
  const ratio = window.innerWidth / window.innerHeight;
  if (ratio >= 1.2 && ratio <= 1.45) return '4-3';
  if (ratio > 1.45 && ratio <= 1.85) return '16-9';
  return 'wide';
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showHub, setShowHub] = useState(false);
  const [hiddenSlides, setHiddenSlides] = useState<Record<number, boolean>>({});

  const activeSlideIndexes = slides.map((_, i) => i).filter(i => !hiddenSlides[i]);
  const activeCount = activeSlideIndexes.length || 1;
  const currentActiveIndex = activeSlideIndexes.indexOf(currentSlide);

  const nextSlide = useCallback(() => {
    const event = new CustomEvent('slideCommand', { detail: 'next', cancelable: true });
    if (window.dispatchEvent(event)) {
      if (currentActiveIndex !== -1 && currentActiveIndex < activeCount - 1) {
        setDirection(1);
        setCurrentSlide(activeSlideIndexes[currentActiveIndex + 1]);
      } else if (currentActiveIndex === -1) {
        const nextActive = activeSlideIndexes.find(i => i > currentSlide) ?? activeSlideIndexes[activeCount - 1];
        if (nextActive !== undefined) {
          setDirection(1);
          setCurrentSlide(nextActive);
        }
      }
    }
  }, [currentActiveIndex, activeCount, activeSlideIndexes, currentSlide]);

  const prevSlide = useCallback(() => {
    const event = new CustomEvent('slideCommand', { detail: 'prev', cancelable: true });
    if (window.dispatchEvent(event)) {
      if (currentActiveIndex > 0) {
        setDirection(-1);
        setCurrentSlide(activeSlideIndexes[currentActiveIndex - 1]);
      } else if (currentActiveIndex === -1) {
        const prevActive = [...activeSlideIndexes].reverse().find(i => i < currentSlide) ?? activeSlideIndexes[0];
        if (prevActive !== undefined) {
          setDirection(-1);
          setCurrentSlide(prevActive);
        }
      }
    }
  }, [currentActiveIndex, activeSlideIndexes, currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  useEffect(() => {
    const updateAspect = () => {
      document.documentElement.setAttribute('data-aspect', detectAspectRatio());
    };
    updateAspect();
    window.addEventListener('resize', updateAspect);
    return () => window.removeEventListener('resize', updateAspect);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      } else if (e.key === 'Escape') {
        setShowHub(prev => !prev);
      }
    };

    const handleToggleHub = () => setShowHub(prev => !prev);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggleHub', handleToggleHub);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggleHub', handleToggleHub);
    };
  }, [nextSlide, prevSlide, goToSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -800 : 800,
      opacity: 0,
    }),
  };

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-y-0 left-0 z-40 cursor-pointer"
        style={{ width: '25%' }}
        onClick={prevSlide}
        role="button"
        aria-label="Diapositiva anterior"
        tabIndex={-1}
      />
      <div
        className="absolute inset-y-0 right-0 z-40 cursor-pointer"
        style={{ width: '25%' }}
        onClick={nextSlide}
        role="button"
        aria-label="Diapositiva siguiente"
        tabIndex={-1}
      />

      <AnimatePresence>
        {showHub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 sm:p-8 md:p-16 overflow-y-auto"
          >
            <div className="max-w-6xl w-full mx-auto pb-8 sm:pb-12">
              <div className="flex justify-between items-center mb-8 sm:mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2">Navegaci&oacute;n</h2>
                  <p className="text-slate-400 text-sm sm:text-lg">Selecciona una diapositiva para ir directamente.</p>
                </div>
                <button
                  onClick={() => setShowHub(false)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <span className="text-2xl sm:text-3xl leading-none font-light block -mt-1">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className="relative group">
                    <button
                      onClick={() => { goToSlide(idx); setShowHub(false); }}
                      className={`w-full p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-2xl border flex flex-col items-start gap-2 sm:gap-4 transition-all text-left group ${
                        currentSlide === idx
                          ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                      } ${hiddenSlides[idx] ? 'opacity-50 grayscale' : ''}`}
                    >
                      <span className={`text-xl sm:text-3xl lg:text-4xl font-bold transition-colors ${
                        currentSlide === idx ? 'text-blue-400/30' : 'text-white/10 group-hover:text-white/20'
                      }`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className={`text-sm sm:text-base lg:text-xl font-medium tracking-wide ${
                        currentSlide === idx ? 'text-blue-400' : 'text-slate-300'
                      }`}>
                        {slide.id}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHiddenSlides(prev => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white/50 hover:text-white transition-colors z-10"
                      title={hiddenSlides[idx] ? 'Mostrar diapositiva' : 'Ocultar diapositiva'}
                    >
                      {hiddenSlides[idx] ? <EyeOff className="w-3 h-3 sm:w-5 sm:h-5" /> : <Eye className="w-3 h-3 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((Math.max(0, currentActiveIndex) + 1) / activeCount) * 100}%` }}
        />
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-stretch gap-2 sm:gap-3 z-50">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggleHub'))}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-900/40 hover:bg-slate-800/60 border border-white/10 rounded-md sm:rounded-lg text-white/80 hover:text-white text-xs sm:text-sm transition-all backdrop-blur-md"
          title="Indice de Diapositivas (Esc)"
        >
          <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Slides</span>
        </button>
        <div className="text-white/60 text-xs sm:text-sm font-mono bg-slate-900/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-white/10 backdrop-blur-md flex items-center justify-center min-w-[2.5rem] sm:min-w-[3rem]">
          {Math.max(0, currentActiveIndex) + 1}/{activeCount}
        </div>
      </div>
    </div>
  );
}
