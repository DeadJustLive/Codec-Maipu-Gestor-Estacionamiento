// @kind(guide)
// @contract(in: docker + supabase cli -> out: entorno local funcional)
// @limit(recurso: Docker Desktop requerido)

# Supabase CLI — Desarrollo Local con Docker

## Requisitos
- Docker Desktop (Windows)
- Supabase CLI (`npm install supabase --global` o `scoop install supabase`)

## Inicialización

```bash
# 1. Iniciar proyecto Supabase en local
supabase init

# 2. Iniciar servicios (PostgreSQL + Auth + Realtime + Storage)
supabase start

# 3. Ver estado
supabase status
```

Esto levanta contenedores Docker con:
- PostgreSQL 15 (con WAL habilitado para Realtime)
- GoTrue (Auth)
- Realtime server
- Storage API
- Studio UI (panel admin en http://localhost:54323)

## Migraciones

```bash
# Crear nueva migración
supabase migration new nombre-de-migracion

# Aplicar migraciones
supabase db push

# Ver historial
supabase migration list
```

## Flujo Diario

```bash
# Encender entorno
supabase start

# Conectar app React
# En .env.local:
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon-key-local>

# Trabajar → crear migraciones → probar

# Apagar
supabase stop
```

## Sincronizar con Producción (Supabase Cloud)

```bash
# Vincular proyecto remoto
supabase link --project-ref <ref-id>

# Subir migraciones locales a producción
supabase db push

# Bajar esquema de producción a local
supabase db pull
```

## Seed Data

Crear `supabase/seed.sql` con datos de prueba:

```sql
-- 110 espacios de estacionamiento
INSERT INTO espacios (sector, numero, tipo, estado)
SELECT
  CASE
    WHEN i <= 20 THEN 'A'
    WHEN i <= 50 THEN 'B'
    WHEN i <= 80 THEN 'C'
    ELSE 'D'
  END,
  i % 20 + 1,
  CASE WHEN i % 10 = 0 THEN 'discapacitado' ELSE 'normal' END,
  'libre'
FROM generate_series(1, 110) i;
```

```bash
# Aplicar seed
supabase db reset
```

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `supabase start` | Inicia todos los servicios |
| `supabase stop` | Detiene servicios |
| `supabase db reset` | Resetea BD + aplica migrations + seed |
| `supabase db pull` | Trae esquema remoto a local |
| `supabase db push` | Sube migraciones locales a remoto |
| `supabase gen types typescript --local` | Genera types de BD |
