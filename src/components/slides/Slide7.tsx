import { useState } from 'react';
import { Shield, Lock, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import Mermaid from '../Mermaid';

export default function Slide7() {
  const [step, setStep] = useState(0);

  const policies = [
    {
      icon: Shield,
      title: 'Row Level Security',
      desc: 'Cada consulta a la base de datos pasa por RLS. Un conductor solo ve sus propias asignaciones. Un guardia ve todo el estacionamiento.',
      detail: 'CREATE POLICY conductor_self ON asignaciones FOR SELECT USING (usuario_id = auth.uid())',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Lock,
      title: 'QR One-Time',
      desc: 'Cada tarjeta f\u00edsica tiene un QR \u00fanico. Tras el primer uso, el sistema marca activa=false. Reutilizable solo tras liberaci\u00f3n.',
      detail: 'tarjetas.activa = false tras primer uso · QR impreso + digital',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icon: Database,
      title: 'RBAC + Supabase Auth',
      desc: 'Autenticaci\u00f3n unificada con Supabase Auth. 7 roles con permisos granulares. Sesiones compartidas en la PWA para todos los roles.',
      detail: 'email+password · magic link · JWT stateless',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ];

  const erdChart = `
erDiagram
    usuarios ||--o{ vehiculos : posee
    usuarios ||--o{ asignaciones : realiza
    espacios ||--o{ asignaciones : ocupa
    tarjetas ||--o{ asignaciones : identifica
    asignaciones ||--o{ infracciones : genera
    usuarios ||--o{ tickets : abre
    tickets ||--o{ mensajes_ticket : contiene
    usuarios { uuid id PK text rut text nombre text email enum rol }
    vehiculos { uuid id PK uuid usuario_id FK text patente text marca }
    espacios { uuid id PK text sector int numero enum tipo enum estado }
    tarjetas { uuid id PK text codigo uuid espacio_id FK boolean activa }
    asignaciones { uuid id PK uuid usuario_id FK uuid vehiculo_id FK uuid espacio_id FK uuid tarjeta_id FK }
    infracciones { uuid id PK uuid asignacion_id FK text patente_real enum estado }
  `;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-violet-950/10 to-slate-950 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 lg:mb-8 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-violet-500" />
          <span className="text-violet-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Seguridad</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-violet-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">Base de Datos y Seguridad</h2>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-3xl">
          RLS como &uacute;nica barrera de autorizaci&oacute;n sobre nuestro modelo relacional.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        <button onClick={() => setStep(0)} className={\`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all \${step === 0 ? 'bg-violet-500/20 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}\`}>
          <span className="text-[10px] sm:text-xs lg:text-sm font-medium">Pol&iacute;ticas</span>
        </button>
        <button onClick={() => setStep(1)} className={\`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all \${step === 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}\`}>
          <span className="text-[10px] sm:text-xs lg:text-sm font-medium">Modelo ERD</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-5xl mx-auto">
        {step === 0 ? (
          <div className="flex flex-col gap-4 sm:gap-5 w-full">
            {policies.map(({ icon: Icon, title, desc, detail, color, bg, border }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
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
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-full flex items-center justify-center bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <Mermaid chart={erdChart} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
