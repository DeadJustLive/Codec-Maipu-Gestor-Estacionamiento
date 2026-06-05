// @kind(document)
// @contract(in: investigación OPL + requisitos -> out: especificaciones técnicas)
// @limit(stack: React + Supabase + PWA)
// @scope(core, parking)

# Especificaciones Técnicas — Codec-Maipu

---

## 1. Responsividad Mobile + Desktop (PWA)

### 1.1 Estrategia Mobile-First
- Base: Mobile-first con Tailwind v4 (breakpoints `sm`, `md`, `lg`, `xl`)
- Las vistas PWA se diseñan primero para 320px-480px (móvil), luego escalan a tablet/desktop
- Tauri Desktop hereda los mismos componentes pero en ventana nativa redimensionable

### 1.2 Breakpoints y Layouts

| Breakpoint | Target | Layout |
|-----------|--------|--------|
| < 640px | Móvil vertical (Conductor/Guardia) | Single column, bottom nav bar |
| 640-768px | Móvil horizontal / Tablet chica | Single column, top header |
| 768-1024px | Tablet (Digitador terreno) | Two column: sidebar + content |
| > 1024px | Desktop Tauri (Jefes/Directivos) | Sidebar expandida + content + panels |

### 1.3 Hook `useMediaQuery`
```typescript
// src/hooks/useMediaQuery.ts
// @compose(useEventListener)
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Uso:
// const isDesktop = useMediaQuery('(min-width: 1024px)')
// const isMobile = useMediaQuery('(max-width: 639px)')
```

### 1.4 Patrón de Layout Responsivo

```
Mobile (< 640px):
┌──────────────────────┐
│      Top Bar         │
├──────────────────────┤
│                      │
│    Main Content      │
│    (full width)      │
│                      │
├──────────────────────┤
│  Nav Bottom (iconos) │
└──────────────────────┘

Desktop (> 1024px):
┌────────┬─────────────────────────┐
│        │                         │
│ Sidebar│     Main Content        │
│ (240px)│                         │
│        │                         │
│ iconos │                         │
│ + texto│                         │
└────────┴─────────────────────────┘
```

### 1.5 Componentes Adaptables

```typescript
// Sidebar cambia según contexto
// Mobile: bottom nav con íconos (5 items máx)
// Desktop: sidebar lateral con íconos + labels

interface SidebarProps {
  role: Rol
  isMobile: boolean
}

// Tablas: en mobile se convierten en cards apilables
// Ej: <ResponsiveTable> renderiza <table> en desktop, <CardList> en mobile
```

### 1.6 Touch vs Click
- Todos los targets táctiles > 44x44px (estándar accesibilidad)
- En mobile: gestos swipe para navegación entre vistas
- En desktop: tooltips, hover states, atajos de teclado

---

## 2. Patrones de Conexión Supabase

### 2.1 Singleton de Cliente

```typescript
// src/lib/supabase.ts
// @compose(createClient)
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  }
  return client
}
```

### 2.2 Hook `useSupabase` (Singleton + Sesión)

```typescript
// src/hooks/useSupabase.ts
// @compose(getSupabase)
export function useSupabase() {
  const supabase = getSupabase()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [supabase])

  return { supabase, session, isLoading }
}
```

### 2.3 Patrón de Consultas con Tipado

```typescript
// src/lib/queries.ts
// @compose(getSupabase)
// Funciones independientes, no hooks, para testing fácil

import { getSupabase } from './supabase'

export async function fetchEspacioActivo(rut: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .rpc('espacio_activo', { p_rut: rut })
    .single()
  return { data, error }
}

export async function fetchOcupacionActual() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('mv_ocupacion_actual')
    .select('*')
  return { data, error }
}
```

### 2.4 Realtime con Manejo de Conexión

```typescript
// src/hooks/useRealtime.ts
// @compose(getSupabase, useOnlineStatus)
export function useRealtime<T>(
  channel: string,
  table: string,
  filter?: string,
  onUpdate: (payload: T) => void
) {
  const { supabase } = useSupabase()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (!isOnline) return

    const subscription = supabase
      .channel(channel)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => onUpdate(payload.new as T)
      )
      .subscribe()

    return () => { supabase.removeChannel(subscription) }
  }, [isOnline, channel, table, filter])
}
```

### 2.5 Rate Limiting y Pool de Conexiones
- Una sola instancia de `SupabaseClient` (singleton)
- Las queries se hacen mediante `rpc()` a funciones PostgreSQL, no queries raw desde el cliente
- Evitar subscripciones Realtime innecesarias: suscribir solo las vistas que lo requieren (dashboard ocupación)
- Usar `select()` con columnas explícitas, nunca `select(*)`

---

## 3. Funciones PostgreSQL (RPC)

### 3.1 `asignar_espacio`

