# CardParse — Estrategia de Crecimiento y Distribución v1.0

> Stack: React Native + TS + Expo · Licencia MIT · Demo: GitHub Pages · Público: agentes comerciales

---

## 1. Canales de Distribución (priorizados por orden de impacto)

| Prioridad | Canal | Acción concreta |
|-----------|-------|-----------------|
| 1 | **GitHub Repo** | Repo público desde día 1. README optimizado como landing page. Issues etiquetados `help-wanted` para atraer contribuidores técnicos. |
| 2 | **GitHub Pages** | Demo interactiva alojada en `cardparse.github.io`. Muestra el flujo de escaneo exportado (gifs/SF vídeos cortos). |
| 3 | **Hacker News (Product Hunt equivalente)** | Post en Show HN al lanzar v0.1.0. Timing: martes a jueves, 8–10h UTC. |
| 4 | **Reddit** | r/opensource, r/productivity, r/android, r/iOS. Post enfocado en "escanea tarjetas de visita sin backend ni cuenta". |
| 5 | **X/Twitter** | Hilo técnico: "cómo construí un OCR de tarjetas sin servidor". Mencionar @ReactNative, @expo, @VisionCamera. |
| 6 | **LinkedIn** | Post del autor (agente comercial) mostrando caso de uso real: escanear 50 tarjetas en un evento. |
| 7 | **Product Hunt** | Lanzar cuando haya funcionalidad estable (v0.2+ con exportación a contactos y vCard). | Product Hunt es el canal principal de adquisición para este público. |
| 8 | **Indie Hackers / r/startups** | Contar la historia de open source + nicho claros (agentes comerciales). |
| 9 | **Google Play / App Store** | Publicar build cuando esté lista la exportación nativa. Keywords en título y descripción (ver sección SEO). |
| 10 | **Comunidades de agentes comerciales** | Grupos de Facebook de ventas B2B, LinkedIn Sales Navigator grupos, comunidades de Inbound/Outbound sales. |

---

## 2. Estrategia de Launch

### Fase — Pre-launch (semana -2 a -1)
- [ ] README en GitHub con badges (Build CI, License MIT, Platform Android/iOS/Web).
- [ ] Demo en GitHub Pages en vivo con screenshots y 1-minute screen recording.
- [ ] Primer release etiquetado `v0.1.0` con tag semántico.
- [ ] Preparar asset visual para Product Hunt (banner 1200×628).

### Fase — Launch (día 0)
- [ ] Ship v0.1.0 con MIT License. Commit inicial con tag `v0.1.0`.
- [ ] Abrir issue `🚀 Marketing: first release` visible para la comunidad.
- [ ] Twitter/X: hilo técnico + link a repo + GIF del flujo de escaneo.
- [ ] Reddit: post en r/opensource "I built an open source business card scanner for sales agents".
- [ ] Hacker News: Show HN con título corto y foco en la ausencia de backend/registro.
- [ ] Si Product Hunt está listo: lanzar ese mismo día.

### Fase — Post-launch (días +1 a +14)
- [ ] Responder cada issue y PR los primeros 14 días.
- [ ] Recopilar feedback vía Issues (no encuestas externas — todo queda en GH).
- [ ] Publicar primer "devlog" en GitHub Discussions con métricas de adopción.
- [ ] Publicar README actualizado con sección de contribución activa y badges de stars/forks.

---

## 3. SEO Keywords

### Para GitHub README (título + description + README body)
```
business card scanner
contact scanner app
vCard generator
OCR business card
scan contact to phone
export contacts vcf
open source scanner app
sales tool mobile
card reader app
contact management app
```

### Para GitHub Pages / Web demo
```
card scanner app, business card OCR, export vCard, scan contacts,
mobile contact scanner, open source scanner, cardparse,
scan business card to phone, contact management, sales tool,
multi-language card scanner, business card reader API,
front camera scanner, double-sided card scan
```

### Para Play Store / App Store
```
business card scanner, contact scanner, vCard generator,
scan business cards, OCR contact, card reader,
export contacts, contact manager for sales
```

