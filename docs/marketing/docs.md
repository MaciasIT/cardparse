# CardParse — Documentación de usuario

> **CardParse v0.1.0** — Escanea tarjetas de visita, extrae datos con IA y genera vCards listas para importar.  
> Open source · Gratuito · sin backend · sin cuenta · sin sincronización en la nube.

---

## Quickstart — 3 pasos

Listo para empezar. No hace falta registrarse ni crear cuenta:

1. **Abre la app y pulsa Escanear.**  
   Toca el botón de cámara en la pantalla principal. Coloca la tarjeta de visita dentro del encuadre y tócala. CardParse detecta el borde automáticamente y recorta la imagen.

2. **Repite con la segunda cara.**  
   Si la tarjeta tiene dorso (suele llevar cargo, teléfono adicional o web), la app te pedirá voltearla. Repite el escaneo. Ambas caras se fusionan en una sola ficha de contacto.

3. **Revisa el resultado y exporta.**  
   Verás la ficha con nombre, empresa, teléfono, email y web ya rellenos. Puedes editar lo que falte o esté mal y luego exportar a **vCard** (estándar RFC 6350) o compartir el contacto directamente con cualquier app de tu teléfono.

---

## Cómo configurar el proveedor OCR/IA

CardParse usa MLKit como OCR por defecto (local, sin conexión). Si quieres mejorar la precisión del parseo de campos, puedes conectar un proveedor de IA externo. Para ello:

1. Ve a **Ajustes → Proveedor OCR/IA**.
2. Elige entre los proveedores disponibles:

   | Proveedor | Endpoint por defecto | Notas |
   |-----------|---------------------|-------|
   | **OpenRouter** | `https://openrouter.ai/api/v1` | Modelos abiertos y de terceros paso por paso; muchos gratuitos. |
   | **Google** | Endpoint de Vertex AI / Gemini API | Requiere clave API de Google Cloud. |
   | **Custom** | El que tú introduzcas | Cualquier endpoint compatible con la API de OpenAI (formato completions/chat). |

3. Introduce tu **clave API** y el **modelo** que prefieras (por ejemplo: `stepfun/step-3.7-flash:free`).
4. Activa el interruptor **Habilitado** y guarda.

La clave API se guarda de forma cifrada en el dispositivo y nunca se envía a los servidores de CardParse (que, recordemos, no tiene). Si desactivas el proveedor externo, la app vuelve automáticamente al OCR local de MLKit.

---

## Preguntas frecuentes (FAQ)

**¿CardParse necesita conexión a Internet?**  
No para escanear ni para guardar contactos. El OCR local de MLKit funciona completamente offline. Si has configurado un proveedor de IA externo, sí necesitarás conexión para el parseo de campos de esa cara.

**¿Dónde se guardan mis contactos?**  
En el almacenamiento local del dispositivo con cifrado MMKV. No hay servidor, no hay nube. Si borras la app, se pierden los datos guardados localmente (exporta tus vCards como respaldo).

**¿Puedo escanear tarjetas en otros idiomas?**  
Sí. MLKit detecta el texto en multitud de idiomas. El parseo posterior con IA normaliza los campos al formato estándar independientemente del idioma de la tarjeta.

**¿Y si la tarjeta tiene solo una cara?**  
No pasa nada. CardParse adapta el flujo: si la app no detecta una segunda cara o pulsas "Omitir", genera la vCard solo con los datos de la cara escaneada.

**¿Cuál es el formato de exportación?**  
vCard versión 3.0 (RFC 6350). Compatible con Google Contacts, Outlook, Apple Contacts y cualquier gestor que acepte el formato `.vcf`.

**¿La app usa mis datos para entrenar modelos?**  
No. CardParse es open source (licencia MIT) y no envía ningún dato fuera de tu dispositivo, salvo cuando tú eliges activamente un proveedor externo para mejorar el OCR (en cuyo caso solo se envía la imagen escaneada a ese proveedor, no a los servidores de CardParse).

**¿Cuántas tarjetas puedo guardar?**  
Hasta 5.000 contactos en almacenamiento local. Si necesitas más, exporta e importa vCards en tu manager de contactos preferido.

**¿Funciona en iOS y Android?**  
Sí. Stack: React Native + Expo. Requiere al menos Android 8 (API 26) e iOS 15.

---

## Troubleshooting básico

| Problema | Qué comprobar | Solución |
|----------|---------------|----------|
| **La cámara no abre o se queda negra** | Permisos de cámara concedidos? | Ajustes del sistema → CardParse → Cámara → Permitir. Reinicia la app. |
| **El OCR no detecta texto** | Tarjeta mal iluminada o inclinada | Asegúrate de que haya luz uniforme, coloca la tarjeta plana y alinea los bordes con el marco de la app. |
| **Los campos vienen vacíos o mal** | Proveedor de IA desactivado o mal configurado | Ve a Ajustes → Proveedor OCR/IA y verifica que el endpoint, la clave y el modelo son correctos. Si usas MLKit local, el parseo es menos preciso con tipografías complejas. |
| **No puedo exportar la vCard** | Permisos de contactos no concedidos | Ajustes del sistema → CardParse → Contactos → Permitir. |
| **La app va lenta o se cuelga** | Demasiados contactos almacenados | Reinicia la app. Si tienes cerca de 5.000 contactos, exporta los más antiguos y libera espacio. |
| **El logo no aparece como foto del contacto** | La cara del logo no fue nítida | Reescan la tarjeta asegurándote de que el logo quede centrado y sin reflejos. |
| **No encuentro la app escaneada en el historial** | La app se cerró antes de guardar | En la pantalla del Scanner, asegúrate de pulsar "Guardar" antes de salir. El escaneo provisional no se persiste. |

> Si el problema persiste, consulta la [documentación técnica](./architecture.md) o abre un issue en el repositorio de GitHub incluyendo: modelo de teléfono, versión de la app y capturas de pantalla del flujo de escaneo.

---

## Enlace a documentación técnica

La documentación técnica detallada (arquitectura, tipos de datos, flujo de cifrado, diseño de pantallas y plan de desarrollo) está disponible en el repositorio:

- **Arquitectura:** `docs/architecture.md`
- **Plan de desarrollo:** `docs/plan.md`
- **Diseño UX/UI:** `docs/design.md`
- **Repositorio GitHub:** [github.com/cardparse/cardparse](https://github.com/cardparse/cardparse)

---

*CardParse v0.1.0 · Licencia MIT · Open source y gratis · sin backend · sin cuenta · sin sincronización.*
