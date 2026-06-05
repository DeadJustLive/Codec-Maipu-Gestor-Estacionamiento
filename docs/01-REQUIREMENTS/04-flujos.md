// @kind(document)
// @contract(in: reglas de negocio -> out: flujos operacionales)
// @limit(sin IA, sin lectura de patentes automatizada)

# Flujos de Operación

## Flujo 1: Registro de Conductor (única vez)

```
Conductor → Digitador
  1. Conductor proporciona RUT al digitador
  2. Digitador busca en sistema: ¿ya existe?
     │
     ├─ Sí → confirma datos
     └─ No → crea registro: RUT, nombre, email, teléfono
  3. Digitador registra vehículo(s) del conductor:
     patente, marca, modelo, color
  4. Queda habilitado para solicitar estacionamiento
```

## Flujo 2: Asignación de Espacio

```
Conductor llega a la sede
  1. Digitador selecciona conductor (por RUT)
  2. Si tiene múltiples vehículos → selecciona cuál usó hoy
  3. Sistema asigna espacio libre:
     - Busca sector con disponibilidad
     - Crea asignación (conductor + vehículo + espacio)
  4. Digitador entrega tarjeta física (nro único + QR)
  5. Conductor estaciona, cuelga tarjeta del retrovisor
```

## Flujo 3: Verificación (Guardia)

```
Guardia recorre estacionamiento
  1. Abre app PWA, escanea QR de tarjeta colgada
     — O ingresa nro manual —
  2. App muestra:
     ┌──────────────────────────────┐
     │  Espacio: A-15              │
     │  Asignado a: Juan Pérez     │
     │  RUT: 11.111.111-1          │
     │  Patente esperada: ABCD-12  │
     │  Vehículo: Suzuki Swift gris│
     └──────────────────────────────┘
  3. Guardia coteja visualmente patente real vs app
     │
     ├─ (✓) Coincide → marca como VERIFICADO OK
     └─ (✗) No coincide →
          ├─ Marca INFRACCIÓN (patente real es otra)
          ├─ Sistema notifica al conductor
          └─ Espacio queda marcado en disputa
```

## Flujo 4: Liberación de Espacio

```
Conductor retira vehículo
  1. Conductor devuelve tarjeta física al guardia/digitador
  2. Guardia/digitador registra devolución en sistema:
     - Registra hora de salida
     - Libera espacio → pasa a "disponible"
     - Tarjeta vuelta al pool
```

## Flujo 5: Gestión de Infracciones

```
(Detonado por Flujo 3 cuando hay discrepancia)
  1. Infracción registrada: espacio, tarjeta, patente esperada, patente real
  2. Conductor recibe notificación (email/app)
  3. Jefe Seguridad revisa infracciones pendientes
  4. Puede resolver: anular infracción o aplicar sanción
```

## Flujo 6: Cierre Diario

```
Automático (trigger nocturno o manual)
  1. Verificar asignaciones sin liberación del día
  2. Generar reporte del día: ingresos, egresos, infracciones
  3. Actualizar vistas materializadas analíticas
```
