// @kind(document)
// @contract(in: simplificación arquitectónica -> out: PWA única con Vite)
// @limit(sin PWA, sin Ionic, sin Next.js)
// @scope(core)

# ADR-002: PWA Única — Unificación de Plataforma

## Contexto
Originalmente se contemplaban dos aplicaciones: PWA (Conductor + Guardia) y PWA (Digitador + Jefes + Directivos). Esto duplica mantención, testing y deploy.

## Decisión
**Una sola PWA** construida con **Vite + React + Tailwind + shadcn**. El control de acceso por roles (RLS en Supabase) determina qué vistas y componentes ve cada usuario.

## Framework: Vite > Next.js

| Criterio | Vite | Next.js |
|----------|------|---------|
| Build speed | ⚡ Instantáneo | Lento (SSR compilation) |
| PWA support | `vite-plugin-pwa` nativo | Necesita wrapper |
| SEO relevance | Nula (todo tras auth) | Nula (todo tras auth) |
| Deployment | Static files (CDN) | Necesita server |
| Complexity | Baja | Alta (SSR, routing) |
| Bundle size | ~60KB base | ~90KB+ base |

Veredicto: **Vite** — más rápido de desarrollar, buildear y deployar.

## Implicaciones

### Antes (descartado)
```
PWA → Conductor + Guardia
PWA → Digitador + Jefes + Directivos
```

### Ahora
```
PWA Única → Todos los roles (UI se adapta por RLS)
```

### Cómo se manejan los roles en una sola PWA
1. **Login** verifica rol del usuario en `usuarios.rol`
2. **Layout dinámico**: sidebar/navbar se renderiza según permisos
3. **RLS en DB** impide que un Conductor vea datos de otro aunque la UI se lo permita
4. **Componentes condicionales**: `if (role === 'digitador') showCRUD()`

## Offline Mode
- **Lectura sí**: cache de últimas asignaciones y disponibilidad en localStorage
- **Escritura no**: cualquier acción (asignar, liberar, verificar) requiere conexión
- Service worker con estrategia `NetworkFirst` para datos, `CacheFirst` para assets

## QR de Un Solo Uso
- Cada tarjeta QR tiene `codigo` único UUID
- Al crear asignación: QR se muestra en pantalla + queda en localStorage del conductor
- Al usar (verificación): DB marca `tarjetas.activa = false`
- Segundo escaneo: sistema rechaza porque `activa = false`
