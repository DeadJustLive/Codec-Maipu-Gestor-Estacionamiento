// @kind(config)
// @contract(in: AI session -> out: guided development)

# AGENTS.md — Codec-Maipu

## Stack
react + typescript + vite + shadcn

## Reglas
- Anotaciones OPL (@kind, @contract, @limit) en todo archivo nuevo
- Named exports, no default exports
- NO usar `any`
- Validar con `opl validate` antes de commit

## Workflow
1. `analyze_project` → entender estructura
2. `work_context_plan` → planificar si es feature/refactor
3. Implementar con anotaciones primero
4. `opl validate` → verificar
5. `work_context_close` → cerrar sesión
