# Diseño T17 — Escaneo de doble cara

## Variables
- **FUENTE ÚNICA** de provisión: `docs/roadmap.md`, `src/screens/ScannerScreen.tsx`, `src/features/parser/contactParser.ts`, `src/types/contact.ts`, `src/features/ocr/ocrService.ts`.
- No se inventa navegación ni almacenamiento nuevo sin dato.

## Componentes modificados
- `src/screens/ScannerScreen.tsx`: añade máquina de estados de doble cara.
- `src/features/parser/combineSides.ts`: nuevo helper puro (o export desde contactParser si cabe).

## Estado en ScannerScreen
```ts
type ScanPhase = 'idle' | 'front-captured' | 'back-captured';
const [phase, setPhase] = useState<ScanPhase>('idle');
const [frontText, setFrontText] = useState<string | null>(null);
const [backText, setBackText] = useState<string | null>(null);
```

## Flujo
1. `idle`: botón "Capturar cara A". Tras capturar + OCR → `setFrontText(text)`, `setPhase('front-captured')`.
2. `front-captured`: muestra el texto extraído de la cara A y dos acciones: "Capturar cara B" y "Rehacer".
   - "Rehacer" → vuelve a `idle` y descarta `frontText`.
   - "Capturar cara B" → captura + OCR → `setBackText(text)` → combina → `parseContact(combined)` → `setPendingContact(contact)` (Review unificado).
3. `back-captured`: si el usuario pulsa "Rehacer cara A" → `setPhase('front-captured')` manteniendo `backText` (se sobrescribirá al volver a capturar la cara B).

## Helper combineSides
```ts
export function combineSides(frontText: string | null, backText: string | null): string {
  const parts = [frontText, backText].filter((t): t is string => !!t && t.trim().length > 0);
  if (parts.length === 0) return '';
  return parts.map((t) => t.replace(/\s+/g, ' ').trim()).join('\n');
}
```

## ScanMetadata
- `rawTextFront: frontText` y `rawTextBack: backText` (ya existe `rawTextBack?: string` en el tipo).

## Límites
- No cambia ReviewScreen (recibe el contacto ya parseado).
- No añade persistencia de "tarjeta a medias" entre sesiones.
- No toca la navegación de tabs.
