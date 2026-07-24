# CardParse — Marketing Copy v0.1.0

> **Documento de referencia para posicionamiento, pitch y materiales de conversión.**  
> Todo el contenido está trazado a HUs del backlog aprobado (plan.md). No se promete ninguna funcionalidad fuera de él.  
> Idioma: español de España. Tono: serio-técnico, tuteo, sin adorno.

---

## 1. Positioning Statement

Para agentes comerciales y profesionales que reciben tarjetas de visita físicas en cada reunión, CardParse es una app móvil open source que escanea ambas caras de la tarjeta, extrae los datos con IA y genera vCards listas para importar, a diferencia de los escáneres genéricos que no manejan doble cara ni entienden el contexto comercial.

**Sin backend. Sin cuenta. Sin sincronización en la nube.**

---

## 2. Pitch de Producto

CardParse transforma una tarjeta de visita física en un contacto digital en menos de 10 segundos. Abres la app, enfocas la tarjeta con la cámara, y la app detecta los bordes, recorta y extrae los datos automáticamente. Si la tarjeta tiene dorso con información adicional, la app lo escanea en el mismo flujo y fusiona ambas caras en una sola ficha. Editas lo que falte y exportas un archivo vCard estándar (RFC 6350) que se importa directamente en Google Contacts, Outlook o Apple Contacts.

El OCR y el parseo con IA corren por defecto en el dispositivo (MLKit); si el usuario quiere mayor precisión, puede conectar un proveedor externo (OpenRouter, Google Vertex AI o un endpoint custom) a través de Ajustes. Nada sale del teléfono salvo la imagen que el usuario elige explícitamente enviar al proveedor.

Licencia MIT desde el primer commit. Gratis. Open source. Sin registro.

---

## 3. Descripción Breve para README

CardParse es una app móvil open source para escanear tarjetas de visita y convertirlas en contactos. Extrae datos de ambas caras con IA, genera vCards estándar listas para importar y no requiere cuenta ni backend. Funciona offline (MLKit local) con la opción de conectar un proveedor OCR/IA externo configurable por el usuario.

---

## 4. FAQs (máximo 8)

**¿CardParse necesita conexión a Internet?**  
No para escanear ni guardar contactos. El OCR local de MLKit funciona completamente offline. Si has configurado un proveedor de IA externo, sí necesitarás conexión para el parseo de campos de esa cara. (HU-01, HU-02)

**¿Dónde se guardan mis contactos?**  
En el almacenamiento local del dispositivo con cifrado MMKV. No hay servidor, no hay nube. Si borras la app, se pierden los datos guardados localmente. (HU-07, arquitectura)

**¿Puedo escanear tarjetas en otros idiomas?**  
Sí. MLKit detecta el texto en multitud de idiomas. El parseo posterior con IA normaliza los campos al formato estándar independientemente del idioma de la tarjeta. (HU-04, HU-06)

**¿Qué pasa si la tarjeta tiene solo una cara?**  
CardParse adapta el flujo: si la app no detecta una segunda cara, generas la vCard solo con los datos de la cara escaneada. (HU-01b)

**¿Cuál es el formato de exportación?**  
vCard versión 3.0 (RFC 6350). Compatible con Google Contacts, Outlook, Apple Contacts y cualquier gestor que acepte el formato `.vcf`. (HU-07)

**¿Puedo usar CardParse sin configurar un proveedor de IA externo?**  
Sí. Por defecto, la app usa MLKit para OCR y parseo local. El proveedor externo es opcional y se configura en Ajustes → Proveedor OCR/IA. (HU-01, arquitectura)

**¿Funciona en iOS y Android?**  
Sí. Stack: React Native + Expo. Requiere al menos Android 8 (API 26) e iOS 15. (HU-01)

**¿Qué hago si un campo sale mal o vacío?**  
En la pantalla de revisión puedes editar cualquier campo antes de exportar. Si un campo no se detectó, edítalo manualmente y guarda. El log de escaneo conserva la imagen original por si necesitas re-escanear sin perder datos. (HU-04, HU-05)

---

## 5. Highlights de Features (vinculados al backlog aprobado)

Cada feature enumera la HU correspondiente para trazabilidad completa.

### Recorte y detección automática de tarjeta (`HU-02`)
La app detecta los bordes de la tarjeta de visita en tiempo real y recorta la imagen automáticamente antes de procesarla. Elimina ruido de fondo y ajusta la perspectiva sin intervención del usuario.

### Doble cara en un solo flujo (`HU-01b`)
Tras escanear la cara frontal, CardParse detecta la segunda cara y guía al usuario para voltear la tarjeta. Ambas caras se fusionan en una sola ficha de contacto, combinando los datos del delante y del reverso.

### Logo detectado como foto del contacto (`HU-01c`)
Cuando la cara frontal de la tarjeta incluye un logo corporativo, CardParse lo recorta y lo usa como imagen del contacto en la vCard generada.

### Mejora de imagen antes del OCR (`HU-03`)
Antes de pasar la imagen al motor de extracción, la app aplica corrección de contraste y nitidez para mejorar la legibilidad del texto, especialmente en condiciones de poca luz o tarjetas con impresión de bajo contraste.

### Detección y normalización automática de campos (`HU-04`)
La IA identifica y categoriza cada campo (nombre, empresa, teléfono, email, web) y lo normaliza al formato estándar. Funciona independientemente del idioma de la tarjeta.

### Edición manual antes de exportar (`HU-05`)
Tras el parseo automático, el usuario puede editar cualquier campo, corregir errores o rellenar datos que no se detectaron. Los cambios se guardan en la revisión antes de generar la vCard.

### Exportación a vCard estándar (`HU-07`)
Genera archivos `.vcf` compatibles con RFC 6350 (vCard 3.0). Incluye todos los campos detectados y la foto del logo si se escaneó. Compatible con Google Contacts, Outlook, Apple Contacts y cualquier gestor que acepte `.vcf`.

### Historial de escaneos con búsqueda (`HU-10`)
Todos los contactos escaneados se almacenan en el historial local con timestamp. Permite buscar contactos por nombre, empresa o campo telefónico. Incluye opción de eliminar con confirmación (`HU-12`).

---

## Trazabilidad de Features

| Feature | HU | Backlog status |
|---------|----|----------------|
| Recorte automático de tarjeta | HU-02 | Must Have |
| Doble cara en un solo flujo | HU-01b | Must Have |
| Logo como foto de contacto | HU-01c | Must Have |
| Mejora de imagen antes de OCR | HU-03 | Should Have |
| Detección y normalización de campos | HU-04 | Must Have |
| Edición manual previa a exportar | HU-05 | Must Have |
| Normalización de idioma y teléfonos | HU-06 | Should Have |
| Exportación a vCard estándar | HU-07 | Must Have |
| Compartir contacto sin guardar | HU-08 | Should Have |
| Guardado directo en agenda del dispositivo | HU-09 | Could Have |
| Historial con búsqueda | HU-10 | Must Have |
| Favoritos | HU-11 | Should Have |
| Eliminar con confirmación | HU-12 | Must Have |

---

*Documento generado para CardParse v0.1.0. Última actualización: 2026-07-24. No incluye funcionalidades fuera del backlog aprobado ni de la arquitectura documentada.*