```sql
-- @kind(function)
-- @contract(in: rut, patente -> out: asignación creada)
-- @limit(una asignación activa por conductor)

CREATE OR REPLACE FUNCTION asignar_espacio(
  p_rut text,
  p_patente text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usuario_id uuid;
  v_vehiculo_id uuid;
  v_espacio_id uuid;
  v_tarjeta_id uuid;
  v_resultado jsonb;
  v_activa_count int;
BEGIN
  -- Validar que el conductor no tenga asignación activa
  SELECT COUNT(*) INTO v_activa_count
  FROM asignaciones a
  JOIN usuarios u ON u.id = a.usuario_id
  WHERE u.rut = p_rut AND a.estado = 'activa';

  IF v_activa_count > 0 THEN
    RETURN jsonb_build_object('error', 'El conductor ya tiene una asignación activa');
  END IF;

  -- Obtener usuario
  SELECT id INTO v_usuario_id FROM usuarios WHERE rut = p_rut AND activo = true;
  IF v_usuario_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Conductor no encontrado o inactivo');
  END IF;

  -- Obtener vehículo
  SELECT id INTO v_vehiculo_id FROM vehiculos WHERE patente = p_patente AND activo = true;
  IF v_vehiculo_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Vehículo no encontrado o inactivo');
  END IF;

  -- Buscar espacio libre (con lock para evitar race condition)
  SELECT id INTO v_espacio_id
  FROM espacios
  WHERE estado = 'libre'
  ORDER BY sector, numero
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_espacio_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No hay espacios libres disponibles');
  END IF;

  -- Buscar tarjeta inactiva disponible
  SELECT id INTO v_tarjeta_id
  FROM tarjetas
  WHERE activa = false AND espacio_id IS NULL
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_tarjeta_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No hay tarjetas disponibles');
  END IF;

  -- Crear asignación
  INSERT INTO asignaciones (usuario_id, vehiculo_id, espacio_id, tarjeta_id, entrada, estado)
  VALUES (v_usuario_id, v_vehiculo_id, v_espacio_id, v_tarjeta_id, NOW(), 'activa');

  -- Marcar espacio como ocupado
  UPDATE espacios SET estado = 'ocupado' WHERE id = v_espacio_id;

  -- Activar tarjeta
  UPDATE tarjetas SET activa = true, espacio_id = v_espacio_id WHERE id = v_tarjeta_id;

  -- Retornar resultado
  SELECT jsonb_build_object(
    'sector', e.sector,
    'numero', e.numero,
    'codigo_tarjeta', t.codigo,
    'asignacion_id', a.id
  ) INTO v_resultado
  FROM asignaciones a
  JOIN espacios e ON e.id = a.espacio_id
  JOIN tarjetas t ON t.id = a.tarjeta_id
  WHERE a.id = currval(pg_get_serial_sequence('asignaciones', 'id'));

  RETURN v_resultado;
END;
$$;
```

### 3.2 `verificar_espacio`

```sql
-- @kind(function)
-- @contract(in: codigo_tarjeta -> out: datos de verificación)
-- @limit(QR one-time: solo si tarjeta activa)

CREATE OR REPLACE FUNCTION verificar_espacio(
  p_codigo_tarjeta text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resultado jsonb;
  v_tarjeta record;
BEGIN
  -- Validar tarjeta
  SELECT t.*, a.id as asignacion_id, a.estado as asignacion_estado,
         u.nombre as conductor_nombre, u.rut as conductor_rut,
         v.patente, v.marca, v.modelo, v.color,
         e.sector, e.numero
  INTO v_tarjeta
  FROM tarjetas t
  JOIN asignaciones a ON a.tarjeta_id = t.id AND a.estado = 'activa'
  JOIN usuarios u ON u.id = a.usuario_id
  JOIN vehiculos v ON v.id = a.vehiculo_id
  JOIN espacios e ON e.id = a.espacio_id
  WHERE t.codigo = p_codigo_tarjeta AND t.activa = true;

  IF v_tarjeta IS NULL THEN
    RETURN jsonb_build_object('error', 'Tarjeta no válida o asignación no activa');
  END IF;

  SELECT jsonb_build_object(
    'conductor', jsonb_build_object('nombre', v_tarjeta.conductor_nombre, 'rut', v_tarjeta.conductor_rut),
    'vehiculo', jsonb_build_object('patente', v_tarjeta.patente, 'marca', v_tarjeta.marca, 'modelo', v_tarjeta.modelo, 'color', v_tarjeta.color),
    'espacio', jsonb_build_object('sector', v_tarjeta.sector, 'numero', v_tarjeta.numero),
    'asignacion_id', v_tarjeta.asignacion_id
  ) INTO v_resultado;

  RETURN v_resultado;
END;
$$;
```

### 3.3 `liberar_espacio`

```sql
-- @kind(function)
-- @contract(in: codigo_tarjeta -> out: espacio liberado)
-- @limit(solo asignaciones activas)

CREATE OR REPLACE FUNCTION liberar_espacio(
  p_codigo_tarjeta text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_asignacion_id uuid;
  v_espacio_id uuid;
  v_tarjeta_id uuid;
BEGIN
  SELECT a.id, a.espacio_id, a.tarjeta_id
  INTO v_asignacion_id, v_espacio_id, v_tarjeta_id
  FROM asignaciones a
  JOIN tarjetas t ON t.id = a.tarjeta_id
  WHERE t.codigo = p_codigo_tarjeta AND a.estado = 'activa';

  IF v_asignacion_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No hay asignación activa para esta tarjeta');
  END IF;

  -- Finalizar asignación
  UPDATE asignaciones
  SET estado = 'finalizada', salida = NOW()
  WHERE id = v_asignacion_id;

  -- Liberar espacio
  UPDATE espacios SET estado = 'libre' WHERE id = v_espacio_id;

  -- Desactivar tarjeta (QR one-time)
  UPDATE tarjetas SET activa = false, espacio_id = NULL WHERE id = v_tarjeta_id;

  RETURN jsonb_build_object(
    'asignacion_id', v_asignacion_id,
    'mensaje', 'Espacio liberado correctamente',
    'salida', NOW()
  );
END;
$$;
```

