import { motion } from 'framer-motion';
import { Users, Car, EyeOff, ClipboardX } from 'lucide-react';

export default function Slide1() {
  const problems = [
    { icon: Users, title: '11.000+ personas', desc: '33 carreras, cientos de docentes y administrativos conviviendo en el campus m\u00e1s extenso de Duoc UC Santiago.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { icon: Car, title: 'Solo 110 espacios', desc: 'Capacidad limitada frente a la demanda. Sin criterios objetivos de asignaci\u00f3n, el acceso es por orden de llegada sin control.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: EyeOff, title: 'Sin visibilidad en vivo', desc: 'La barrera automatizada solo valida acceso con chip, pero no genera datos. Nadie sabe en tiempo real cu\u00e1ntos espacios libres hay.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: ClipboardX, title: 'Sin trazabilidad', desc: 'No hay registro de qui\u00e9n estaciona, en qu\u00e9 espacio, por cu\u00e1nto tiempo. Las infracciones no se pueden auditar.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 lg:mb-8 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
          <span className="text-blue-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Contexto y Problema</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">Situaci&oacute;n Actual</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          El estacionamiento del campus opera con un sistema ciego: barrera con chip que no genera datos, sin asignaci&oacute;n previa ni trazabilidad.
        </p>
      </motion.div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
          {problems.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="slide-card bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm flex items-start gap-2.5 sm:gap-3 lg:gap-4 text-left"
            >
              <div className={`slide-card-icon ${bg} border ${border} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 ${color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base lg:text-xl font-bold text-white mb-0.5 sm:mb-1">{title}</h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 sm:mt-6 w-full max-w-3xl"
      >
        <div className="bg-gradient-to-r from-blue-950/30 via-slate-900/30 to-blue-950/30 border border-blue-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm">
          <p className="text-xs sm:text-sm lg:text-base text-slate-300">
            Nuestra soluci&oacute;n: un sistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 font-bold">h&iacute;brido f&iacute;sico+digital</span> con
            <span className="text-blue-400 font-semibold"> tarjetas QR</span> para trazabilidad,
            <span className="text-cyan-400 font-semibold"> dashboard en vivo</span> para visibilidad y
            <span className="text-emerald-400 font-semibold"> analytics</span> para toma de decisiones.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
