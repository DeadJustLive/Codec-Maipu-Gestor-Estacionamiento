// @kind(document)
// @contract(in: actores -> out: definición de aplicaciones)
// @limit(cantidad: 2 aplicaciones como máximo)

# Definición de Aplicaciones

## Aplicación Móvil — PWA (Conductor + Guardia)

### Justificación
Ambos actores operan en terreno y necesitan:
- Cámara para escanear QR
- Geolocalización para verificar presencia en sede
- Interfaz táctil responsive
- Funcionamiento offline parcial (PWA con service worker)

### Vistas por Rol

#### Conductor
- Login con RUT
- Registro/edición de datos personales
- Registro de vehículos (patente, marca, modelo, color)
- Selección de vehículo activo
- Ver espacio asignado actual
- Historial de asignaciones (entrada/salida)
- Notificaciones de infracciones

#### Guardia
- Login con credenciales
- Escaneo de QR de tarjeta física
- Ficha de verificación (espacio + asignado + patente esperada)
- Acción: OK (coincide) / Infracción (no coincide)
- Liberación manual de espacio
- Vista rápida de disponibilidad actual

---

## Aplicación Escritorio — Tauri (Digitador + Jefes + Directivos)

### Justificación
Actores administrativos que trabajan en escritorio:
- Pantallas grandes para dashboards
- Atajos de teclado
- Ventanas nativas sin restricciones de browser
- Sesiones largas con multitarea

### Vistas por Rol

#### Digitador
- CRUD conductores
- CRUD vehículos (por conductor)
- CRUD espacios (sector + número + tipo)
- Asignación de espacio + tarjeta a conductor
- Registro de devolución de tarjeta
- Historial de asignaciones del día

#### Jefe Seguridad
- Mapa/grilla de ocupación en vivo
- Auditoría de verificaciones e infracciones
- Reporte de incidentes

#### Jefe Servicios Generales
- Configuración de la sede (sectores, capacidad)
- Gestión de tarjetas físicas (alta/baja)
- Reportes de ocupación histórica
- Indicadores de gestión (estadía promedio, horas pico, etc.)

#### Directivo
- Dashboard global con KPIs
- Ocupación vs capacidad
- Tendencias semanales/mensuales
- Alertas de capacidad crítica
- Proyecciones de expansión

---

## Estrategia de Despliegue

| App | Build | Hosting/Distribución |
|-----|-------|---------------------|
| PWA Móvil | Vite + PWA plugin | Netlify (CDN global) |
| Tauri Desktop | Tauri bundler | MSI/AppImage/DMG instalable |

## Autenticación Unificada
- Supabase Auth con email+password o magic link
- RLS en PostgreSQL valida cada consulta según rol
- Una sesión funciona en ambas aplicaciones
