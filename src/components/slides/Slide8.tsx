import { motion } from 'framer-motion';
import { Wifi, WifiOff, Smartphone, ShieldCheck } from 'lucide-react';

export default function Slide8() {
  const features = [
    {
      icon: Smartphone,
      title: 'PWA Instalable',
      desc: 'Aplicaci\u00f3n m\u00f3vil sin pasar por app stores. Service worker con vite-plugin-pwa para cacheo y offline parcial.',
      detail: 'Manifest · Service Worker · Badge offline visible',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Wifi,
      title: 'NetworkFirst para API',
      desc: 'Estrategia de cach\u00e9: intenta red primero, si falla usa cach\u00e9 local. Ideal para consultas de ocupaci\u00f3n y verificaci\u00f3n.',
      detail: 'fetch event · Cache API · stale-while-revalidate',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icon: WifiOff,
      title: 'Offline Read-Only',
      desc: 'Lectura de datos desde cach\u00e9 local cuando no hay conexi\u00f3n. Las mutaciones (asignar, verificar) requieren conexi\u00f3n activa.',
      detail: 'navigator.onLine === false · Badge visible · Botones deshabilitados',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'CacheFirst para Assets',
      desc: 'Los archivos est\u00e1ticos (CSS, JS, im\u00e1genes) se sirven desde cach\u00e9 local primero. Garantiza carga instant\u00e1nea en conexiones lentas.',
      detail: 'precache · runtime cache · versionado autom\u00e1tico',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950/10 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
          <span className="text-blue-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">PWA</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">PWA y Estrategia Offline</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          Aplicaci&oacute;n m&oacute;vil progresiva con soporte offline parcial para el personal en terreno.
        </p>
      </motion.div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 w-full">
          {features.map(({ icon: Icon, title, desc, detail, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className={`slide-card ${bg} border ${border} flex flex-col items-start gap-2 sm:gap-3 text-left hover:bg-white/5 transition-colors`}
            >
              <div className={`${bg} border ${border} rounded-xl p-2.5 sm:p-3`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5">{title}</h4>
                <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed mb-1.5">{desc}</p>
                <code className="text-[9px] sm:text-[10px] text-slate-500 font-mono">{detail}</code>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