### 3.4 `reportar_infraccion`

```sql
-- @kind(function)
-- @contract(in: asignacion_id, patente_real, guardia_id -> out: infracción creada)
-- @limit(solo guardias)

CREATE OR REPLACE FUNCTION reportar_infraccion(
  p_asignacion_id uuid,
  p_patente_real text,
  p_guardia_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_infraccion_id uuid;
BEGIN
  INSERT INTO infracciones (asignacion_id, patente_real, reportada_por, estado)
  VALUES (p_asignacion_id, p_patente_real, p_guardia_id, 'pendiente')
  RETURNING id INTO v_infraccion_id;

  -- Marcar asignación en disputa
  UPDATE asignaciones SET estado = 'en_disputa' WHERE id = p_asignacion_id;

  RETURN jsonb_build_object(
    'infraccion_id', v_infraccion_id,
    'mensaje', 'Infracción reportada correctamente'
  );
END;
$$;
```

### 3.5 `notificar_conductores` (Trigger)

```sql
-- @kind(trigger)
-- @contract(in: nueva infracción -> out: notificación)
-- @limit(ejecutado automáticamente)

CREATE OR REPLACE FUNCTION fn_notificar_infraccion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO notificaciones (usuario_id, tipo, mensaje, leida)
  SELECT a.usuario_id, 'infraccion',
    format('Infracción reportada en espacio %s-%s. Patente real: %s',
      e.sector, e.numero, NEW.patente_real),
    false
  FROM asignaciones a
  JOIN espacios e ON e.id = a.espacio_id
  WHERE a.id = NEW.asignacion_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notificar_infraccion
AFTER INSERT ON infracciones
FOR EACH ROW
EXECUTE FUNCTION fn_notificar_infraccion();
```

---

## 4. Notificaciones Push (Firebase Cloud Messaging)

### 4.1 Estrategia
- **Supabase no tiene push nativo** → se necesita un servicio complementario
- **Opción elegida**: Firebase Cloud Messaging (FCM) como servicio de notificaciones push
- Flujo: Supabase trigger → Edge Function → FCM → dispositivo del usuario

### 4.2 Arquitectura

```
Supabase DB (trigger)
  → Supabase Edge Function (HTTP)
    → Firebase Admin SDK (send)
      → FCM
        → Service Worker (push event)
          → Notificación nativa
```

### 4.3 Registro de Token FCM

```typescript
// src/hooks/useFCM.ts
// @compose(useSupabase, getSupabase)
export function useFCM() {
  const { supabase, session } = useSupabase()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (!session || !('serviceWorker' in navigator)) return

    async function register() {
      const registration = await navigator.serviceWorker.ready
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      // Usar vapid key desde Supabase
      const { data, error } = await supabase.functions.invoke('get-fcm-token')
      if (error) return

      // Guardar token en tabla usuario_tokens
      await supabase.from('usuario_tokens').upsert({
        usuario_id: session.user.id,
        fcm_token: token,
        plataforma: 'pwa',
        updated_at: new Date()
      })
    }

    register()
  }, [session])
}
```

### 4.4 Service Worker (Push Handler)

```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
```

### 4.5 Tipos de Notificaciones

| Evento | Dispara | Mensaje | Destinatario |
|--------|---------|---------|-------------|
| Infracción creada | Trigger SQL | "Infracción en espacio A-15" | Conductor |
| Asignación creada | RPC `asignar_espacio` | "Espacio A-15 asignado" | Conductor |
| Capacidad crítica | Consulta programada | "Ocupación >85% por 1h" | Jefe Seguridad, Directivo |
| Recordatorio liberación | Cron | "Espacio sin liberar al cierre" | Digitador |

---

## 5. Recuperación de Contraseña

### 5.1 Flujo Supabase Auth

```
Usuario: "Olvidé mi contraseña"
  → Ingresa email en formulario
    → Frontend llama a supabase.auth.resetPasswordForEmail(email)
      → Supabase envía email con magic link + token
        → Usuario abre link → página de reset
          → Frontend detecta hash en URL
            → supabase.auth.verifyOtp({ email, token, type: 'recovery' })
              → Usuario ingresa nueva password
                → supabase.auth.updateUser({ password: nuevaPassword })
                  → Login automático post-reset
```

### 5.2 Componente Recuperación

```typescript
// src/components/auth/ResetPassword.tsx
// @compose(useSupabase)
export function ResetPassword() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    setIsLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <p>Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleReset}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.duoc.cl"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Restablecer contraseña'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

### 5.3 Página de Nuevo Password

```typescript
// src/pages/UpdatePassword.tsx
// @compose(useSupabase, useSearchParams)
export function UpdatePassword() {
  const { supabase } = useSupabase()
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setConfirmed(true)
    }
  }

  if (confirmed) {
    return <p>Contraseña actualizada correctamente. Ya puedes iniciar sesión.</p>
  }

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        minLength={6}
        required
      />
      <button type="submit">Actualizar contraseña</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

