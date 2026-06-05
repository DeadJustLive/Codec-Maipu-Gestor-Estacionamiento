// @kind(document)
// @contract(in: contexto bootcamp -> out: decisiones arquitectónicas fundacionales)
// @scope(core)

# ADR-001: Decisiones Arquitectónicas Fundacionales

## Contexto
Bootcamp CODEC AI Duoc UC Maipu — sistema de gestión inteligente de 110 estacionamientos.
Competencia intersedes con evaluación por checkpoints. Stack abierto con recomendaciones.

## Stack Elegido vs Stack Oficial

| Capa | Oficial (sugerido) | Elegido | Justificación |
|------|--------------------|---------|---------------|
| Frontend | StitchWithGoogle | React + Vite + Tailwind + shadcn | Madurez, testing, ecosistema, portabilidad |
| Mobile | No especifica | PWA (service worker + manifest) | Sin app stores, sin SDKs nativos, deploy directo |
| Desktop | No especifica | Tauri | Ventanas nativas para Digitador/Jefes/Directivos |
| IA | Google AI Studio | Google AI Studio | Mantenemos estándar del bootcamp |
| Backend/DB | Supabase + Firebase Auth | Supabase (PostgreSQL, Auth, RLS, Realtime, Storage) | Unificado, RLS, Realtime nativo, código abierto |
| Deployment | AWS o Google Cloud | Vercel (PWA) / Google Cloud Run (opcional) | Simplicidad, serverless, CDN global |

## Decisiones

### ADR-001a: Supabase sobre Firebase
- **Motivo**: PostgreSQL real (no NoSQL), RLS por fila, Realtime nativo con WAL, migrations con CLI, self-host posible
- **Costo**: Free tier generoso, Pro $25/mes cuando se necesite

### ADR-001b: PWA sobre apps nativas
- **Motivo**: Un solo codebase React para todas las vistas, deploy a Netlify/Vercel sin app stores, offline parcial con service worker
- **Excepción**: Tauri solo para roles administrativos (Digitador, Jefes, Directivos) que necesitan ventanas nativas

### ADR-001c: Vistas materializadas para analytics
- **Motivo**: Consultas agregadas sobre 110 espacios + miles de asignaciones serían lentas en tiempo real
- **Solución**: Vistas materializadas actualizadas por triggers + función `refresh_analytics()`

### ADR-001d: RLS como única barrera de seguridad
- **Motivo**: No hay backend intermedio — frontend (PWA + Tauri) consulta Supabase directo
- **Regla**: Cada tabla tiene policies RLS por rol, auditables en SQL

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| StitchWithGoogle no usado (pueden evaluarlo) | Documentar que React cumple mismo propósito con mejor mantenibilidad |
| Dependencia de Google AI Studio + Antigravity | Separar lógica en capas: adaptador de IA intercambiable |
| Competencia: otros equipos usan stack oficial | Destacar en pitch: escalabilidad, testing, código abierto |

## Referencias
- Doc-Caso desafío Bootcamp-Gestión Estacionamientos Sede Maipú.pdf
- Checkpoints 1-5 del bootcamp
