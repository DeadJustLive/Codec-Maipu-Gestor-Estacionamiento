import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Link2, Key, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Slide4() {
  const [step, setStep] = useState(0);
  const stepLabels = ['Tablas Core', 'L\u00f3gica en DB'];

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === 'next' && step === 0) {
        e.preventDefault();
        setStep(1);
      } else if (e.detail === 'prev' && step === 1) {
        e.preventDefault();
        setStep(0);
      }
    };
    window.addEventListener('slideCommand', handler as EventListener);
    return () => window.removeEventListener('slideCommand', handler as EventListener);
  }, [step]);

  const tables = [
    { name: 'usuarios', cols: 'RUT, nombre, email, rol, activo', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'vehiculos', cols: 'patente, marca, modelo, color, usuario_id', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { name: 'espacios', cols: 'sector, numero, tipo, estado, sede', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'tarjetas', cols: 'c\u00f3digo QR, espacio_id, activa', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { name: 'asignaciones', cols: 'usuario, vehiculo, espacio, tarjeta, entrada, salida, estado', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { name: 'infracciones', cols: 'asignacion_id, patente_real, estado', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  const sqlFunctions = [
    { icon: Database, title: 'asignar_espacio()', desc: 'Busca espacio libre, crea asignaci\u00f3n, marca el espacio como ocupado. Retorna sector, n\u00famero y c\u00f3digo de tarjeta.', detail: 'SELECT * FROM asignar_espacio(\'11.111.111-1\', \'ABCD-12\')', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: Link2, title: 'verificar_espacio()', desc: 'Recibe c\u00f3digo QR, retorna datos del conductor, patente esperada y espacio asignado. Valida que la asignaci\u00f3n est\u00e9 activa.', detail: 'SELECT * FROM verificar_espacio(\'TARJETA-001\')', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: Key, title: 'liberar_espacio()', desc: 'Marca hora de salida, libera el espacio y desactiva la tarjeta (QR one-time). Prepara todo para la pr\u00f3xima asignaci\u00f3n.', detail: 'SELECT * FROM liberar_espacio(\'TARJETA-001\')', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 sm:mb-4 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-emerald-500" />
          <span className="text-emerald-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Modelo de Datos</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-emerald-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">Base de Datos Compartida</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          6 tablas core + funciones SQL + vistas materializadas. Toda la l&oacute;gica en PostgreSQL.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        {stepLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all ${
              step === i
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full transition-colors ${step === i ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <span className="text-[10px] sm:text-xs lg:text-sm font-medium">{label}</span>
          </button>
        ))}
        <div className="hidden sm:flex items-center gap-1 text-slate-500 text-[10px]">
          {step === 0 ? <><ChevronRight className="w-3 h-3" /><span>Siguiente</span></> : <><ChevronLeft className="w-3 h-3" /><span>Anterior</span></>}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {tables.map((tb, i) => (
                  <motion.div
                    key={tb.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                    className={`slide-card ${tb.bg} border ${tb.border} hover:bg-white/5 transition-all text-left`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5">
                      <Database className={`w-4 h-4 sm:w-5 sm:h-5 ${tb.color}`} />
                      <span className={`text-xs sm:text-sm lg:text-base font-bold ${tb.color} font-mono`}>{tb.name}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed">{tb.cols}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {sqlFunctions.map(({ icon: Icon, title, desc, detail, color, bg, border }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                    className={`slide-card ${bg} border ${border} flex items-start gap-3 sm:gap-4 text-left`}
                  >
                    <div className={`${bg} border ${border} rounded-xl p-3 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 font-mono">{title}</h4>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed mb-2">{desc}</p>
                      <div className={`${bg} border ${border} rounded-md px-2.5 sm:px-3 py-1.5 inline-block`}>
                        <code className="text-[10px] sm:text-xs text-slate-300 font-mono">{detail}</code>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
