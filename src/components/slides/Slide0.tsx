import { motion } from 'framer-motion';
import { Car, Shield, BarChart3, ChevronRight } from 'lucide-react';

export default function Slide0() {
  const icons = [
    { Icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    { Icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
    { Icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-20 py-6 sm:py-8 relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 50, -30, 0], y: [0, -50, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -40, 30, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-8">
          {icons.map(({ Icon, color, bg, border }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5, type: 'spring' }}
              className={`${bg} border ${border} rounded-xl sm:rounded-2xl p-3 sm:p-5`}
            >
              <Icon className={`w-8 h-8 sm:w-12 sm:h-12 ${color}`} />
            </motion.div>
          ))}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            Codec-Maipu
          </span>
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 font-light tracking-wide max-w-3xl mb-6 sm:mb-8">
          Sistema de Gesti&oacute;n de Estacionamientos &mdash; Duoc UC Maip&uacute;
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'PWA', 'Tailwind v4'].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition-colors"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm"
        >
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm sm:text-base font-medium text-slate-300">Bootcamp CODEC AI &mdash; 2026</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="mt-8 sm:mt-12 flex items-center gap-2 text-slate-500 text-xs sm:text-sm"
        >
          <span>Presiona las flechas o haz clic para navegar</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
