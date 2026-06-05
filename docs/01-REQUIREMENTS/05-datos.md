// @kind(document)
// @contract(in: flujos de negocio -> out: modelo de datos)
// @limit(lógica de negocio resuelta en DB, no en frontend)

# Modelo de Datos

## Tablas Core

### usuarios
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| rut | text UNIQUE | Rut chileno sin puntos con guión |
| nombre | text | |
| email | text | |
| telefono | text | |
| rol | enum | conductor / guardia / digitador / jefe_seguridad / jefe_sg / directivo |
| created_at | timestamptz | |
| activo | boolean | |

### vehiculos
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| usuario_id | uuid FK → usuarios | |
| patente | text UNIQUE | |
| marca | text | |
| modelo | text | |
| color | text | |
| activo | boolean | |

### espacios
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| sector | text | Ej: "A", "B", "Norte", "Sur" |
| numero | integer | Nro dentro del sector |
| tipo | enum | normal / discapacitado / electrico / visita |
| estado | enum | libre / ocupado / mantenimiento |
| sede | text | |

### tarjetas
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| codigo | text UNIQUE | Código QR impreso |
| espacio_id | uuid FK → espacios | |
| activa | boolean | |

### asignaciones
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| usuario_id | uuid FK → usuarios | |
| vehiculo_id | uuid FK → vehiculos | |
| espacio_id | uuid FK → espacios | |
| tarjeta_id | uuid FK → tarjetas | |
| entrada | timestamptz | |
| salida | timestamptz | nullable |
| verificada_en | timestamptz | nullable |
| verificada_por | uuid FK → usuarios | guardia que verificó |
| estado | enum | activa / finalizada / en_disputa |

### infracciones
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| asignacion_id | uuid FK → asignaciones | |
| patente_real | text | La que el guardia observó |
| reportada_por | uuid FK → usuarios | guardia |
| resuelta_por | uuid FK → usuarios | jefe seguridad |
| resuelta_en | timestamptz | |
| estado | enum | pendiente / resuelta / anulada |

## Funciones SQL (lógica en DB)

```sql
-- Asignar espacio a un conductor
CREATE OR REPLACE FUNCTION asignar_espacio(
  p_rut text, p_patente text
) RETURNS jsonb
  -- Busca espacio libre, crea asignación, marca espacio ocupado
  -- Retorna: {sector, numero, codigo_tarjeta}

-- Verificar espacio por tarjeta
CREATE OR REPLACE FUNCTION verificar_espacio(
  p_codigo_tarjeta text
) RETURNS jsonb
  -- Retorna: {conductor, patente_esperada, espacio, vehiculo}
  -- Valida que la asignación esté activa

-- Liberar espacio
CREATE OR REPLACE FUNCTION liberar_espacio(
  p_codigo_tarjeta text
) RETURNS jsonb
  -- Marca salida, libera espacio, desactiva tarjeta
```

## Vistas Analíticas (cálculos pre-hechos)

```sql
-- Vista: ocupación en vivo por sector
CREATE MATERIALIZED VIEW mv_ocupacion_actual AS
SELECT sector, estado, COUNT(*) total FROM espacios GROUP BY sector, estado;

-- Vista: flujo diario últimos 30 días
CREATE MATERIALIZED VIEW mv_flujo_diario AS
SELECT DATE(entrada) dia, COUNT(*) ingresos,
       COUNT(*) FILTER(WHERE salida IS NOT NULL) egresos
FROM asignaciones GROUP BY dia;

-- Vista: horas pico
CREATE VIEW v_horas_pico AS
SELECT EXTRACT(HOUR FROM entrada) hora, COUNT(*) frecuencia
FROM asignaciones GROUP BY hora ORDER BY frecuencia DESC;

-- Vista: estadía promedio
CREATE VIEW v_estadia_promedio AS
SELECT AVG(salida - entrada) duracion FROM asignaciones WHERE salida IS NOT NULL;
```

## Seguridad (RLS)

```sql
-- Ejemplo: conductor solo ve sus propias asignaciones
CREATE POLICY conductor_self ON asignaciones
  FOR SELECT USING (usuario_id = auth.uid() OR rol() IN ('guardia', 'digitador', 'jefe_seguridad', 'directivo'));
```
