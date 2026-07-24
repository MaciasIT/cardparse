# CardParse — Tanda 1: Scaffold ejecutable

Objetivo: que el proyecto arranque y navegue entre pantallas.
 Alcance: solo scaffold y navegación. Sin lógica de escaneo ni OCR todavía.

## Criterios de éxito
- `npm run typecheck` pasa sin errores.
- La app abre con navegación inferior: Scanner / Historial / Ajustes.
- Existen las pantallas base y componentes visuales mínimos.
- Al final: commit limpio en `main` y reporte breve.

## C0: Validar projecto base
- Verifica que `npm install` está completado en `/home/m1txel/Escritorio/02_Proyectos/Michel_Macias_Repos/cardparse`.
- Lee `package.json`, `app.json`, `babel.config.js`, `tsconfig.json`, `src/lib/mmkv.ts`, `src/lib/storage.ts`, `src/types/contact.ts`.

## C1: Ajustar project config
- Actualiza `app.json` con nombre `CardParse`, bundle identifier y esquema.
- Actualiza `babel.config.js` al estándar Expo RN 0.76.
- Ajusta `tsconfig.json` ya corregido en backend; no lo cambies si ya pasa `tsc --noEmit`.

## C2: Navegación base
- Crea `src/navigation/AppNavigator.tsx` con bottom tabs: Scanner, Historial, Ajustes.
- Crea `src/navigation/types.ts`.
- Crea pantallas mínimas en `src/screens/`.

## C3: Sistema visual mínimo
- Crea componentes reutilizables: `src/components/Button.tsx`, `src/components/Card.tsx`, `src/components/Chip.tsx`, `src/components/Input.tsx`.
- Usa tema oscuro y acento dorado para pruebas visuales.

## C4: Historial temporal
- Crea hook `src/features/history/useHistory.ts` con MMKV.
- Implementa 3 métodos mínimos: `getAll`, `add`, `remove`.
- Deja datos demo locales para desarrollo.

## C5: Verificación final
- Ejecuta `npm run typecheck`.
- Commit con mensaje: `feat: Tanda 1 — scaffold ejecutable con navegación base`.
- Devuelve resumen con archivos tocados y estado final.