### 5.4 Configuración Supabase
- En Supabase Dashboard → Authentication → Settings:
  - Habilitar "Confirm email" y "Reset password"
  - `redirectTo` debe apuntar al dominio desplegado (localhost en dev)
  - El template del email se personaliza con SMTP propio (opcional)

---

## 6. Detalle de Vistas por Rol (Colores Amarillo, Negro, Blanco)

### 6.1 Paleta de Diseño

| Color | Uso | Hex |
|-------|-----|-----|
| Amarillo primario | Headers, botones principales, acentos | `#F5A623` |
| Amarillo hover | Hover states | `#D4891A` |
| Negro fondo | Fondo general (dark mode) | `#1A1A1A` |
| Negro surface | Tarjetas, paneles | `#2D2D2D` |
| Blanco texto | Texto principal | `#FFFFFF` |
| Blanco secundario | Texto secundario | `#B0B0B0` |
| Amarillo suave | Badges, alertas suaves | `#FFF3D6` |

### 6.2 Layout General

```
┌─────────────────────────────────────────┐
│ 🔔  TopBar (amarillo #F5A623)           │
│  Logo | Título vista | Perfil           │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Main Content                │
│ (negro)  │  (negro surface #2D2D2D)     │
│          │                              │
│ icono+txt│  Cards blancas sobre negro    │
│ icono+txt│                              │
│ icono+txt│                              │
├──────────┴──────────────────────────────┤
│ Footer (opcional)                       │
└─────────────────────────────────────────┘

Mobile:
┌────────────────────────┐
│ TopBar (amarillo)      │
├────────────────────────┤
│                        │
│ Main Content (full)    │
│                        │
├────────────────────────┤
│ Nav Bottom (negro)     │
│ 🏠  🚗  👤  ⚙️        │
└────────────────────────┘
```

### 6.3 Vistas Conductor (PWA Móvil)

#### Login
```
Fondo: negro #1A1A1A
┌────────────────────────┐
│                        │
│   [Logo Codec-Maipu]   │
│                        │
│  ┌──────────────────┐  │
│  │ RUT               │  │ ← input borde gris
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  Ingresar         │  │ ← botón amarillo #F5A623
│  └──────────────────┘  │
│                        │
│  ¿Olvidaste tu clave?  │ ← link blanco secundario
└────────────────────────┘
```

#### Home
```
┌────────────────────────┐
│ 🔔 Codec-Maipu   👤    │ ← TopBar amarillo
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │  🅿️ Tu espacio    │  │ ← card negro surface
│  │  A-15             │  │
│  │  Sector Norte     │  │
│  │  📱 Mostrar QR    │  │ ← botón amarillo
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  📊 Ocupación     │  │
│  │  73%              │  │ ← barra de progreso
│  │  ████████░░░░░░   │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  🚗 Mis Vehículos │  │
│  │  ABCD-12 (activo) │  │
│  │  + Agregar        │  │
│  └──────────────────┘  │
│                        │
├────────────────────────┤
│ 🏠  🚗  📋  👤        │ ← Bottom nav negro
└────────────────────────┘
```

#### QR Tarjeta
```
┌────────────────────────┐
│ ← Volver          👤   │ ← TopBar amarillo
├────────────────────────┤
│                        │
│     Tu tarjeta         │
│    ┌──────────┐        │
│    │ ████████  │        │ ← QR code grande
│    │ ██▓▓▓▓██  │        │
│    │ ██▓▓▓▓██  │        │
│    │ ████████  │        │
│    └──────────┘        │
│     Código: A-15-001   │
│                        │
│  Espacio: A-15         │
│  Desde: 08:30          │
│                        │
└────────────────────────┘
```

#### Historial
```
┌────────────────────────┐
│ ← Historial       👤   │
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │  📅 Hoy           │  │
│  │  A-15 08:30-12:00 │  │ ← card list
│  │  ✅ Verificado    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  📅 Ayer          │  │
│  │  B-08 09:00-11:30 │  │
│  │  ✅ Verificado    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  📅 Lun           │  │
│  │  C-03 10:00-12:15 │  │
│  │  ⚠ Infracción    │  │ ← badge amarillo
│  └──────────────────┘  │
│                        │
└────────────────────────┘
```

### 6.4 Vistas Guardia (PWA Móvil)

#### Dashboard Rápido
```
┌────────────────────────┐
│ 🛡️  Guardia      👤   │ ← TopBar amarillo
├────────────────────────┤
│                        │
│  ┌──────┐ ┌──────┐    │
│  │ 🟢   │ │ 🔴   │    │ ← cards estadísticas
│  │ 45   │ │ 62   │    │
│  │ Libres│ │ Ocup.│    │
│  └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐    │
│  │ 🟡   │ │ ⚠️   │    │
│  │ 3    │ │ 2    │    │
│  │ Reserv│ │ Infr.│    │
│  └──────┘ └──────┘    │
│                        │
│  ┌──────────────────┐  │
│  │  📷 Escanear QR   │  │ ← botón amarillo grande
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  ⌨️ Ingreso manual│  │ ← botón ghost
│  └──────────────────┘  │
│                        │
├────────────────────────┤
│ 🏠  📷  📋  👤        │
└────────────────────────┘
```

