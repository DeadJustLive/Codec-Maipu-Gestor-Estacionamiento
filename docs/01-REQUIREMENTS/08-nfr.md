// @kind(document)
// @contract(in: contexto operacional -> out: requisitos no funcionales)
// @limit(presupuesto cloud: $50/mes)

# Requisitos No Funcionales

## Seguridad

| # | Requisito | Implementación |
|---|-----------|---------------|
| NFR-01 | Autenticación obligatoria para todo acceso | Supabase Auth (JWT) |
| NFR-02 | Autorización por rol a nivel de base de datos | RLS en PostgreSQL |
| NFR-03 | Conductor solo ve sus propios datos | Policy RLS por `usuario_id` |
| NFR-04 | Datos personales protegidos (RUT, email) | Cifrado en tránsito (TLS) |
| NFR-05 | Sesión expira por inactividad | Token refresh policy |

## Rendimiento

| # | Requisito | Métrica |
|---|-----------|---------|
| NFR-06 | Carga de dashboard < 2s | Time to interactive |
| NFR-07 | Escaneo QR + verificación < 1s | Lectura + query + render |
| NFR-08 | Sincronización tiempo real < 500ms | WebSocket Supabase Realtime |
| NFR-09 | DB responde consultas analíticas < 3s | Vistas materializadas |

## Disponibilidad

| # | Requisito |
|---|-----------|
| NFR-10 | PWA funciona offline parcial (ver últimas asignaciones sin conexión) |
| NFR-11 | Supabase garantiza 99.95% uptime |
| NFR-12 | Netlify garantiza 99.99% uptime CDN |

## Escalabilidad

| # | Requisito |
|---|-----------|
| NFR-13 | Soporte para hasta 500 espacios concurrentes |
| NFR-14 | Soporte para hasta 2000 usuarios registrados |
| NFR-15 | Soporte para hasta 10 guardias en terreno simultáneos |
| NFR-16 | Migración futura a AWS si el volumen lo requiere |

## UX

| # | Requisito |
|---|-----------|
| NFR-17 | PWA instalable en home screen (Android/iOS) |
| NFR-18 | PWA: ventanas redimensionables con layout responsive |
| NFR-19 | Interfaz en español |
| NFR-20 | Notificaciones push para infracciones y alertas |

## Desarrollo

| # | Requisito |
|---|-----------|
| NFR-21 | TypeScript estricto, sin `any` |
| NFR-22 | Named exports, no default exports |
| NFR-23 | Anotaciones OPL (@kind, @contract, @limit) en archivos nuevos |
| NFR-24 | Validar con `opl validate` antes de commit |
| NFR-25 | Código en React + shadcn + Tailwind |
