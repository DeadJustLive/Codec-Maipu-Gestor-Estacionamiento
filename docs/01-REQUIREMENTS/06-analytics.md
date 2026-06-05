// @kind(document)
// @contract(in: datos de operación -> out: inteligencia de negocio)
// @limit(sin ML, todo con SQL en PostgreSQL)

# Dashboard y Analítica

## KPIs Definidos

| KPI | Fórmula SQL | Frecuencia | ¿Quién lo ve? |
|-----|------------|------------|---------------|
| Ocupación actual | `COUNT(*) WHERE estado=ocupado` | Tiempo real | Guardia, Jefe Seg. |
| Ingresos hoy | `COUNT(*) WHERE DATE(entrada)=TODAY` | Tiempo real | Jefe Seg., Directivo |
| Tasa ocupación | `ocupados / total_espacios * 100` | Tiempo real | Todos |
| Estadía promedio | `AVG(salida - entrada)` | Diario | Jefe SG, Directivo |
| Horas pico | `MODE(EXTRACT(HOUR FROM entrada))` | Semanal | Jefe SG |
| Usuarios recurrentes | `COUNT(asignaciones) > N` en período | Mensual | Directivo |
| Infracciones/día | `COUNT(*) FILTER(WHERE infraccion)` | Diario | Jefe Seg. |
| Tasa verificación | `verificados / total_asignaciones * 100` | Diario | Jefe Seg. |
| Giro por hora | Promedio entradas/salidas por hora | Semanal | Jefe SG |

## Alertas Automáticas

| Alerta | Condición | Destinatario |
|--------|-----------|-------------|
| Capacidad crítica | Ocupación > 85% por más de 1h | Jefe SG, Directivo |
| Espacio bloqueado | Misma asignación activa > 8h sin verificar | Guardia, Jefe Seg. |
| Sin liberación | Asignación sin salida al cierre del día | Digitador |
| Infracción reportada | Nueva infracción creada | Conductor, Jefe Seg. |

## Vistas de Dashboard

### Dashboard Tiempo Real (Jefe Seguridad / Guardia)
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Ocupación       │  Libres          │  En disputa      │
│  ████████ 73%    │  ░░ 27%          │  ⚠ 2             │
├─────────────────┴─────────────────┴─────────────────┤
│  Gráfico: Ocupación por sector (barras)              │
├─────────────────┬──────────────────────────────────┤
│  Últimas        │  Sector A: 18/20 ocupados         │
│  verificaciones │  Sector B: 30/40 ocupados         │
│  (feed)         │  Sector C: 5/5 ocupados (lleno)   │
└─────────────────┴──────────────────────────────────┘
```

### Dashboard Analítico Mensual (Directivo)
```
┌────────────────────────────────────────────────────┐
│  Tendencia Ocupación (últimos 30 días)              │
│  📈 Línea: día a día con promedio móvil 7 días      │
├────────────────────────────────────────────────────┤
│  Capacidad vs Demanda                               │
│  📊 Barras apiladas: capacidad total / ocupación    │
│  ⚠ Alerta si demanda > 85% capacidad por 7d        │
├────────────────────────────────────────────────────┤
│  Datos Clave                                        │
│  ┌──────────┬──────────┬──────────┬──────────┐      │
│  │  Ingresos │  Egresos  │  Recur.   │ Estadía   │      │
│  │   1,234   │   1,198   │   65%     │  4.2h     │      │
│  └──────────┴──────────┴──────────┴──────────┘      │
└────────────────────────────────────────────────────┘
```

## Proyección de Expansión

Regla de negocio: si el **promedio de ocupación máxima diaria** supera el 85% de la capacidad total durante 7 días consecutivos → se genera una **alerta de expansión** para Directivo y Jefe SG, indicando:

- Días con ocupación crítica
- Horario de mayor congestión
- Sectores más demandados
- Sugerencia: capacidad adicional necesaria estimada
