# CardParse — Roadmap de Desarrollo

> Actualizado: 25 julio 2026
> Formato: Tandas → cada tanda = commit atómico con sentido propio

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completado |
| 🔄 | En progreso |
| ⬜ | Pendiente |
| 🛑 | Bloqueado |

---

## FASE 0-4: Planificación y aprobación ✅

Backlog de 15 HU aprobado, arquitectura definida, marketing aligned.

---

## FASE 5: Ejecución — Tandas completadas

| Tanda | Commits | Lo que entregó | HU relacionadas |
|-------|---------|----------------|-----------------|
| **T1** ✅ | `8d6751c` | Scaffold proyecto, navegación base con Tabs, tema oscuro | — |
| **T2** ✅ | `c47594d` | Parser de OCR (`contactParser`), hook de historial (`useHistory`) | HU-04 |
| **T3** ✅ | `1da1f4a` | Navegación real (Scanner, Historial, Ajustes), tema + componentes UI | — |
| **T4** ✅ | `6eca249` | Detalle de contacto, export vCard, flujo Scanner→Historial | HU-07, HU-12 |
| **T5** ✅ | `36e710d` | Historial avanzado, detalle completo, onboarding, ajustes | HU-10, HU-13 |
| **T6** ✅ | `14ec7f3`+`d280654` | Share nativo de contactos, permisos, ajustes reales, coverage | HU-08 |
| **T7** ✅ | `32a3b71` | Ajustes funcionales, onboarding pulido, UI final | HU-13 |
| **T8** ✅ | `24482bf` | Historial navegable, onboarding real, tests export | HU-10, HU-13 |
| **T9** | _saltada_ | — | — |
| **T10** ✅ | `a76c3c7` | Typecheck, historial navegable, onboarding real, tests export | HU-10 |
| **T11** ✅ | `4190f15` | Polish UI scanner, feedback visual de captura, ajustes con filas reales | HU-01 |
| **T12** ✅ | `7e73887` | Typecheck global limpio, imports corregidos, tsconfig extendido | — |
| **T13** ✅ | `d07e271`→`a0d8c17` | Build EAS funcional, AsyncStorage, dependencias alineadas, React Navigation puro | — |
| **T14** ✅ | `f7810d7` | OCR real externo vía proveedor configurable (ocrService + normalizeOcrResponse) | HU-01, HU-04 |
| **T15** ✅ | `0934dd3` | Confirmación y edición mínima antes de guardar (ReviewScreen) | HU-05 |
| **T16** ✅ | `228f92a` | Configuración visible del proveedor OCR en Ajustes (endpoint, modelo, API key enmascarada, toggle activo) | HU-01, HU-04 |
| **T17** ✅ | `ce01014` | Escaneo de doble cara: Cara A → Cara B → Review unificado (`combineSides`) | HU-01b |
| **T18** ✅ | `f5abe6c` | Compartir sin guardar desde la Review (`shareContactVCard` sin pasar por historial) | HU-08 |

---

## FASE 6-7: Lo que falta (priorizado)

### 🥇 Prioridad Alta — MVP funcional real

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T19** ⬜ | **Recorte automático** | Detectar bordes de la tarjeta en la imagen y recortar antes de enviar a OCR. | HU-02 |

### 🥈 Prioridad Media — Mejoras MVP

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T19** ⬜ | **Recorte automático** | Detectar bordes de la tarjeta en la imagen y recortar antes de enviar a OCR. | HU-02 |
| **T20** ⬜ | **Onboarding completo** | Tercera pantalla de onboarding (tutorial de doble cara). | HU-13 |
| **T21** ⬜ | **Búsqueda en historial** | Barra de búsqueda/filtro en el historial. | HU-10 |

### 🥉 Prioridad Baja — Post-MVP

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T22** ⬜ | Mejora de imagen previa OCR | HU-03 |
| **T23** ⬜ | Normalización teléfonos/idioma | HU-06 |
| **T24** ⬜ | Favoritos | HU-11 |
| **T25** ⬜ | Detección de logo | HU-01c |
| **T26** ⬜ | Guardado en agenda del dispositivo | HU-09 |
| **T27** ⬜ | Cambio idioma ES/EN | HU-14 |
| **T28** ⬜ | Escaneo en lote | HU-15 |

---

## Próximo paso

**T19 — Recorte automático:** detectar bordes de la tarjeta en la imagen y recortar antes de enviar a OCR (HU-02).
