import { motion } from 'framer-motion';
import { UserPlus, MapPin, Scan, LogOut, ArrowRight } from 'lucide-react';
import Mermaid from '../Mermaid';

export default function Slide5() {
  const steps = [
    { step: 1, title: 'Registro', svc: 'Conductor + Digitador', type: '\u00danica vez', icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { step: 2, title: 'Asignar Espacio', svc: 'Digitador + Sistema', type: 'Diario', icon: MapPin, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { step: 3, title: 'Verificar QR', svc: 'Guardia + App', type: 'Recorrido', icon: Scan, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { step: 4, title: 'Liberar', svc: 'Guardia + Sistema', type: 'Salida', icon: LogOut, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  ];

  const sequenceChart = `
sequenceDiagram
    participant C as Conductor
    participant D as Digitador
    participant S as Sistema
    participant DB as PostgreSQL

    C->>D: Solicita espacio
    D->>S: Selecciona vehículo
    S->>DB: asignar_espacio()
    DB->>DB: UPDATE espacio→ocupado
    DB-->>S: {espacio:A-15, QR-123}
    S-->>D: Asignado
    D->>C: Entrega tarjeta QR
  `;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-cyan-950/10 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-cyan-500" />
          <span className="text-cyan-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Flujo Operacional</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-cyan-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">Flujo Completo</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          Desde el registro del conductor hasta la liberaci&oacute;n del espacio.
        </p>
      </motion.div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto gap-4 sm:gap-6">
        <div className="flex items-stretch justify-center gap-1.5 sm:gap-2 lg:gap-4 w-full">
          {steps.map(({ step, title, svc, type, icon: Icon, color, bg, border }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              className={`slide-card ${bg} border ${border} flex flex-col items-center justify-between gap-2 sm:gap-3 text-center flex-1`}
            >
              <div className={`${bg} border ${border} rounded-xl p-2 sm:p-3 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${color}`} />
              </div>
              <div>
                <div className="text-xs sm:text-sm lg:text-base font-bold text-white mb-0.5">{title}</div>
                <div className={`text-[9px] sm:text-[10px] lg:text-xs font-mono ${color}`}>{svc}</div>
              </div>
              <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] lg:text-xs font-medium ${bg} ${border} border rounded-full ${color}`}>
                {type}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-gradient-to-r from-blue-950/30 via-slate-900/30 to-blue-950/30 border border-blue-500/20 rounded-xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm flex flex-col items-center">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">Secuencia Asignación:</h3>
            <div className="w-full max-w-lg overflow-hidden">
               <Mermaid chart={sequenceChart} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
