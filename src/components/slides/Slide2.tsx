import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Smartphone, Monitor, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import Mermaid from '../Mermaid';

export default function Slide2() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === 'next') {
        if (step === 0) {
          e.preventDefault();
          setStep(1);
        }
      } else if (e.detail === 'prev') {
        if (step === 1) {
          e.preventDefault();
          setStep(0);
        }
      }
    };
    window.addEventListener('slideCommand', handler as EventListener);
    return () => window.removeEventListener('slideCommand', handler as EventListener);
  }, [step]);

  const layers = [
    { name: 'PWA Única', stack: 'React + Vite + PWA', desc: 'Para todos los roles operativos', icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
    { name: 'UI Filtrada', stack: 'Control por RLS', desc: 'Vistas específicas según perfil', icon: Monitor, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' },
    { name: 'Supabase', stack: 'PostgreSQL + Auth + Storage', desc: 'Backend unificado como servicio', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
    { name: 'Deploy', stack: 'Netlify + GCP / Vercel', desc: 'CDN global + serverless', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
  ];

  const principles = [
    {
      icon: Database,
      title: 'L\u00f3gica en DB',
      desc: 'C\u00e1lculos y validaciones en PostgreSQL mediante funciones, vistas y triggers. El frontend solo renderiza.',
      detail: 'Vistas materializadas para KPIs · RLS como firewall',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: Smartphone,
      title: 'Frontend Tonto',
      desc: 'La UI no procesa l\u00f3gica de negocio. Solo consume datos autorizados por RLS y los presenta.',
      detail: 'Estados isLoading · isError · isOnline en cada componente',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Globe,
      title: 'H\u00edbrido F\u00edsico+Digital',
      desc: 'Tarjetas f\u00edsicas QR vinculadas a registros digitales. QR one-time: cada tarjeta usable una sola vez.',
      detail: 'tarjetas.activa = false tras primer uso · QR escaneable desde PWA',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
  ];

  const componentChart = `
graph TB
    subgraph Frontend["PWA Única (React + Vite + Tailwind)"]
        COND[Vista Conductor]
        GUARD[Vista Guardia]
        DIGI[Vista Digitador]
        JEFE[Vista Jefes]
        ADMIN[Vista Admin]
    end
    subgraph Backend["Backend (Supabase)"]
        PG[(PostgreSQL 15)]
        SUPABASE_AUTH[Auth]
        API[REST + GraphQL]
        STO[Storage]
    end
    subgraph Cloud
        DEPLOY[Vercel]
    end
    Frontend --> API
    Frontend --> SUPABASE_AUTH
    Frontend -.->|WebSocket| PG
    Frontend --> DEPLOY
  `;

  const stepLabels = ['Topolog\u00eda', 'Principios', 'Componentes'];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950/10 to-slate-950 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-2 sm:py-3">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
          <span className="text-blue-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Arquitectura</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1">Arquitectura General</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          1 aplicación PWA, 1 backend unificado, 1 base de datos compartida.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        {stepLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all ${
              step === i
                ? i === 0
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step === i ? (i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-600'
            }`} />
            <span className="text-[10px] sm:text-xs lg:text-sm font-medium">{label}</span>
          </button>
        ))}
        <div className="hidden sm:flex items-center gap-1 text-slate-500 text-[10px]">
          {step < 2 ? (
            <><ChevronRight className="w-3 h-3" /><span>Siguiente</span></>
          ) : (
            <><ChevronLeft className="w-3 h-3" /><span>Anterior</span></>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="topology"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-5xl"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {layers.map(({ name, stack, desc, icon: Icon, color, bg, border }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`${bg} border ${border} rounded-xl p-4 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-4 text-left hover:bg-white/5 transition-colors`}
                  >
                    <div className={`${bg} border ${border} rounded-xl p-3 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-sm sm:text-base lg:text-xl font-bold ${color} mb-0.5`}>{name}</h3>
                      <div className="text-xs sm:text-sm text-slate-300 font-mono mb-1">{stack}</div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="principles"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
                {principles.map(({ icon: Icon, title, desc, detail, color, bg, border }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                    className={`${bg} border ${border} border-l-4 rounded-xl p-4 sm:p-5 lg:p-6 hover:bg-white/5 transition-colors text-left`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`${bg} border ${border} rounded-xl p-2.5 sm:p-3 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base lg:text-xl font-bold text-white mb-1 sm:mb-1.5">{title}</h4>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed mb-2">{desc}</p>
                        <div className={`${bg} border ${border} rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 inline-block`}>
                          <code className="text-[10px] sm:text-xs lg:text-sm text-slate-300 font-mono">{detail}</code>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-3xl">
                <Mermaid chart={componentChart} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
