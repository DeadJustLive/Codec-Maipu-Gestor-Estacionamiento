import { motion } from 'framer-motion';
import { User, Shield, Users, Eye, Settings, BarChart3, Crown } from 'lucide-react';
import Mermaid from '../Mermaid';

export default function Slide3() {
  const actors = [
    { role: 'Conductor', icon: User, desc: 'Estudiantes y docentes que estacionan', app: 'PWA', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { role: 'Guardia', icon: Shield, desc: 'Verifica espacios y tarjetas en terreno', app: 'PWA', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { role: 'Digitador', icon: Users, desc: 'Registra conductores y asigna espacios', app: 'PWA', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { role: 'Jefe Seguridad', icon: Eye, desc: 'Supervisa ocupaci\u00f3n en vivo', app: 'PWA', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { role: 'Jefe Serv. Grales.', icon: Settings, desc: 'Gesti\u00f3n de espacios y reportes', app: 'PWA', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { role: 'Jefe Serv. Digitales', icon: BarChart3, desc: 'Supervisa plataforma e integraciones', app: 'PWA', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { role: 'Directivo', icon: Crown, desc: 'Visi\u00f3n global y KPIs estrat\u00e9gicos', app: 'PWA', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  const chart = `
graph LR
    subgraph Actores
        A[Conductor]
        B[Guardia]
        C[Digitador]
        D[Jefe Seg]
        E[Jefe SG]
        F[Jefe SD]
        G[Directivo]
    end
    subgraph Plataforma
        PWA[PWA Única<br/>React + Vite + Tailwind]
    end
    A -->|RLS| PWA
    B -->|RLS| PWA
    C -->|RLS| PWA
    D -->|RLS| PWA
    E -->|RLS| PWA
    F -->|RLS| PWA
    G -->|RLS| PWA
  `;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-cyan-500" />
          <span className="text-cyan-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Actores</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-cyan-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">Actores y Roles</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          7 roles definidos con permisos granulares mediante RBAC + RLS en PostgreSQL.
        </p>
      </motion.div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full lg:w-2/3">
          {actors.map(({ role, icon: Icon, desc, app, color, bg, border }, i) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className={`slide-card ${bg} border ${border} flex items-center gap-3 sm:gap-4 text-left hover:bg-white/5 transition-all p-2.5 sm:p-3 rounded-xl`}
            >
              <div className={`${bg} border ${border} rounded-xl p-2.5 sm:p-3 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm sm:text-base lg:text-lg font-bold ${color}`}>{role}</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">{desc}</p>
                <span className={`inline-block mt-1 text-[9px] sm:text-[10px] font-mono ${color} opacity-60`}>{app}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full lg:w-1/3 flex items-center justify-center mt-6 lg:mt-0"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full">
            <Mermaid chart={chart} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
