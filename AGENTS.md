// @kind(config)
// @contract(in: AI session -> out: guided development)
// @limit(stack: react+supabase+tailwind | deploy: vercel|gcp)

# AGENTS.md — Codec-Maipu

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind + shadcn |
| Backend/BaaS | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| IA Generator | Google AI Studio |
| Dev DB | Supabase CLI + Docker (local) |
| Deploy | Vercel o Google Cloud (por definir) |
| Plataforma | **PWA única** (todos los roles, sin Tauri/Ionic) |

## Metodología
- **AI-first requirements**: contratos OPL → IA genera código + documentación humana
- **Composición forzada**: todo componente con `@compose` para evitar monolitos
- **Lógica en DB**: cálculos y validaciones en PostgreSQL (vistas, funciones, triggers)
- **Frontend tonto**: UI solo renderiza, RLS autoriza
- **Offline read-only**: cache local para consultas, escritura requiere conexión
- **QR one-time**: cada código QR usable una sola vez en DB

## Reglas de Código

### Obligatorio
- Anotaciones OPL (`@kind`, `@contract`, `@limit`, `@compose`, `@scope`, `@platform`) en todo archivo nuevo
- Named exports, no default exports
- `type` sobre `interface` para props
- NO usar `any` — TypeScript estricto
- Manejar siempre `isLoading` e `isError` en consumo de APIs
- Manejar siempre `isOnline` en componentes que mutan datos
- Componentes funcionales + hooks, NO clases

### Composición (anti-spaghetti)
- `@compose(SubComponenteA, SubComponenteB, ...)` en todo layout/page
- Un archivo = un componente principal
- Custom hooks para lógica de negocio (ej. `useRealtimeParking`, `useAuth`, `useOffline`)
- Handlers en hooks, no inline en JSX
- UI condicional por rol: `if (role === 'digitador') showCRUD()`

### PWA
- Service worker con `vite-plugin-pwa`
- Estrategia: NetworkFirst para API, CacheFirst para assets
- Badge offline visible cuando `navigator.onLine === false`
- Mutaciones bloqueadas sin conexión

### Base de Datos
- Consultas mínimas: usar vistas materializadas para agregaciones
- RLS obligatorio en todas las tablas
- QR one-time: `tarjetas.activa = false` tras primer uso
- Migraciones con Supabase CLI (`supabase migration new`)
- Desarrollo local con `supabase start` (Docker)

## Workflow
1. `opl_analyze_project` → entender estructura
2. `work_context_plan` → planificar feature/refactor
3. Redactar contrato OPL del componente/vista
4. Generar con Google AI Studio o codificar manual
5. `opl validate` → verificar anotaciones
6. `work_context_close` → cerrar sesión

## Dominios del Proyecto

| Scope | Descripción |
|-------|-------------|
| `@scope(core)` | Autenticación, roles, sesiones, offline |
| `@scope(parking)` | Gestión de espacios (110), estados, asignaciones, QR |
| `@scope(incidents)` | Comunicación conductor-guardia, infracciones |
| `@scope(analytics)` | Dashboard, KPIs, vistas materializadas |