#### Escáner QR
```
┌────────────────────────┐
│ ← Escanear        👤   │
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │                  │  │
│  │   [Cámara]       │  │ ← viewfinder cámara
│  │   ██▓▓▓▓██       │  │
│  │   ██▓▓▓▓██       │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  ⌨️ Ingresar código│  │ ← input manual
│  └──────────────────┘  │
│                        │
└────────────────────────┘
```

#### Ficha de Verificación
```
┌────────────────────────┐
│ ← Verificación    👤   │ ← TopBar amarillo
├────────────────────────┤
│                        │
│  Espacio: A-15         │ ← texto grande blanco
│  Sector: Norte         │
│                        │
│  ┌──────────────────┐  │
│  │ 👤 Juan Pérez     │  │ ← card negro surface
│  │ RUT: 11.111.111-1 │  │
│  │ 🚗 ABCD-12        │  │
│  │ Suzuki Swift Gris │  │
│  │                   │  │
│  │ Patente esperada: │  │
│  │    ABCD-12        │  │ ← display grande
│  └──────────────────┘  │
│                        │
│  ┌────────┐ ┌────────┐│
│  │  ✅ OK  │ │  ❌    ││ ← botones grandes
│  │        │ │Infracc.││
│  └────────┘ └────────┘│
│  verde    amarillo/rojo│
│                        │
└────────────────────────┘
```

### 6.5 Vistas Digitador (Desktop Tauri)

#### Panel Principal
```
┌──────────────────────────────────────────┐
│ 🔔 Codec-Maipu | Panel Digitador    👤   │ ← TopBar amarillo
├──────────┬───────────────────────────────┤
│          │  Buscar Conductor              │
│ 🖥️ Panel  │ ┌─────────────────────────┐  │
│ 👤 Cond.  │ │ 🔍 RUT o nombre...      │  │ ← input búsqueda
│ 🚗 Vehíc. │ └─────────────────────────┘  │
│ 🅿️ Espac. │                               │
│ 💳 Tarjet.│  ┌─────────────────────────┐  │
│ 📋 Asign. │  │ Resultados (3)          │  │
│ 📊 Report.│  │ Juan Pérez 11.111.111-1 │  │ ← card clickeable
│ ⚙️ Config │  │ María García 22.222.222-2│  │
│          │  │ Pedro López 33.333.333-3│  │
│          │  └─────────────────────────┘  │
│          │                               │
│          │  Acciones rápidas:            │
│          │  ┌────────┐ ┌────────┐        │
│          │  │ + Nuevo │ │Asignar │        │ ← botones amarillos
│          │  │Conductor│ │Espacio │        │
│          │  └────────┘ └────────┘        │
├──────────┴───────────────────────────────┤
│ Status: 🟢 Conectado | 45 libres / 110   │ ← footer
└──────────────────────────────────────────┘
```

#### Asignar Espacio
```
┌──────────────────────────────────────────┐
│ ← Asignar Espacio                    👤   │
├──────────┬───────────────────────────────┤
│ Sidebar  │  Conductor: Juan Pérez        │
│ (oculta) │  RUT: 11.111.111-1            │
│          │                               │
│          │  Vehículos del conductor:     │
│          │  ┌─────────────────────────┐  │
│          │  │ ○ ABCD-12 Suzuki Swift  │  │ ← radio button
│          │  │ ● XYZ-99 Toyota Yaris   │  │ ← seleccionado
│          │  └─────────────────────────┘  │
│          │                               │
│          │  Espacios disponibles: 45     │
│          │  ┌─────────────────────────┐  │
│          │  │  A-15 (Sector Norte)    │  │
│          │  │  A-16 (Sector Norte)    │  │ ← lista scroll
│          │  │  B-01 (Sector Sur)      │  │
│          │  └─────────────────────────┘  │
│          │                               │
│          │  ┌─────────────────────────┐  │
│          │  │  🔄 Asignar automático   │  │ ← botón amarillo
│          │  └─────────────────────────┘  │
│          │                               │
├──────────┴───────────────────────────────┤
│                                          │
└──────────────────────────────────────────┘
```

### 6.6 Vistas Jefe Seguridad (Desktop Tauri)

