// @kind(guide)
// @contract(in: requerimiento offline -> out: estrategia PWA)
// @limit(read-only offline, escritura requiere conexión)

# Estrategia Offline — PWA

## Principio
**Read-only offline**: el usuario puede consultar datos cacheados sin conexión, pero no puede crear/modificar nada hasta recuperar conectividad.

## Service Worker

```typescript
// Estrategias por tipo de request
const STRATEGIES = {
  // Assets estáticos (JS, CSS, imágenes): CacheFirst
  static: new CacheFirst({
    cacheName: 'static-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  }),

  // API Supabase: NetworkFirst con timeout
  api: new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  }),
}
```

## Datos cacheados offline

| Cache | TTL | Contenido |
|-------|-----|-----------|
| `espacios` | 5 min | Mapa de espacios con estados |
| `mi-asignacion` | 30 min | Asignación activa del conductor logueado |
| `vehiculos` | 60 min | Vehículos registrados del usuario |
| `infracciones` | 60 min | Infracciones del usuario |

## Indicador visual
La UI debe mostrar un badge `📡 Offline — Solo lectura` cuando `navigator.onLine === false`.

```typescript
// @kind(component)
// @contract(in: status red -> out: indicador visual)
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="bg-duoc-accent text-white text-center py-1 text-sm font-medium">
      📡 Sin conexión — Solo lectura
    </div>
  )
}
```

## Bloqueo de escritura offline
Todos los hooks de mutación (`useAsignar`, `useLiberar`) deben verificar conectividad antes de ejecutar:

```typescript
export function useAsignarEspacio() {
  const ejecutar = async (rut: string, patente: string) => {
    if (!navigator.onLine) {
      throw new Error('No disponible offline')
    }
    // ... llamada a Supabase
  }
  return { ejecutar }
}
```
