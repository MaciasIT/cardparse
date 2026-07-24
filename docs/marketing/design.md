# CardParse — Guía de Estilo Visual y Design System

> **Propósito:** Manual de referencia para comunicación de producto, capturas de pantalla y documentación pública (README, landing, docs).  
> **Versión:** v0.1.0 (CardParse)  
> **Audiencia interna:** equipo de producto, marketing y documentación.

---

## 1. Principios de diseño

- **Dark mode obligatorio.** Toda comunicación visual debe ser sobre fondo oscuro. No existe variante light.
- **Tono serio-técnico.** La app es una herramienta de trabajo, no un producto de consumo lúdico. Evitar curvas excesivas, gradientes brillantes o tipografías decorativas.
- **Contraste como prioridad.** El dorado (`#D4A017`) es acento — nunca color principal de lectura. Todo texto se lee sobre fondos oscuros con alto contraste.
- **Consistencia sobre decoración.** Espaciado, radios de esquina y alturas de touch consistentes en todos los elementos.

---

## 2. Paleta de colores

| Token | valor hex | uso concreto |
|-------|-----------|--------------|
| `bg-primary` | `#0B0F14` | Fondo principal de la app. Pantalla de scanner, historial, ajustes. |
| `bg-secondary` | `#141A21` | Superficias elevadas: cards de contacto, paneles de revisión, modales, inputs. |
| `text-primary` | `#E8ECF1` | Texto principal — nombres de contacto, campos de datos, labels. |
| `text-secondary` | `#8A95A3` | Texto secundario — subtítulos, placeholders, metadatos, timestamps del historial. |
| `accent` | `#D4A017` | Dorado — CTA principales, iconos de acción, marco del scanner, badges de confianza, separadores activos. Uso restrictivo (~5-8% de la superficie visual). |
| `accent-dim` | `#D4A01733` | Dorado al 20% de opacidad — fondos hover de botones, states selected de chips sin saturar. |
| `error` | `#D93636` | Errores de validación, fallos OCR, toast de error. |
| `success` | `#2EAC4F` | Confirmación de vCard generada, estado "scan completado". |
| `divider` | `#1E2730` | Líneas divisorias entre items del historial, separadores de sección. |

### Reglas de uso del dorado

- Botones principales, iconos principales del scanner (cuadro de frame), badges "Nuevo", badges "Cara A/B".
- Nunca usar como color de fondo completo ni como color de texto de párrafo.
- En hover/selection: usar `accent-dim` para feedback sutil sin romper la estética oscura.

---

## 3. Tipografía

| Nivel | Familia | Tamaño | Peso | Uso |
|-------|---------|--------|------|-----|
| **Display** | System (SF Pro / Roboto) | — | — | No usado en la app. Solo para documentación/landing. |
| **H1** | System | 28px | 700 (Bold) | Títulos de pantalla — Scanner, Historial, Ajustes. |
| **H2** | System | 22px | 600 (SemiBold) | Títulos de sección dentro de una pantalla (ej. "Resumen de contacto"). |
| **H3** | System | 18px | 600 (SemiBold) | Etiquetas de grupo de campos (ej. "Datos de la tarjeta"). |
| **Body** | System | 16px | 400 (Regular) | Texto corrido — nombres, resultados OCR, descripciones. |
| **Caption** | System | 13px | 400 (Regular) | Metadatos, timestamps, hints, texto de ayuda. |
| **Button** | System | 16px | 600 (SemiBold) | Texto en botones de acción. |
| **Code / vCard** | System Mono | 13px | 400 | Preview del vCard generado, datos técnicos. |

### Stack de fuentes (React Native)

