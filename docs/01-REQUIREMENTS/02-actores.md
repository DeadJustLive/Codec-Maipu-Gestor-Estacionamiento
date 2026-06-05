// @kind(document)
// @contract(in: necesidades del negocio -> out: actores y roles)

# Actores y Roles

## Mapeo de Actores

| # | Actor | Descripción | App | Prioridad |
|---|-------|-------------|-----|-----------|
| 1 | **Conductor** | Usuario final que estaciona su vehículo | PWA | Alta |
| 2 | **Guardia** | Verifica espacios y tarjetas en terreno | PWA | Alta |
| 3 | **Digitador** | Registra conductores, vehículos, asigna espacios/tarjetas | PWA | Alta |
| 4 | **Jefe Seguridad** | Supervisa ocupación en vivo, auditoría de infracciones | PWA | Media |
| 5 | **Jefe Servicios Grales** | Administra sede, gestión de espacios, reportes | PWA | Media |
| 6 | **Jefe Servicios Digitales** | Supervisa plataforma digital, integraciones, datos técnicos | PWA | Baja |
| 7 | **Directivo** | Visión global, estadísticas, indicadores de gestión | PWA | Baja |

## Matriz de Permisos (RBAC)

| Recurso | Conductor | Guardia | Digitador | Jefe Seg. | Jefe SG | Jefe SD | Directivo |
|---------|-----------|---------|-----------|-----------|---------|-----------|
| Propio perfil | CRUD | - | CRUD | - | - | - |
| Propios vehículos | CRUD | - | CRUD | - | - | - |
| Espacios | LEER | LEER | CRUD | LEER | CRUD | LEER |
| Tarjetas | - | LEER | CRUD | LEER | CRUD | - |
| Asignaciones | LEER (propias) | LEER + VERIFICAR | CRUD | LEER | LEER | LEER |
| Infracciones | LEER (propias) | CREAR | - | LEER | LEER | LEER |
| Dashboard en vivo | - | LEER | - | LEER | LEER | LEER |
| Reportes analíticos | - | - | - | LEER | LEER | LEER | LEER |
| Configuración sede | - | - | - | - | CRUD | - | - |
| Usuarios del sistema | - | - | CRUD | LEER | LEER | LEER | LEER |
| Integraciones / APIs | - | - | - | - | - | CRUD | - |
