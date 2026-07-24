# CardParse — Plan de Desarrollo Completo v1.0

> Documento de aprobación. Cero código hasta recibir luz verde explícita.

---

## Flujo de trabajo (actualizado)

```
FASE 0:  Descubrimiento
   ↓
FASE 0b: Marketing Alignment  ← NUEVO
   ↓
FASE 1:  Producto (HU + backlog)
   ↓
FASE 2:  Arquitectura
   ↓
FASE 3:  Diseño UX/UI
   ↓
FASE 4:  Aprobación  ← ESTE DOCUMENTO
   ↓
FASE 5:  Ejecución (TDD + commits)
   ↓
FASE 6:  Verificación (DoD + Gap Analysis)
   ↓
FASE 7:  Entrega (deploy + README)
```

**Regla:** Fase 4 no se pasa sin aprobación explícita.  
**Regla de oro:** lo que no está en backlog y arquitectura, no se promete en marketing. Lo que está en marketing sin HU, no existe.

---

## Fase 0 — Descubrimiento

- **Problema:** extraer automáticamente los datos de una tarjeta de visita física y pasarlos a la agenda del móvil.
- **Usuarios:** público general, foco en agentes comerciales.
- **Contexto:** open source / gratuita.
- **Tono:** serio-técnico, sin adorno.
- **Nombre provisional:** CardParse

---

## Fase 0b — Marketing Alignment

### Positioning statement

Para agentes comerciales y profesionales que reciben decenas de tarjetas de visita físicas, CardParse es una app móvil open source que escanea ambas caras de la tarjeta, extrae datos con IA y genera vCards listas para importar, a diferencia de los escáneres genéricos que no manejan dos caras ni entienden el contexto comercial.

### Público objetivo

- Agentes comerciales B2B.
- Asistentes / responsables de eventos.
- Freelancers y autónomos.
- Cualquier usuario que acumule tarjetas físicas y quiera migrarlas al móvil.

### Canales de distribución

- GitHub como canal principal.
- Documentación y demo alojadas en GitHub Pages desde el día 1.
- Referral orgánico: link en README, capturas, demo pública.

### Feature map — trazabilidad a HU

| Feature de marketing | HU asociada | Estado MVP |
|----------------------|-------------|------------|
| Escaneo instantáneo al abrir la app | HU-01 | Must Have |
| Doble cara en un solo flujo | HU-01b | Must Have |
| Logo detectado como imagen del contacto | HU-01c | Must Have |
| Recorte automático de tarjeta | HU-02 | Must Have |
| Mejora de imagen antes del OCR | HU-03 | Should Have |
| Detección automática de campos | HU-04 | Must Have |
| Edición manual antes de exportar | HU-05 | Must Have |
| Normalización de idioma y teléfonos | HU-06 | Should Have |
| Exportación a vCard estándar | HU-07 | Must Have |
| Compartir contacto sin guardar | HU-08 | Should Have |
| Guardado directo en agenda del dispositivo | HU-09 | Could Have |
| Historial con búsqueda | HU-10 | Must Have |
| Favoritos | HU-11 | Should Have |
| Eliminar con confirmación | HU-12 | Must Have |
| Onboarding 3 pantallas | HU-13 | Must Have |
| Cambio de idioma ES/EN | HU-14 | Should Have |
| Escaneo en lote | HU-15 | Could Have |

### Promesas explícitamente fuera de alcance (Won't Have)

- No hay backend propio ni cuenta de usuario.
- No hay sincronización en la nube.
- No hay OCR 100% offline de alta precisión sin API externa.
- No hay integración nativa profunda con apps de terceros más allá de vCard y share sheet.

---

## Fase 1 — Producto

Épicas y backlog priorizado en documento separado `docs/plan.md`.  
Resumen ejecutivo: 44 puntos Must Have para MVP.

Estados por epica:
- Épica 1 Captura y OCR: completada
- Épica 2 Parseo IA: completada
- Épica 3 Exportación: completada
- Épica 4 Historial: completada
- Épica 5 Onboarding: completada

Criterios de aceptación: Given/When/Then en todas las HU.  
Formato INVEST aplicado a cada historia.

---

## Fase 2 — Arquitectura

Documento técnico en `docs/architecture.md`.

### Stack

| Capa | Tecnología | Nota |
|------|-----------|------|
| Framework | React Native 0.76+ | Multiplataforma |
| Lenguaje | TypeScript 5 | Estricto |
| Navegación | React Navigation 7 | |
| Cámara | react-native-vision-camera 4 | |
| OCR local | MLKit Text Recognition | Fallback |
| OCR/IA | API externa configurable por usuario | OpenRouter, Google, custom |
| Storage | MMKV | |
| Exportación | react-native-contacts + vcf + share sheet | |
| Estado | Zustand | |
| Tests | Vitest + Detox | |

### Modelo de datos clave

- `Contact` con `FieldSource` por campo (`front` / `back` / `both`)
- `ScanMetadata` para reparseo sin reescanear
- `ProviderConfig` para OCR configurable
- `ContactPhoto` para logo recortado

### Reglas de seguridad

- API keys con cifrado cuando haya biometría.
- Fotos descartadas tras exportar; no se suben a servidores del proyecto.
- Sin credenciales hardcodeadas.
- Logs sin valores sensibles.

---

## Fase 3 — Diseño UX/UI

Documento en `docs/design.md`.

### Flujo principal MVP

Scanner → Cara A → Cara B → Review unificada → Export vCard → Share/Guardar

### Pantallas

- Onboarding
- Scanner
- Review
- Historial
- Ajustes

### Estética

Dark mode obligatorio.  
Paleta seria: fondo oscuro, acento dorado restrained.  
Sin ornamentos. Tipografía sistema.  
Navegación por tabs inferior.

---

## Fase 4 — Aprobación

Este documento es la foto de lo aprobado hasta el momento.  
Cualquier cambio posterior pasa por modificar este documento y volver a aprobar.

---

## Fase 5 — Ejecución

- Scaffold base sin features.
- Features por tandas con TDD.
- Commits semánticos.
- Tests unitarios primero: parser, normalizadores, vCard, MMKV.
- Después features de cámara, OCR, exportación.

---

## Fase 6 — Verificación

- Typecheck + lint + test + build.
- Ejecución de cada criterio de aceptación de HU Must Have.
- Gap Analysis obligatorio:
  - Cada feature de marketing debe tener HU implementada y testeada.
  - Cualquier feature prometida sin HU = deuda, no se entrega hasta resolverse.

---

## Fase 7 — Entrega

- Repositorio GitHub público.
- Demo en Pages con README profesional.
- Licencia MIT desde commit inicial.
- Sin backend ni servicios exteriores del proyecto.

---

## ¿Qué falta aún?

- Elegir path de ejecución:
  - A) Yo ejecuto el scaffold y la primera tanda, con tu feedback tras cada commit.
  - B) Tú ejecutas y yo oriento solo cuando haya dudas.