```
IOS:  "SF Pro Display", "SF Pro Text", -apple-system, sans-serif
ANDROID:  "Roboto", "sans-serif", "sans-serif-medium"
FALLBACK:  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Reglas tipográficas

- No escalar más de 3 niveles de encabezado por pantalla.
- Líneas de texto body tienen un máximo de ~45 caracteres por línea en móviles para legibilidad.
- `text-secondary` se usa para todos los placeholders y descriptores de bajo énfasis.

---

## 4. Espaciado y grid

### Unidad base: 8pt grid

Todos los margenes, paddings y alturas de componente se alinean a múltiplos de 8px.

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Espaciado mínimo entre elementos inline (icono + label compacto). |
| `space-2` | 8px | Padding interno de chips, gaps entre items en un row. |
| `space-3` | 12px | Padding horizontal de cards, gap entre filas en listas. |
| `space-4` | 16px | Padding estándar de contenedores, gap entre secciones. |
| `space-5` | 24px | Padding de cards principales, margen entre grupos de campos. |
| `space-6` | 32px | Margen entre bloques grandes (ej. área de preview + botones de acción). |
| `space-8` | 48px | Padding vertical de pantalla (top/bottom safe area + contenido). |
| `space-10` | 64px | Separación entre secciones principales en onboarding. |

### Altura de touch mínima

Todos los elementos interactivos (botones, items de lista, tabs) tienen una altura mínima de **48px**, con padding interno de `space-3` (12px) vertical si el contenido es compacto.

---

## 5. Componentes principales

### 5.1 Botones (`Button`)

| Propiedad | Valor |
|-----------|-------|
| Altura | 48px |
| Padding horizontal | `space-4` (16px) |
| Radio de esquina | 12px |
| Fondo (primario) | `accent` (#D4A017) |
| Texto (primario) | `bg-primary` (#0B0F14), SemiBold 16px |
| Fondo (secundario/outline) | transparent, stroke 1px `accent` |
| Texto (secundario) | `accent` |
| Fondo (ghost) | transparent, texto `text-primary` |
| Disabled | opacidad 0.4, no elevación |

**Estados:** default → hover (fondo `accent-dim` para primarios) → pressed (scale 0.97) → disabled.

### 5.2 Cards (`Card`)

| Propiedad | Valor |
|-----------|-------|
| Padding | `space-3` (12px) |
| Radio de esquina | 12px |
| Fondo | `bg-secondary` (#141A21) |
| Borde | 1px `divider` (#1E2730) — solo para cards de lista |
| Elevación (shadow) | Ninguna en dark mode — usar borde sutil o separadores de `space-2` para diferenciar. |

**Cards de contacto (review):** fondo `bg-secondary`, radius 8px, contiene el nombre principal (`h3`), los campos en filas con label `text-secondary` + valor `text-primary`, y los chips Cara A / Cara B.

### 5.3 Chips (`Chip`)

| Propiedad | Valor |
|-----------|-------|
| Altura | 32px |
| Padding horizontal | `space-2` (8px) |
| Radio | 16px (píladas) |
| Fondo (default) | `bg-primary` |
| Borde | 1px `divider` |
| Texto | `text-secondary`, Caption 13px |
| Fondo (selected) | `accent-dim` |
| Texto (selected) | `accent`, SemiBold |
| Icono | a la izquierda del label, 16px |

**Uso:** selección de Cara A / Cara B en revisión de contacto; filtros en historial.

### 5.4 Navegación inferior (`Bottom TabBar`)

| Propiedad | Valor |
|-----------|-------|
| Altura | 64px (incluye safe area bottom) |
| Fondo | `bg-primary` |
| Borde superior | 1px `divider` |
| Tabs | 3: Scanner, Historial, Ajustes |
| Icono inactivo | `text-secondary`, 24px |
| Icono activo | `accent`, 24px |
| Label activo | `accent`, Caption 11px, SemiBold |
| Label inactivo | `text-secondary`, Caption 11px, Regular |
| Indicador activo | Barra dorada de 2px centrada abajo del icono |

### 5.5 Marco del Scanner (`ScannerFrame`)

| Propiedad | Valor |
|-----------|-------|
| Borde exterior | 2px `accent`, radio 8px |
| Esquinas | Esquinas redondeadas con 4px de radio, corners con indicadores dorados |
| Fondo interior | transparente (deja ver la cámara) |
| Guías | 2 líneas punteadas `accent-dim` horizontales y verticales, centradas en el frame |
| Overlay | `bg-primary` al 60% de opacidad fuera del frame |

### 5.6 Toast / Snackbar

| Propiedad | Valor |
|-----------|-------|
| Altura | 48px |
| Padding | horizontal `space-4`, vertical `space-2` |
| Radio | 8px |
| Fondo | `bg-secondary` |
| Borde | 1px `divider` |
| Icono de éxito | `success` (#2EAC4F) |
| Icono de error | `error` (#D93636) |
| Texto | `text-primary`, Body 16px |
| Posición | Bottom, centered, margen `space-4` desde el borde inferior |

### 5.7 Inputs (`TextInput`)

| Propiedad | Valor |
|-----------|-------|
| Altura | 48px |
| Padding horizontal | `space-3` (12px) |
| Radio | 8px |
| Fondo | `bg-primary` |
| Borde | 1px `divider` |
| Borde (focused) | 1px `accent` |
| Placeholder | `text-secondary`, 13px |
| Texto ingresado | `text-primary`, Body 16px |

### 5.8 Badges (`Badge`)

| Variante | Uso | Fondo | Texto |
|----------|-----|-------|-------|
| `new` | Nuevo contacto escaneado | `accent` | `bg-primary`, 11px SemiBold |
| `face` | Indica Cara A o Cara B | `bg-primary`, stroke `accent` | `accent`, 11px SemiBold |
| `status` | Estado (procesado, error) | según token (`success`/`error`/`bg-secondary`) | `text-primary`, 11px |

---

## 6. Screenshots y mockups — Instrucciones

### 6.1 Dispositivo de captura

- **Simulador:** iPhone 15 Pro (393 × 852 pts) o comparable Android (360 × 800 dp).
- **Escala:** capturas a 3x resolution para README (1179 × 2556 px mínimo).
- **Frame:** no aplicar frame del dispositivo en las imágenes finales que van al README; el README usa markdown inline sin adornos.

### 6.2 Screenshots por pantalla

#### A. Pantalla de onboarding (3 slides)
Cada slide ocupa el viewport completo (393×852):

1. **Slide 1.** Título "Bienvenido a CardParse", subtítulo "Escanea tarjetas de visita y conviértelas en vCards al instante", ilustración placeholder (icono de tarjeta dorado centrado), dots de indicador dorados en la parte inferior, botón "Comenzar" (primario, 48px) en la parte baja.
2. **Slide 2.** Título "Doble cara", subtítulo "CardParse lee ambas caras de la tarjeta para extraer todos los datos", ilustración placeholder (icono de tarjeta frente y reverso), navegación con dots.
3. **Slide 3.** Título "Listo para usar", subtítulo "Exporta vCards, importa en tu agenda favorita o comparte por correo", dos botones en columna: "Empezar a escanear" (primario) y "Después" (ghost). Bottom tabs marcados como "Scanner" activo con icono dorado.

#### B. Pantalla de scanner
- Frame dorado centrado ocupando ~60% del viewport superior.
- Cámara (placeholder gris oscuro con patrón de cuadrícula sutil dentro del frame).
- Botón de captura circular, `accent`, 64px de diámetro, centrado horizontalmente con `space-6` debajo del frame.
- Barra superior: título "Escanear" (H1) + icono de galería secundario a la derecha.
- Bottom tabs: Scanner activo (dorado), Historial (gris), Ajustes (gris).

#### C. Pantalla de revisión (review)
- Card de contacto con fondo `bg-secondary`, padding `space-4` (16px), radio 8px.
- Nombre del contacto en H2, campos (teléfono, email, empresa) en filas con label `text-secondary` y valor `text-primary`.
- Dos chips Cara A y Cara B debajo del campo de imagen, con el chip activo en `accent-dim` fondo.
- Botón "Guardar contacto" (primario, 48px) y "Escanear otra vez" (ghost) en la parte inferior, separados por `space-3`.

#### D. Pantalla de historial
- Lista de cards de contacto (estilo revisión pero compacto), cada uno con: nombre (text-primary), timestamp (text-secondary, Caption), y swipe-delete revela botón rojo de eliminación en el edge derecho.
- FAB (+) flotante en bottom-right, `accent` circle, 56px, asociado a la navegación al scanner.
- Empty state: icono de tarjeta centrado, texto `text-secondary` "No hay tarjetas escaneadas aún", y CTA "Escanear primera tarjeta".

#### E. Pantalla de ajustes
- Lista con sections: "Apariencia" (tema — actualmente solo dark), "Idioma", "Exportación por defecto".
- Cada row: label `text-primary`, switch/toggle para opciones, arrow chevron para sub-pantallas.
- Header: "Ajustes" (H1), versión "v0.1.0" en `text-secondary` Caption al pie de pantalla.

### 6.3 Directrices de composición para README

- **Formato:** PNG, sin esquinas redondeadas artificiales, sin sombras de ventana del OS. Captura limpia del viewport de la app.
- **Markdown inline:** `![Description](path/to/screenshot.png)` con ancho sugerido `width="393"` en markdown para consistencia de escala.
- **Alternar screenshots:** cada sección del README debe tener como máximo 1 screenshot; los detalles se explican con texto.
- **Anotaciones:** si se requiere señalar un elemento en una captura para el README, usar un círculo dorado con 2px de peso y label en `text-primary` sobre `bg-primary` opacidad 80% — no editar la imagen, describir la anotación en texto concreto.

---

## 7. Elevación y profundidad (Dark Mode)

En modo oscuro, la elevación no se expresa con sombras (son invisibles sobre fondo oscuro). Se usa una jerarquía de fondo:

| Nivel | Color | Uso |
|-------|-------|-----|
| 0 | `bg-primary` (#0B0F14) | Fondo base de pantalla |
| 1 | `bg-secondary` (#141A21) | Cards, modales, inputs, panels |
| 2 | `bg-secondary` + borde `divider` | Cards de lista, items interactivos |
| 3 | `bg-secondary` + borde `accent` 1px | Elementos seleccionados / focused |

---

## 8. Iconografía

- Conjunto: **Lucide Icons** (v4.x) como referencia de pesos y grid. Sistema compatible en React Native vía `react-native-vector-icons` o `lucide-react-native`.
- Tamaños estándar: 24px (navegación, toolbar), 16px (inline, chips, labels), 32px (empty states).
- Color: hereda del contexto — `text-primary` para activos, `text-secondary` para inactivos, `accent` para acciones principales.
- Estilo: **Outline** (no filled) para items de navegación inactivos; **Filled** para el item activo de cada tab.

---

## 9. Motion y microinteractions (referencia para capturas estáticas)

| Elemento | Animación | Duración | Easing |
|----------|-----------|----------|--------|
| Botones | Scale 0.97 en press | 100ms | ease-out |
| Chips Selected | Cross-fade + border color | 150ms | ease-in-out |
| Bottom Tab switch | Icon scale 1.1 + color fade | 200ms | ease-out |
| Scanner frame (scan line) | translateY repetida | 1.5s | linear |
| Swipe-to-delete | Slide left reveal | 180ms | ease-out |
| Onboarding dots | Fade + slide | 250ms | ease-in-out |

> Estos valores aplican en la implementación. Para capturas, documentar el estado **estable** (no en medio de transición).

---

## 10. Token resumen para implementación

```ts
// tokens/colors.ts (referencia para devs)
export const tokens = {
  colors: {
    bgPrimary:   '#0B0F14',
    bgSecondary: '#141A21',
    textPrimary: '#E8ECF1',
    textSecondary: '#8A95A3',
    accent:      '#D4A017',
    accentDim:   'rgba(212,160,23,0.20)',
    error:       '#D93636',
    success:     '#2EAC4F',
    divider:     '#1E2730',
  },
  spacing: {
    1: 4, 2: 8, 3: 12, 4: 16,
    5: 24, 6: 32, 8: 48, 10: 64,
  },
  radii: {
    sm: 8, md: 12, lg: 16, pill: 9999,
  },
  heights: {
    button: 48,
    input: 48,
    tabBar: 64,
    chip: 32,
  },
  touchMinHeight: 48,
  font: {
    body: 16,
    caption: 13,
    h1: 28,
    h2: 22,
    h3: 18,
    button: 16,
  },
};
```

---

*Documento generado para CardParse v0.1.0. Última actualización: 2026-07-24.*
