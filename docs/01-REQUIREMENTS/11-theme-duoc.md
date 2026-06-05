// @kind(document)
// @contract(in: identidad Duoc UC -> out: tokens de diseño)
// @scope(core)

# Theme Duoc UC — Tokens de Diseño

## Paleta de Colores — Institucional Duoc UC

| Token | Hex | Uso |
|-------|-----|-----|
| `--duoc-primary` | `#004481` | Navbar, botones principales, headers |
| `--duoc-primary-light` | `#0066B4` | Hover, active states |
| `--duoc-primary-dark` | `#002D55` | Textos importantes |
| `--duoc-secondary` | `#00A650` | Éxito, espacios libres, confirmación |
| `--duoc-accent` | `#F39200` | Advertencias, alertas, feature highlights |
| `--duoc-danger` | `#E30613` | Infracciones, errores, espacios ocupados indebidamente |
| `--duoc-bg` | `#F5F5F5` | Fondo general |
| `--duoc-surface` | `#FFFFFF` | Tarjetas, paneles |
| `--duoc-text` | `#1A1A1A` | Texto principal |
| `--duoc-text-secondary` | `#666666` | Texto secundario |

## Significado Semántico para Parking

| Estado | Color | Espacio |
|--------|-------|---------|
| Libre | `--duoc-secondary` (#00A650) | Verde — disponible |
| Ocupado | `--duoc-primary` (#004481) | Azul — en uso |
| Reservado | `--duoc-accent` (#F39200) | Naranjo — reservado |
| Bloqueado/Mantenimiento | `--duoc-danger` (#E30613) | Rojo — fuera de servicio |
| En disputa (infracción) | `--duoc-danger` (#E30613) + parpadeo | Rojo — alerta activa |

## Tipografía
- **Títulos**: Familia Duoc (si existe) o Inter/Sans-serif
- **Cuerpo**: Inter o Plus Jakarta Sans (legible en pantallas pequeñas)

## Componentes con Personalización Duoc

```typescript
// Ejemplo: token de espacio en Tailwind
module.exports = {
  theme: {
    extend: {
      colors: {
        'duoc-primary': '#004481',
        'duoc-primary-light': '#0066B4',
        'duoc-secondary': '#00A650',
        'duoc-accent': '#F39200',
        'duoc-danger': '#E30613',
      },
    },
  },
}
```

## Iconografía
- Usar Lucide React (ya viene con shadcn)
- Personalizar solo logo Duoc UC (SVG)
- Estados de espacio usar: `CircleCheck` (libre), `Circle` (ocupado), `Clock` (reservado), `Lock` (bloqueado)
