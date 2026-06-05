// @kind(document)
// @contract(in: checkpoints bootcamp -> out: sprints, épicas y tickets)
// @limit(5 checkpoints → 5 sprints)

# Mapeo Checkpoints → Sprints, Épicas y Tickets

## Estructura de Competencia
Bootcamp CODEC AI Duoc UC Maipu — evaluación por checkpoints, top 3 premiados.

| Criterio Evaluación | Ponderación |
|---------------------|-------------|
| Análisis de negocio | — |
| Modelo gestión estacionamientos | — |
| Levantamiento de requisitos | — |
| Modelado UML (casos de uso, lógico, procesos) | — |
| Desarrollo ágil (Scrum, tablero, evidencias) | — |
| Diseño sistemas (Web+App+AI+Cloud) | — |

---

## Sprint 1 — CP1: Planificación y Setup

**Objetivo**: Definir caso de uso, repo GitHub/GitLab, entorno con herramientas Cloud + Supabase.

| Épica | Tickets (requisitos/tareas) |
|-------|----------------------------|
| EPIC-001: Setup del proyecto | T-001: Crear repo GitHub con estructura OPL |
| | T-002: Configurar Supabase CLI + Docker local |
| | T-003: Configurar proyecto Supabase Cloud (free tier) |
| | T-004: Definir y documentar stack tecnológico |
| EPIC-002: Levantamiento de requisitos | T-005: Documentar contexto y problema de negocio |
| | T-006: Definir actores y matriz RLS |
| | T-007: Especificar flujos de operación (6 flujos) |
| | T-008: Modelo de datos inicial (tablas core) |
| | T-009: Contratos OPL para vistas principales |
| EPIC-003: Modelo gestión estacionamientos | T-010: Definir 110 espacios (sectores, tipos) |
| | T-011: Definir ciclo de vida del espacio (estados) |
| | T-012: Definir reglas de asignación y liberación |
| EPIC-999: Gestión del proyecto | T-900: Configurar tablero ágil (GitHub Projects) |
| | T-901: Cargar épicas e historias de usuario |

---

## Sprint 2 — CP2: Modelos UML + Frontend

**Objetivo**: Diagramas UML, épicas e historias de usuario, interfaces de usuario.

| Épica | Tickets |
|-------|---------|
| EPIC-004: Modelamiento UML | T-013: Diagrama de casos de uso (todos los actores) |
| | T-014: Diagrama de clases / modelo lógico |
| | T-015: Diagrama de secuencia (flujo asignación) |
| | T-016: Diagrama de procesos (flujo completo) |
| EPIC-005: Prototipado UI | T-017: Maqueta PWA Conductor (mobile-first) |
| | T-018: Maqueta PWA Guardia (escáner + verificación) |
| | T-019: Maqueta Tauri Digitador (CRUDs) |
| | T-020: Maqueta Tauri Jefes + Directivo (dashboards) |
| EPIC-006: Setup frontend | T-021: Inicializar proyecto React + Vite + Tailwind |
| | T-022: Configurar tema Duoc UC (colores, tipografía) |
| | T-023: Configurar PWA (manifest, service worker) |
| | T-024: Configurar proyecto Tauri base |

---

## Sprint 3 — CP3: Implementación BD + Funcionalidades Core

**Objetivo**: Servidor aplicaciones, BD funcional, vista panel ocupación.

| Épica | Tickets |
|-------|---------|
| EPIC-007: Base de datos | T-025: Migración inicial (tablas core + RLS) |
| | T-026: Funciones SQL (asignar, verificar, liberar) |
| | T-027: Vistas materializadas (ocupación, flujo diario) |
| | T-028: Seed data (110 espacios + usuarios prueba) |
| EPIC-008: Panel ocupación (Guardia) | T-029: Componente MapaEspacios (grilla visual) |
| | T-030: Hook useRealtimeParking (suscripción WebSocket) |
| | T-031: Ficha verificación (escáner QR + cotejo) |
| | T-032: Dashboard rápido (ocupación, libres, infracciones) |

---

## Sprint 4 — CP4: Apps Conductor + Guardia + Canal Comunicación + IA

**Objetivo**: App Guardia, App Chofer funcionando, API actualización en tiempo real.

| Épica | Tickets |
|-------|---------|
| EPIC-009: App Conductor (PWA) | T-033: Login con RUT |
| | T-034: Home con espacio asignado + QR |
| | T-035: Mis vehículos (CRUD) |
| | T-036: Canal de incidencias (reportar a guardia) |
| | T-037: Historial de asignaciones |
| EPIC-010: App Guardia (PWA) | T-038: Login con email |
| | T-039: Escáner QR con cámara |
| | T-040: Flujo verificación (OK / infracción) |
| | T-041: Liberación manual de espacio |
| EPIC-011: Integración IA | T-042: Conectar Google AI Studio para procesamiento |
| | T-043: Integrar Antigravity Tool (si aplica) |
| | T-044: Endpoints de IA para análisis de incidencias |
| EPIC-015: Canal Comunicación | T-063: Modelo datos tickets (tabla + RLS) |
| | T-064: Componente TicketChat (conductor → guardia) |
| | T-065: Bandeja de tickets para guardia |
| | T-066: Notificaciones push con Supabase Realtime |
| EPIC-999: Pruebas unitarias | T-045: Pruebas de componentes core |
| | T-046: Pruebas de funciones SQL |

---

## Sprint 5 — CP5: Vistas Admin + Despliegue Cloud

**Objetivo**: Super Admin, Gestión Estacionamiento, integración funcional, deploy.

| Épica | Tickets |
|-------|---------|
| EPIC-012: Vista Super Admin (Tauri) | T-047: Dashboard global con KPIs |
| | T-048: Gestión de enrolamiento (usuarios) |
| | T-049: Reportes visuales de tendencias |
| | T-050: Alertas de capacidad crítica (>85%) |
| EPIC-013: Vista Gestión Estacionamiento | T-051: Gestión de espacios (CRUD sectores, números, tipos) |
| | T-052: Gestión de tarjetas físicas (alta/baja, asignar/desasignar) |
| | T-053: Reservas y bloqueos de seguridad |
| | T-054: Configuración de sede (capacidad, horarios) |
| EPIC-016: Mapa SVG + Métricas | T-067: Componente ParkingMap (SVG interactivo por sector) |
| | T-068: Tooltips y colores por estado del espacio |
| | T-069: Vistas materializadas de rotación (hora/día/mes/año) |
| | T-070: Dashboard de métricas con filtros de rango |
| EPIC-014: Despliegue Cloud | T-055: Dockerizar PWA (Nginx + build estático) |
| | T-056: Configurar CI/CD (GitHub Actions) |
| | T-057: Desplegar en Vercel o Google Cloud Run |
| | T-058: Documentación de arquitectura final |
| EPIC-999: Pitch final | T-060: Preparar presentación |
| | T-061: Demo funcional |
| | T-062: Video evidencias tablero ágil |

---

## Convención de Tickets

```
T-XXX: Descripción corta
  Prioridad: Alta/Media/Baja
  Depende de: T-YYY (opcional)
  Criterios de aceptación:
  - [ ] Criterio 1
  - [ ] Criterio 2
  Épica: EPIC-XXX
  Sprint: X
```

## Tablero Ágil
- Herramienta: GitHub Projects (o Trello)
- Columnas: Backlog → Sprint → In Progress → Review → Done
- Cada ticket debe tener evidencia asociada (commit, screenshot, PR)
