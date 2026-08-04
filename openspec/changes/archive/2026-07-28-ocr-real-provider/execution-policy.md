# Política obligatoria de ejecución para Dev

## Regla 1 — Verificación intermedia
Después de CADA tarea de `tasks.md`, Dev debe ejecutar `npm run typecheck && npm run test` antes de pasar a la siguiente. No se permite avanzar con typecheck roto.

## Regla 2 — Prohibición de dependencias fantasma
Antes de importar cualquier módulo nuevo, Dev debe comprobar primero si existe en `node_modules/` y en `package.json`. Si no está, lo marca como `PENDING` en la propuesta, no lo instala ni importa sin consultar.

## Regla 3 — Tests como entrada, no como salida
Para cada comportamiento nuevo, el test que lo valida debe escribirse ANTES del código. Si no hay test que cubra el caso, Dev no avanza.

## Aplicación
Estas reglas aplican a todas las tandas futuras, empezando por T14 y siguientes.
