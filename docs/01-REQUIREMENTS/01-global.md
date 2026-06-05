// @kind(document)
// @contract(in: contexto universitario -> out: sistema de estacionamiento)
// @limit(alcance: sede Duoc UC Maipu)

# Visión General

## Nombre del Proyecto
Codec-Maipu — Sistema de Gestión de Estacionamientos Duoc UC Maipu

## Objetivo
Sistema digital que gestiona la asignación, verificación y análisis del uso de estacionamientos en la sede Duoc UC Maipu, reemplazando el control manual por un sistema híbrido físico+digital con tarjetas identificadoras.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend Mobile | React + TypeScript + Vite + Tailwind + shadcn (PWA) |
| Frontend Desktop | React + TypeScript + Vite + Tailwind + shadcn (Tauri) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Despliegue PWA | Netlify |
| Despliegue Desktop | Tauri (Windows/Linux/macOS) |

## Principios Arquitectónicos

1. **Lógica en DB** — Cálculos y validaciones en PostgreSQL (funciones, vistas, triggers)
2. **Frontend tonto** — UI solo renderiza datos, no procesa lógica de negocio
3. **RBAC en DB** — Row Level Security de Supabase para autorización por rol
4. **Base compartida** — Una sola base de datos para todas las aplicaciones
5. **Híbrido físico+digital** — Tarjetas físicas QR vinculadas a registros digitales

## Presupuesto Cloud
- **Tope**: $50 USD/mes
- **Estrategia**: Supabase Free (partida) → Supabase Pro ($25) + Netlify Pro ($19) = $44
- AWS descartado para fase inicial, reservado para futuras necesidades de ML
