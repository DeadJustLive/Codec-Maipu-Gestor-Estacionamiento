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

## Contexto del Bootcamp
- **Programa**: Bootcamp CODEC AI — Duoc UC Sede Maipú
- **Formato**: Competencia intersedes, top 3 premiados
- **Población**: 11.000+ estudiantes, 33 carreras, cientos de docentes y administrativos
- **Infraestructura**: Campus más extenso y poblado de Duoc UC Santiago/Chile
- **Metodología**: Scrum Guide 2020, evaluación por checkpoints (5 CPs)
- **Criterios evaluación**: Análisis de negocio, modelado UML, desarrollo ágil, diseño sistemas, pitch final

## Estacionamientos
- **Total espacios**: 110
- **Sistema actual**: Barrera automatizada con sensor lector de chip — solo valida acceso, no genera datos
- **Problema principal**: Sin visibilidad en tiempo real, sin trazabilidad conductor-vehículo-ubicación, sin analytics

## Principios Arquitectónicos

1. **Lógica en DB** — Cálculos y validaciones en PostgreSQL (funciones, vistas, triggers)
2. **Frontend tonto** — UI solo renderiza datos, no procesa lógica de negocio
3. **RLS como firewall** — Row Level Security de Supabase como única barrera de autorización
4. **Base compartida** — Una sola base de datos para todas las aplicaciones (PWA + Tauri)
5. **Híbrido físico+digital** — Tarjetas físicas QR vinculadas a registros digitales
6. **AI-first requirements** — Contratos OPL → Google AI Studio → código + docs humanos

## Stack Tecnológico

| Capa | Oficial (sugerido) | Elegido | Motivo |
|------|-------------------|---------|--------|
| Frontend | StitchWithGoogle | React + Vite + Tailwind + shadcn | Madurez, testing, ecosistema |
| Mobile | — | PWA (service worker) | Sin app stores, offline parcial |
| Desktop | — | Tauri | Ventanas nativas para admins |
| IA | Google AI Studio + Antigravity | Google AI Studio + Antigravity | Estándar del bootcamp |
| Backend/DB | Supabase + Firebase Auth | Supabase (unificado) | PostgreSQL real, RLS, Realtime |
| Cloud | AWS o Google Cloud | Vercel / Google Cloud Run | Serverless, CDN, Docker |

## Presupuesto Cloud
- **Tope**: $50 USD/mes
- **Estrategia**: Supabase Free (partida) → Supabase Pro ($25) + Vercel Pro ($20) = $45
- Google Cloud Run: alternativa serverless si el CP5 exige GCP
- AWS descartado para fase inicial, reservado para futura expansión
