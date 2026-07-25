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

---

## FASE 6-7: Lo que falta (priorizado)

### 🥇 Prioridad Alta — MVP funcional real

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T14** ⬜ | **OCR real** | Conectar API OpenRouter/Google para OCR real. No simulación. El scanner captura la imagen, la envía a la API y parsea la respuesta. | HU-01, HU-04 |
| **T15** ⬜ | **Edición manual** | Pantalla Review/Edit entre captura y guardado. El usuario ve los datos extraídos, los corrige y confirma antes de guardar. | HU-05 |
| **T16** ⬜ | **Doble cara** | Flujo: capturar Cara A → voltear → capturar Cara B → Review unificado con ambos lados. | HU-01b |
| **T17** ⬜ | **Compartir sin guardar** | Botón "Compartir" directo desde la Review, sin pasar por historial. | HU-08 |

### 🥈 Prioridad Media — Mejoras MVP

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T18** ⬜ | **Recorte automático** | Detectar bordes de la tarjeta en la imagen y recortar antes de enviar a OCR. | HU-02 |
| **T19** ⬜ | **Onboarding completo** | Tercera pantalla de onboarding (tutorial de doble cara). | HU-13 |
| **T20** ⬜ | **Búsqueda en historial** | Barra de búsqueda/filtro en el historial. | HU-10 |

### 🥉 Prioridad Baja — Post-MVP

| # | Tanda | Descripción | HU |
|---|-------|-------------|----|
| **T21** ⬜ | Mejora de imagen previa OCR | HU-03 |
| **T22** ⬜ | Normalización teléfonos/idioma | HU-06 |
| **T23** ⬜ | Favoritos | HU-11 |
| **T24** ⬜ | Detección de logo | HU-01c |
| **T25** ⬜ | Guardado en agenda del dispositivo | HU-09 |
| **T26** ⬜ | Cambio idioma ES/EN | HU-14 |
| **T27** ⬜ | Escaneo en lote | HU-15 |

---

## Próximo paso

**T14 — OCR real.** Conectar el scanner con OpenRouter o Google Vision para que la captura no sea simulada sino que devuelva datos reales parseados.

¿Sigo por ahí?
