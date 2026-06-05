// @kind(document)
// @contract(in: requerimiento tiempo real -> out: patrón de suscripción Supabase)
// @scope(parking)

# Patrón Realtime — Suscripciones con Supabase

## Contexto
La ocupación de los 110 espacios cambia constantemente (asignación, verificación, liberación).
Las apps PWA (Conductor + Guardia) y Tauri (Jefes) deben reflejar cambios en <500ms.

## Arquitectura
```
UPDATE en espacios_estacionamiento
  → WAL (Write-Ahead Log) de PostgreSQL
  → Supabase Realtime (WebSocket)
  → Cliente supabase-js recibe payload
  → Actualiza estado local (React state)
  → UI re-renderiza
```

## Hook Base: `useRealtimeParking`

```typescript
// @kind(hook)
// @scope(parking)
// @platform(shared)
// @contract(in: void -> out: ParkingState @error: NetworkFailure)

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ParkingState = {
  total: number
  libres: number
  ocupados: number
  mantenimiento: number
  espacios: Espacio[]
}

export function useRealtimeParking() {
  const [state, setState] = useState<ParkingState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from('mv_ocupacion_actual')
        .select('*')
      if (error) {
        setIsError(true)
        return
      }
      setState(computeState(data))
      setIsLoading(false)
    }

    fetchInitial()

    const channel = supabase
      .channel('ocupacion-en-vivo')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'espacios_estacionamiento',
        },
        (payload) => {
          setState((prev) => updateState(prev, payload.new))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { state, isLoading, isError }
}
```

## Tablas que requieren Realtime

| Tabla | Eventos | Quién escucha |
|-------|---------|---------------|
| `espacios_estacionamiento` | INSERT / UPDATE / DELETE | Todos (ocupación en vivo) |
| `asignaciones` | INSERT (nueva) | Conductor (tu espacio asignado) |
| `incidencias` | INSERT / UPDATE | Guardia + Conductor |

## Buenas Prácticas
1. **Solo habilitar Realtime en tablas necesarias** — cada canal suma costo CPU
2. **Payload mínimo** — `event: 'UPDATE'` en lugar de `'*'` cuando solo interesa cambio de estado
3. **Debounce en UI** — evitar re-renders excesivos con `useMemo` o estado local optimista
4. **Cleanup** — siempre `removeChannel` en `useEffect` return
5. **Fallback offline** — cache con localStorage + sincronizar al reconectar
