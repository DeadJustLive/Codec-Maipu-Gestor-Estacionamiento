// @kind(document)
// @contract(in: requisitos por actor -> out: especificación de vistas)
// @limit(2 aplicaciones: PWA móvil + Tauri desktop)

# Vistas por Aplicación y Rol

## App Móvil PWA

### Conductor

| Vista | Elementos | Lógica DB |
|-------|-----------|-----------|
| Login | Input RUT, botón "Ingresar" | Auth Supabase |
| Home | Tarjeta: "Tu espacio: A-15" (si activo), QR de tarjeta asignada, botón "Solicitar espacio" | `SELECT espacio_activo(rut)` |
| Mi Perfil | Nombre, RUT, email, teléfono | CRUD usuarios |
| Mis Vehículos | Lista de vehículos, botón agregar, selector vehículo activo | CRUD vehiculos |
| Historial | Lista asignaciones pasadas con entrada/salida y patente | `SELECT historial(rut)` |
| Notificaciones | Alertas de infracciones, recordatorios | Pull desde tabla |

### Guardia

| Vista | Elementos | Lógica DB |
|-------|-----------|-----------|
| Login | Email + password | Auth Supabase |
| Escáner | Cámara con viewfinder QR, input manual alternativo | - |
| Ficha Verificación | Espacio, conductor, patente esperada, vehículo, botones ✅ / ❌ | `SELECT verificar_espacio(codigo)` |
| Liberar | Input código tarjeta, confirmar liberación | `SELECT liberar_espacio(codigo)` |
| Dashboard rápido | Ocupación total, libres, infracciones hoy | `SELECT mv_ocupacion_actual` |

---

## App Desktop Tauri

### Digitador

| Vista | Elementos |
|-------|-----------|
| Panel Principal | Buscador de conductor por RUT/nombre |
| Registro Conductor | Formulario: RUT, nombre, email, teléfono |
| Registro Vehículo | Selector conductor + formulario: patente, marca, modelo, color |
| Asignar Espacio | Selector conductor → selector vehículo → botón "Asignar libre" → muestra resultado |
| Devolver Tarjeta | Input código → confirma liberación |
| Gestión Espacios | Tabla CRUD: sector, número, tipo, estado |
| Gestión Tarjetas | Tabla: código, espacio asignado, activa/inactiva |
| Asignaciones Hoy | Tabla filtrada por fecha actual |
| Historial Asignaciones | Tabla con filtros por fecha/conductor |

### Jefe Seguridad

| Vista | Elementos |
|-------|-----------|
| Mapa Ocupación | Grilla visual de espacios por sector (colores: verde=libre, rojo=ocupado, amarillo=en_disputa) |
| Feed Verificaciones | Timeline de verificaciones recientes |
| Infracciones | Tabla de infracciones: espacio, patente esperada, patente real, hora, estado (pendiente/resuelta) |
| Resolver Infracción | Botón resolver: anular o confirmar sanción |

### Jefe Servicios Generales

| Vista | Elementos |
|-------|-----------|
| Configuración Sede | Sectores, cantidad espacios por sector |
| Reportes | Selector de rango fecha, descargar reporte PDF/CSV |
| Indicadores | Estadía promedio, horas pico, ocupación semanal |
| Gestión Tarjetas | Alta/baja de tarjetas físicas, impresión QR |

### Directivo

| Vista | Elementos |
|-------|-----------|
| Dashboard Global | KPIs numéricos: ocupación % hoy, ingresos hoy, tendencia 30d |
| Gráfico Tendencia | Línea ocupación diaria últimos 30/60/90 días |
| Ocupación vs Capacidad | Barras por sector con línea de capacidad total |
| Alertas Expansión | Notificación si >85% ocupación por 7d consecutivos |
| Reportes Ejecutivos | Exportable a PDF |

## Navegación y Layout Compartido

```
Tauri Desktop Layout
┌──────────────────────────────────────────────┐
│  Sidebar (roles según usuario)               │
│  ┌────────────────────────────────────────┐  │
│  │  Dashboard                             │  │
│  │  Conductores                           │  │
│  │  Espacios                              │  │
│  │  Reportes       ← habilitado según rol  │  │
│  │  Configuración                         │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Contenido principal                   │  │
│  │  (cambia según ítem seleccionado)      │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```
