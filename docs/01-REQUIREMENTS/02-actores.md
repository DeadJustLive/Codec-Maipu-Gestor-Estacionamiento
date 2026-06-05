// @kind(document)
// @contract(in: necesidades del negocio -> out: actores y roles)

# Actores y Roles

## Mapeo de Actores

| # | Actor | Descripción | App | Prioridad |
|---|-------|-------------|-----|-----------|
| 1 | **Conductor** | Usuario final que estaciona su vehículo | PWA Móvil | Alta |
| 2 | **Guardia** | Verifica espacios y tarjetas en terreno | PWA Móvil | Alta |
| 3 | **Digitador** | Registra conductores, vehículos, asigna espacios/tarjetas | Tauri Desktop | Alta |
| 4 | **Jefe Seguridad** | Supervisa ocupación en vivo, auditoría de infracciones | Tauri Desktop | Media |
| 5 | **Jefe Servicios Grales** | Administra sede, gestión de espacios, reportes | Tauri Desktop | Media |
| 6 | **Directivo** | Visión global, estadísticas, indicadores de gestión | Tauri Desktop | Baja |

## Matriz de Permisos (RBAC)

| Recurso | Conductor | Guardia | Digitador | Jefe Seg. | Jefe SG | Directivo |
|---------|-----------|---------|-----------|-----------|---------|-----------|
| Propio perfil | CRUD | - | CRUD | - | - | - |
| Propios vehículos | CRUD | - | CRUD | - | - | - |
| Espacios | LEER | LEER | CRUD | LEER | CRUD | LEER |
| Tarjetas | - | LEER | CRUD | LEER | CRUD | - |
| Asignaciones | LEER (propias) | LEER + VERIFICAR | CRUD | LEER | LEER | LEER |
| Infracciones | LEER (propias) | CREAR | - | LEER | LEER | LEER |
| Dashboard en vivo | - | LEER | - | LEER | LEER | LEER |
| Reportes analíticos | - | - | - | LEER | LEER | LEER |
| Configuración sede | - | - | - | - | CRUD | - |
| Usuarios del sistema | - | - | CRUD | LEER | LEER | LEER |