#### Dashboard Ocupación
```
┌──────────────────────────────────────────┐
│ 🔔 Codec-Maipu | Seguridad          👤   │
├──────────┬───────────────────────────────┤
│ 🖥️ Dashboard │ ┌─────────────────────────┐│
│ 🅿️ Mapa   │ │  Mapa de Ocupación       ││
│ ✅ Verif. │ │  ┌───┬───┬───┬───┬───┐  ││
│ ⚠️ Infracc.│ │  │🟢│🔴│🟢│🔴│🔴│  ││ ← grilla sectores
│ 📊 Report. │ │  ├───┼───┼───┼───┼───┤  ││
│          │ │  │🟢│🟢│🔴│🟢│🟡│  ││
│          │ │  ├───┼───┼───┼───┼───┤  ││
│          │ │  │🔴│🔴│🟢│🟢│🔴│  ││
│          │ │  └───┴───┴───┴───┴───┘  ││
│          │ └─────────────────────────┘  │
│          │                               │
│          │  ┌────┐ ┌────┐ ┌────┐        │
│          │  │73% │ │45  │ │ 2  │        │ ← KPIs
│          │  │Ocup.│ │Lib.│ │Inf.│        │
│          │  └────┘ └────┘ └────┘        │
│          │                               │
│          │  ⚠️ 2 infracciones pendientes │ ← alerta
│          │  ┌─────────────────────────┐  │
│          │  │ A-15 | ABCD-12 vs WXYZ  │  │ ← feed
│          │  │ B-08 | XYZ-99 vs ABC-00 │  │
│          │  └─────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 6.7 Vistas Directivo (Desktop Tauri)

#### Dashboard Global
```
┌──────────────────────────────────────────┐
│ 🔔 Codec-Maipu | Directivo          👤   │
├──────────┬───────────────────────────────┤
│ 📊 Global │ ┌────────────────────────────┐│
│ 📈 Tenden.│ │  Ocupación Últimos 30 días ││
│ 🏢 Sectores│ │  📈 [gráfico línea]       ││ ← chart
│ ⚠️ Alertas │ │  Promedio: 68%            ││
│ 📑 Reportes│ │  Pico: 89% (15 Mayo)      ││
│          │ └────────────────────────────┘│
│          │                               │
│          │  ┌──────┐ ┌──────┐ ┌──────┐  │
│          │  │ 1,234 │ │   65%  │ │ 4.2h ││ ← KPI cards
│          │  │ Ingres.│ │Recurr.│ │Estad.││
│          │  └──────┘ └──────┘ └──────┘  │
│          │                               │
│          │  ⚠️ Alerta: Capacidad >85%    │
│          │  por 7 días consecutivos      │ ← alerta amarilla
│          │  ┌─────────────────────────┐  │
│          │  │  📊 Ver proyección       │  │ ← botón
│          │  └─────────────────────────┘  │
├──────────┴───────────────────────────────┤
│                                          │
└──────────────────────────────────────────┘
```

---

## 7. Estados de Componentes

### 7.1 Patrón de Estados

Todo componente que consume datos debe manejar:

```typescript
interface ComponentState<T> {
  data: T | null
  isLoading: boolean
  isError: string | null
}

// Uso en template:
{
  isLoading && <Spinner />
  isError && <ErrorBanner message={isError} />
  !isLoading && !isError && data && <Content data={data} />
  !isLoading && !isError && !data && <EmptyState />
}
```

### 7.2 Componente Empty State

```
┌──────────────────────────┐
│                          │
│     📭                   │ ← icono grande
│   Sin datos              │
│                          │
│   No hay asignaciones    │
│   para mostrar           │ ← texto gris
│                          │
└──────────────────────────┘
```

### 7.3 Componente Error State

```
┌──────────────────────────┐
│  ⚠️ Error de conexión    │ ← badge amarillo
│                          │
│  No pudimos cargar los   │
│  datos. Verifica tu      │
│  conexión a internet.    │
│                          │
│  ┌──────────────────┐    │
│  │  🔄 Reintentar    │    │ ← botón amarillo
│  └──────────────────┘    │
└──────────────────────────┘
```

---

## 8. Buenas Prácticas Supabase

### 8.1 Seguridad
- **Nunca** usar `service_role key` en el frontend
- **Siempre** usar `anon key` con RLS habilitado
- **Todas** las tablas deben tener políticas RLS
- **Nunca** ejecutar `SELECT *` desde el cliente
- **Usar** `rpc()` para operaciones de escritura

### 8.2 Performance
- Crear índices en columnas de búsqueda: `rut`, `patente`, `codigo_tarjeta`
- Usar vistas materializadas para consultas analíticas pesadas
- Paginación con `range()` en listas grandes
- Evitar subscripciones Realtime en vistas que no lo requieren

### 8.3 Conexiones
- Singleton del cliente Supabase
- Una instancia por toda la aplicación
- No crear nuevos clientes en cada componente

### 8.4 Migraciones
- Usar `supabase migration new` para cambios de esquema
- Versionar todas las migraciones en git
- Probar local con `supabase start` (Docker) antes de deploy

---

## 9. Índices Recomendados

```sql
-- Búsquedas por RUT
CREATE INDEX idx_usuarios_rut ON usuarios (rut);

-- Búsquedas por patente
CREATE INDEX idx_vehiculos_patente ON vehiculos (patente);

-- Asignaciones activas por usuario
CREATE INDEX idx_asignaciones_activas ON asignaciones (usuario_id) WHERE estado = 'activa';

-- Búsqueda de espacio libre
CREATE INDEX idx_espacios_libres ON espacios (sector, numero) WHERE estado = 'libre';

-- Búsqueda de tarjeta por código
CREATE INDEX idx_tarjetas_codigo ON tarjetas (codigo);