### Long-tail / nicho (enfocado en agentes comerciales)
```
sales agent contact scanner, business card to CRM,
scan cards after networking event, mobile lead capture,
offline business card scanner, no account contact importer
```

---

## 4. CTAs

### README (sección inferior, después de features y stack)

```markdown
## 👉 Get Started

```bash
npx create-expo-app@latest -t cardparse
# o clona directamente:
git clone https://github.com/<org>/cardparse.git
cd cardparse && npm install
npm run android   # o npm run ios
```

### 🚀 Quick Demo

Prueba la demo online: [https://cardparse.github.io](https://cardparse.github.io)

### ⭐ Show Your Support

Si CardParse te ahorró tiempo en tu próximo evento de ventas, dale una estrella al repo. Eso ayuda a que otros agentes la encuentren.

### 🐛 Report a Bug / 💡 Request a Feature

[Open an issue](https://github.com/<org>/cardparse/issues/new)

### 🤝 Contribute

Las contribuciones son bienvenidas. Mira [CONTRIBUTING.md](CONTRIBUTING.md) para empezar.
```

### Web Demo (página de GitHub Pages)

```
Hero section: "Scan business cards → Get vCards. No account. No backend. Open source."
[Download on GitHub]          → link a repo
[Try the Demo]                → link a demo interactivo o GIF
[Star on GitHub]              → link a stars del repo
[Report an Issue]             → link a new issue
```
CTA primario: "Star on GitHub" (mide adopción y visibilidad).
CTA secundario: "Try the Demo" (mide interés).
CTA terciario: "Contribute" (abre flujo de devs).

---

## 5. Métricas de Éxito (básicas, pragmáticas)

### A. Adopción (semanal tras launch)
| Métrica | Objetivo v0.1 (30 días) | Objetivo v0.3 (90 días) |
|---------|--------------------------|--------------------------|
| GitHub Stars | 100+ | 500+ |
| Forks | 20+ | 100+ |
| Issues abiertos (útil) | 30+ | 100+ |
| Pull Requests | 10+ | 50+ |
| Descargas de demo (Pages) | 500 visitas únicas | 5,000 visitas únicas |
| Instalaciones build (si publicadas en stores) | N/A (beta) | 100+ instalaciones |

### B. Engagement (semanal)
| Métrica | Objetivo |
|---------|----------|
| Tiempo en demo (Pages) | >45s por visita |
| Tasa de scroll de README | >60% hasta la sección de CTA |
| Issues resueltos por maintainer | <48h (días laborables) |
| PRs mergeados por semana | >=2 |

### C. Crecimiento orgánico (mensual)
| Métrica | Objetivo v1 (3 meses) |
|---------|------------------------|
| Tráfico desde búsqueda orgánica (demo Pages) | 40% del tráfico total |
| Referidos directos (otros repos que linkan) | >=5 repos externos |
| Menciones en Reddit/HN/LinkedIn | >=20 citas o enlaces |
| Estrellas nuevas por mes | >=30% crecimiento MoM |

### D. Calidad (continua)
| Métrica | Umbral |
|---------|--------|
| Test pass rate | >=90% |
| Typecheck + lint | 0 errores en CI |
| Build time (CI) | <5 min |

---

## 6. Reglas prácticas

1. **GitHub siempre primero.** Todo el tráfico de adquisición pasa por el repo. El README es la landing page.
2. **Sin cuenta = ventaja de marketing.** Cada post, demo y CTA enfatiza: "sin registro, sin backend, sin datos en servidores".
3. **Contenido visual > contenido textual.** GIFs de 15s del flujo de escaneo valen más que 1000 palabras de descripción.
4. **MIT License desde el día 1.** Es parte del messaging. Los developers que buscan libs open source para integrar buscan MIT sin restricciones.
5. **API OCR configurable es el diferenciador técnico.** Poner en cada canal: "funciona con cualquier API: OpenRouter, Google, custom — tú eliges".
6. **No gastar dinero.** Todas las tácticas son orgánicas. El presupuesto es tiempo del maintainer y contenido generado por la comunidad.