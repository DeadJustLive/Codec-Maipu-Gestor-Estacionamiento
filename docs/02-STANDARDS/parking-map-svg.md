// @kind(guide)
// @contract(in: distribución física 110 espacios -> out: mapa SVG interactivo)
// @scope(parking)

# Mapa SVG del Estacionamiento

## Propósito
Componente visual interactivo que renderiza la disposición física de los 110 espacios, entradas, salidas y brújula. Se actualiza en tiempo real vía Supabase Realtime.

## Layout Físico (110 espacios)

```
                    ENTRADA PRINCIPAL
                          │
    ┌──────────────────────┴──────────────────────┐
    │  ┌────────────────────────────────────────┐  │
    │  │  SECTOR A  (1-20)                      │  │
    │  │  [01][02][03]...[20]                   │  │
    │  │  ──────────────────────────────────    │  │
    │  │  [21][22][23]...[40]                   │  │
    │  └────────────────────────────────────────┘  │
    │                    │                          │
    │  ┌────────────────────────────────────────┐  │
    │  │  SECTOR B  (41-70)                     │  │
    │  │  [41][42][43]...[70]                   │  │
    │  │  ──────────────────────────────────    │  │
    │  │  [71][72][73]...[100]                 │  │
    │  └────────────────────────────────────────┘  │
    │                    │                          │
    │  ┌────────────────────────────────────────┐  │
    │  │  SECTOR C (101-110) + Discapacitados   │  │
    │  │  [101][102]...[110] [D1][D2]           │  │
    │  └────────────────────────────────────────┘  │
    └──────────────────────┬──────────────────────┘
                          │
                    SALIDA VEHICULAR
```

## Estado de cada espacio por color SVG

| Estado | Color SVG | Hex | Clase CSS |
|--------|-----------|-----|-----------|
| Libre | `fill="#00A650"` | `#00A650` | `.estado-libre` |
| Ocupado | `fill="#004481"` | `#004481` | `.estado-ocupado` |
| Reservado | `fill="#F39200"` | `#F39200` | `.estado-reservado` |
| Mantenimiento | `fill="#E30613"` | `#E30613` | `.estado-mantenimiento` |
| Discapacitado | `fill="#9C27B0"` | `#9C27B0` | `.estado-discapacitado` |

## Componente Propuesto

```typescript
// @kind(component)
// @scope(parking)
// @compose(ParkingSVG, SpaceTooltip)
// @contract(in: espacios[] -> out: mapa interactivo con tooltips)

type ParkingSpace = {
  id: string
  sector: string
  numero: number
  estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento'
  tipo: 'normal' | 'discapacitado'
}

type Props = {
  espacios: ParkingSpace[]
  selectedId?: string       // espacio del conductor logueado
  onSelect?: (id: string) => void
  readOnly?: boolean
}
```

## Elementos del Mapa

1. **Rectángulos por espacio**: cada espacio es un `<rect>` con `fill` dinámico según estado
2. **Tooltip al hover**: muestra sector + número + estado + (si ocupado: patente)
3. **Entradas/Salidas**: marcadas con iconos de flecha + texto (ENTRADA verde, SALIDA roja) — suficiente para orientación
4. **Espacio activo del conductor**: borde `stroke-width="3" stroke="#FFD700"` (dorado) destacado

## Ejemplo de render (SVG inline en React)

```tsx
export function ParkingMap({ espacios, selectedId, onSelect }: Props) {
  const colores: Record<string, string> = {
    libre: '#00A650',
    ocupado: '#004481',
    reservado: '#F39200',
    mantenimiento: '#E30613',
    discapacitado: '#9C27B0',
  }

  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto">
      {/* Entrada */}
      <rect x={350} y={10} width={100} height={20} fill="#00A650" rx={4} />
      <text x={400} y={24} textAnchor="middle" fill="white" fontSize={10}>
        ENTRADA
      </text>

      {/* Sectores */}
      {espacios.map((esp) => (
        <rect
          key={esp.id}
          x={calcularX(esp.sector, esp.numero)}
          y={calcularY(esp.sector, esp.numero)}
          width={40}
          height={60}
          rx={4}
          fill={
            esp.tipo === 'discapacitado'
              ? colores.discapacitado
              : colores[esp.estado]
          }
          stroke={esp.id === selectedId ? '#FFD700' : 'none'}
          strokeWidth={esp.id === selectedId ? 3 : 0}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onSelect?.(esp.id)}
        />
      ))}

      {/* Salida */}
      <rect x={350} y={560} width={100} height={20} fill="#E30613" rx={4} />
      <text x={400} y={574} textAnchor="middle" fill="white" fontSize={10}>
        SALIDA
      </text>
    </svg>
  )
}
```