-- Vistas materializadas refrescadas periódicamente
REFRESH MATERIALIZED VIEW mv_ocupacion_actual;
REFRESH MATERIALIZED VIEW mv_flujo_diario;
```

---

## 10. Buenas Prácticas React + Tailwind (react-doctor compatible)

### 10.1 Estructura de Componentes

```
src/
├── components/
│   ├── ui/           ← shadcn/ui base (button, card, input, dialog...)
│   ├── layout/       ← Sidebar, TopBar, BottomNav, MainLayout
│   ├── auth/         ← LoginForm, ResetPassword, UpdatePassword
│   ├── conductor/    ← HomeConductor, QRCard, HistorialList
│   ├── guardia/      ← Scanner, VerificacionFicha, LiberarForm
│   ├── digitador/    ← BuscadorConductor, AsignarEspacio, CRUDVehiculos
│   ├── shared/       ← EmptyState, ErrorBanner, Spinner, BadgeOffline
│   └── analytics/    ← KPICard, GraficoLinea, AlertaCard
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useSupabase.ts
│   ├── useOnlineStatus.ts
│   ├── useRealtime.ts
│   ├── useFCM.ts
│   └── useDebounce.ts
├── lib/
│   ├── supabase.ts       ← Singleton
│   ├── queries.ts        ← Funciones de consulta
│   └── utils.ts          ← cn(), formatDate(), etc.
├── types/
│   └── index.ts          ← Tipos compartidos
└── pages/
    ├── ConductorPage.tsx
    ├── GuardiaPage.tsx
    ├── DigitadorPage.tsx
    └── LoginPage.tsx
```

### 10.2 Reglas de Componentes

#### Un archivo = un componente
```typescript
// ✅ Correcto
// src/components/conductor/QRTarjeta.tsx
export function QRTarjeta() { ... }

// ❌ Incorrecto
// src/components/conductor/mix.tsx
export function QRTarjeta() { ... }
export function InfoConductor() { ... }
```

#### Props tipadas con `type`, no `interface`
```typescript
// ✅ Correcto
type QRTarjetaProps = {
  codigo: string
  espacio: string
  activa: boolean
}

// ❌ Incorrecto
interface QRTarjetaProps {
  codigo: string
  espacio: string
  activa: boolean
}
```

#### Componentes pequeños y enfocados
```typescript
// ✅ Correcto — un propósito
type KPICardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  color: 'green' | 'red' | 'yellow'
}

export function KPICard({ label, value, icon: Icon, color }: KPICardProps) {
  return (
    <div className="bg-[#2D2D2D] rounded-xl p-4 flex items-center gap-3">
      <Icon className={`w-8 h-8 ${colorMap[color]}`} />
      <div>
        <p className="text-[#B0B0B0] text-xs">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

// ❌ Incorrecto — mezcla responsabilidades
function TarjetaMixta(props: any) {
  // Renderiza KPI, formulario y tabla según prop "tipo"
}
```

### 10.3 Custom Hooks para Lógica de Negocio

```typescript
// ✅ Correcto — lógica extraída a hook
// src/hooks/useAsignacionActiva.ts
type UseAsignacionActivaResult = {
  asignacion: Asignacion | null
  isLoading: boolean
  isError: string | null
  refetch: () => Promise<void>
}

export function useAsignacionActiva(rut: string): UseAsignacionActivaResult {
  const [asignacion, setAsignacion] = useState<Asignacion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setIsError(null)
    const { data, error } = await fetchEspacioActivo(rut)
    if (error) {
      setIsError(error.message)
    } else {
      setAsignacion(data)
    }
    setIsLoading(false)
  }, [rut])

  useEffect(() => { fetch() }, [fetch])

  return { asignacion, isLoading, isError, refetch: fetch }
}

// Uso en componente:
function HomeConductor() {
  const { asignacion, isLoading, isError } = useAsignacionActiva(rut)
  // solo JSX, sin lógica
}
```

#### Handlers en hooks, no inline en JSX
```typescript
// ✅ Correcto
function BotonAsignar() {
  const handleClick = useCallback(async () => {
    const { error } = await asignarEspacio(rut, patente)
    if (error) showError(error)
  }, [rut, patente])

  return <button onClick={handleClick}>Asignar</button>
}

// ❌ Incorrecto — función inline en JSX
<button onClick={async () => {
  const { error } = await asignarEspacio(rut, patente)
  if (error) showError(error)
}}>Asignar</button>
```

### 10.4 Tailwind: Buenas Prácticas

#### Composición, no repetición
```typescript
// ✅ Correcto — clase semántica con @apply o componente compartido
const cardStyles = "bg-[#2D2D2D] border border-white/10 rounded-xl p-4"

function Card({ children }: { children: React.ReactNode }) {
  return <div className={cardStyles}>{children}</div>
}

// ❌ Incorrecto — repetir clases cada vez
<div className="bg-[#2D2D2D] border border-white/10 rounded-xl p-4">...</div>
<div className="bg-[#2D2D2D] border border-white/10 rounded-xl p-4">...</div>
<div className="bg-[#2D2D2D] border border-white/10 rounded-xl p-4">...</div>
```

#### Orden consistente de clases
```typescript
// Orden recomendado (react-doctor friendly):
// 1. Layout: display, position, flex/grid
// 2. Spacing: padding, margin
// 3. Size: width, height
// 4. Typography: font, text, leading
// 5. Visual: bg, border, rounded, shadow
// 6. Interactive: cursor, hover, transition

// ✅ Correcto
<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#F5A623] text-white rounded-lg hover:bg-[#D4891A] transition-colors">
  Acción
</button>
```

#### Colores del theme, no hardcode
```typescript
// Configurar en tailwind (o CSS custom properties):
// ⚠️ En Tailwind v4, no hay tailwind.config.js.
// Usar @theme en index.css:

// index.css
@theme inline {
  --color-primary: #F5A623;
  --color-primary-hover: #D4891A;
  --color-surface: #2D2D2D;
  --color-bg: #1A1A1A;
  --color-text-secondary: #B0B0B0;
}

