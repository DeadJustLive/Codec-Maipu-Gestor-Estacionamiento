import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Bell, Clock, Users, Percent, Car, AlertTriangle } from 'lucide-react';

export default function Slide6() {
  const kpis = [
    { icon: Percent, title: 'Ocupaci\u00f3n', desc: 'ocupados / total * 100', color: 'text-blue-400' },
    { icon: Car, title: 'Ingresos Hoy', desc: 'COUNT WHERE DATE(entrada)=TODAY', color: 'text-emerald-400' },
    { icon: Clock, title: 'Estad\u00eda Prom.', desc: 'AVG(salida - entrada)', color: 'text-cyan-400' },
    { icon: TrendingUp, title: 'Horas Pico', desc: 'MODE(EXTRACT(HOUR))', color: 'text-amber-400' },
    { icon: Users, title: 'Recurrentes', desc: 'COUNT > N en per\u00edodo', color: 'text-violet-400' },
    { icon: BarChart3, title: 'Tasa Verif.', desc: 'verificados / total * 100', color: 'text-rose-400' },
  ];

  const alerts = [
    { icon: AlertTriangle, title: 'Capacidad Cr\u00edtica', desc: 'Ocupaci\u00f3n > 85% por +1h', color: 'text-red-400' },
    { icon: Bell, title: 'Espacio Bloqueado', desc: 'Asignaci\u00f3n activa > 8h sin verificar', color: 'text-orange-400' },
    { icon: Bell, title: 'Sin Liberaci\u00f3n', desc: 'Asignaci\u00f3n sin salida al cierre', color: 'text-amber-400' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 sm:mb-4 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-emerald-500" />
          <span className="text-emerald-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Analytics</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-emerald-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">Dashboard y KPIs</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          M&eacute;tricas en tiempo real con vistas materializadas en PostgreSQL.
        </p>
      </motion.div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-6xl mx-auto gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 w-full">
          {kpis.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 hover:bg-white/10 transition-colors text-center"
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} mx-auto mb-1`} />
              <h4 className="text-[10px] sm:text-xs font-bold text-white mb-0.5">{title}</h4>
              <p className="text-[8px] sm:text-[10px] text-slate-400 font-mono">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
        >
          <h3 className="text-xs sm:text-sm font-semibold text-slate-400 mb-2">Alertas Autom&aacute;ticas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {alerts.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 text-left hover:bg-white/10 transition-colors"
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} />
                <div>
                  <h4 className="text-[10px] sm:text-xs font-bold text-white">{title}</h4>
                  <p className="text-[8px] sm:text-[10px] text-slate-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-amber-950/20 via-slate-900/30 to-amber-950/20 border border-amber-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm w-full"
        >
          <p className="text-[10px] sm:text-xs text-slate-300">
            <span className="text-amber-400 font-bold">Proyecci&oacute;n:</span> Si ocupaci&oacute;n m&aacute;xima promedio supera 85% por 7 d&iacute;as consecutivos &rarr; Alerta de expansi&oacute;n para Directivo y Jefe SG
          </p>
        </motion.div>
      </div>
    </div>
  );
}