// ✅ Correcto — usar variables
<button className="bg-primary text-white px-4 py-2 rounded-lg">
  Asignar
</button>

// ❌ Incorrecto — hardcode repetido
<button className="bg-[#F5A623] text-white px-4 py-2 rounded-lg">
  Asignar
</button>
```

#### Responsive con breakpoints consistentes
```typescript
// ✅ Correcto — mobile-first, breakpoints de menos a más
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* sm=640px, lg=1024px */}
</div>

// ❌ Incorrecto — breakpoint innecesario en base
<div className="grid grid-cols-3 sm:grid-cols-2 gap-4">
  {/* mobile carga 3 columnas → rompe layout */}
</div>
```

### 10.5 Performance y react-doctor

#### Evitar re-renders innecesarios

```typescript
// ✅ Correcto — useMemo para arrays/objetos estables
const sectorOptions = useMemo(() =>
  sectores.map(s => ({ value: s.id, label: `${s.nombre} (${s.libres} libres)` })),
  [sectores]
)

// ✅ Correcto — useCallback para funciones pasadas a hijos
const handleSelect = useCallback((id: string) => {
  setSelected(id)
}, [])

// ✅ Correcto — memo para componentes que renderizan listas
const SlotItem = memo(function SlotItem({ slot, onSelect }: SlotItemProps) {
  return (
    <div
      className={`slot ${slot.estado}`}
      onClick={() => onSelect(slot.id)}
    >
      {slot.nombre}
    </div>
  )
})
```

#### Cargar íconos por nombre, no el paquete entero
```typescript
// ✅ Correcto — tree-shakeable
import { Car, Shield, BarChart3 } from 'lucide-react'

// ❌ Incorrecto — importa todo
import * as Icons from 'lucide-react'
```

#### Eliminar imports no usados (noUnusedLocals)
```typescript
// tsconfig ya tiene "noUnusedLocals": true
// El build fallará si hay imports sin usar → se detecta automáticamente
```

#### Fragment sobre div innecesario
```typescript
// ✅ Correcto
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </>
  )
}

// ❌ Incorrecto — div extra en el DOM
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
```

#### Estado derivado, no duplicado
```typescript
// ✅ Correcto
function ContadorSlots({ slots }: { slots: SlotStatus[] }) {
  const libres = useMemo(() =>
    slots.filter(s => s === 'free').length, [slots]
  )

  return <p>Libres: {libres} / {slots.length}</p>
}

// ❌ Incorrecto — estado duplicado
function ContadorSlots({ slots }: { slots: SlotStatus[] }) {
  const [libres, setLibres] = useState(0)

  useEffect(() => {
    setLibres(slots.filter(s => s === 'free').length)
  }, [slots])

  return <p>Libres: {libres} / {slots.length}</p>
}
```

#### useDebounce para búsquedas
```typescript
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// Uso: buscador de conductores
function BuscadorConductor() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchConductores(debouncedSearch)
    }
  }, [debouncedSearch])

  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

#### window.matchMedia cleanup
```typescript
// ✅ Correcto — listener removido en cleanup
useEffect(() => {
  const media = window.matchMedia('(max-width: 639px)')
  media.addEventListener('change', handler)
  return () => media.removeEventListener('change', handler) // ← obligatorio
}, [])
```

### 10.6 Reglas para react-doctor

react-doctor analiza:
- **Deps arrays vacíos** en useEffect/useCallback → todos deben tener deps explícitas
- **useMemo sin deps** → warning
- **Event listeners sin cleanup** → error
- **setState en loops** → error
- **Funciones inline en JSX** → sugerencia

```typescript
// ✅ Pasa react-doctor
useEffect(() => {
  const handler = () => doSomething()
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler) // ← cleanup
}, [doSomething]) // ← dependencia explícita

// ❌ Falla react-doctor
useEffect(() => {
  window.addEventListener('resize', () => doSomething())
  // sin cleanup, sin dep array
}, [])
```

```typescript
// Lista de verificación react-doctor:
// [ ] Todos los useEffect tienen cleanup si crean suscripciones
// [ ] Todos los useCallback/useMemo tienen deps array completo
// [ ] No hay setState dentro de bucles
// [ ] No hay funciones async directamente en useEffect (usar IIFE o helper)
// [ ] No hay refs a variables externas sin incluirlas en deps
// [ ] Los event listeners en window/document se limpian siempre
```

---

## 11. Resumen de Decisiones

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| Responsividad | Mobile-first con breakpoints Tailwind | PWA para Conductor/Guardia > Desktop |
| Cliente DB | Singleton SupabaseClient | Performance, evitar leaks |
| Consultas | RPC functions, no raw queries | Seguridad, lógica en DB |
| Notificaciones | FCM + Supabase Edge Functions | Supabase no tiene push nativo |
| Auth | Supabase Auth + magic link + email | Stack unificado, sin Firebase Auth |
| Reset password | `resetPasswordForEmail` nativo | Supabase lo maneja |
| Colores | Amarillo + Negro + Blanco | Identidad visual definida |
| Layout mobile | Bottom nav, cards en vez de tablas | Touch-friendly, thumb zone |
| Layout desktop | Sidebar + content | Pantallas grandes, multitarea |
