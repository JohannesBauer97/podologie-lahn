# Podologie Lahn: Statische Website – Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Angular-Website wird pixelgleich als reines HTML/CSS/JS in `site/` neu gebaut. Dazu kommt eine eigenständige Wartungsseite in `maintenance/`, und ein GitHub-Actions-Button deployt wahlweise einen der beiden Ordner.

**Architecture:** Eine HTML-Datei pro Seite mit kopiertem Header/Footer, eine handgeschriebene `styles.css`, eine kleine `main.js`. Geprüft wird ausschließlich über einen lokalen, nicht committeten Playwright-Prüfstand in `.checks/`. Er vergleicht die neuen Seiten per Screenshot mit einem Referenz-Build der alten Angular-Seite und testet das Verhalten.

**Tech Stack:** HTML5, CSS (Custom Properties, mobile-first), Vanilla JS (ES2020). Nur zur Prüfung: Node 26, `@playwright/test`, `pixelmatch`, `pngjs`, `http-server`, `lighthouse`, `html-validate`, `actionlint`.

**Spec:** `docs/superpowers/specs/2026-11-12-static-site-design.md`. Die Abschnittsnummern „§n“ beziehen sich darauf. Vor jedem Task den genannten Abschnitt lesen.

## Global Constraints

- Im Repo landen kein `package.json`, kein `node_modules` und kein Build-Schritt. `.checks/` wird über `.git/info/exclude` ignoriert und nie committet.
- Alle internen Verweise sind Root-relativ (`/assets/...`, `/kontakt/`). Seitenlinks enden mit `/`.
- Texte werden wörtlich aus `src/podo-web/src/app/*/*.component.html` übernommen. Erlaubte Abweichungen nur laut §1.
- Farben als `oklch(...)` exakt aus `tailwindcss/theme.css` (Tailwind v4), z. B. `--lime-500: oklch(76.8% 0.233 130.85)`.
- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. `font-semibold` = 500, `font-bold` = 700.
- `theme-color` und Wartungs-Hintergrund: `#83cc16`.
- Vor dem Klick auf „Karte laden“ gibt es keine einzige Anfrage an fremde Hosts.
- Rechtstexte sind publikationsfertig formuliert, ohne Platzhalter, TODOs oder Prüfhinweise.
- Lizenzkommentar `<!-- Icons: Font Awesome Free (https://fontawesome.com), CC BY 4.0 -->` im `<head>` jeder Seite in `site/`.
- Commit-Messages enden mit `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Wiederkehrende Besucher mit altem Angular Service Worker:** Sie müssen ohne eigenes Zutun die neue Seite sehen. → Test in Task 7.
2. **Alte SPA-URLs in Varianten** (`/?/kontakt`, `/?/kontakt&x=1`, `/?/`, `/?/gibtsnicht`) landen auf `/kontakt/`, `/kontakt/`, `/` bzw. der 404-Seite, ohne Schleife. → Test in Task 6.
3. **Sehr schmale Displays (320px) und Querformat-Handys (667×375):** Auf keiner Seite gibt es horizontales Scrollen. → Test in Task 6 (alle Seiten).
4. **JavaScript deaktiviert:** Auf dem Handy ist die Navigation trotzdem erreichbar (`<noscript>`-Style blendet die Mobile-Navigation ein), und der Footer zeigt das Fallback-Jahr. → Test in Task 2.
5. **Aufruf ohne abschließenden Slash** (`/kontakt`): Er funktioniert (GitHub Pages und `http-server` leiten weiter). Alle internen Links haben den Slash, damit es keine unnötigen Weiterleitungen gibt. → Test in Task 6.

---

## Prüfstand: gemeinsame Schnittstellen

Alle Tasks nutzen diese Dateien aus Task 1:

- `.checks/lib/pages.mjs` exportiert `PAGES`: ein Array aus `{ key, path, refPath, title, h1Text }` für die 8 Seiten.
  `key`: `home|ueber|leistungen|podo-taping|kontakt|impressum|datenschutz|agb`; `path`: `/`, `/ueber/`, …; `refPath`: `/`, `/?/ueber`, …; `title` laut §8.
  Außerdem `WIDTHS = [375, 768, 1280]`, `SITE = 'http://localhost:8001'`, `MAINT = 'http://localhost:8002'`, `REF = 'http://localhost:8010'`.
- `.checks/lib/visual.mjs` exportiert `async expectMatchesReference(page, name, width, { maskRects = [] } = {})`.
  Ablauf: ganzseitiger Screenshot (`animations: 'disabled'`, vorher `await page.evaluate(() => document.fonts.ready)`). Laden von `.checks/reference/shots/<name>-<width>.png`. Maskierte Rechtecke werden in beiden Bildern schwarz gefüllt.
  Bedingungen: Höhendifferenz ≤ 2px, Anteil abweichender Pixel ≤ 0,5 % (`pixelmatch`, `threshold: 0.1`).
  Schreibt immer `.checks/out/<name>-<width>-side.png` (alt | neu nebeneinander) und `-diff.png`.
- `.checks/playwright.config.mjs` mit `webServer`: `npx http-server ../site -p 8001 -c-1 -s` und `npx http-server ../maintenance -p 8002 -c-1 -s`, `use.viewport` pro Test gesetzt. Testdateien liegen unter `.checks/tests/`.
- Testlauf: `cd .checks && npx playwright test <datei>`.

---

### Task 1: Prüfstand und Referenz-Screenshots der alten Seite

**Files:**
- Modify: `.git/info/exclude` (Zeile `.checks/` ergänzen)
- Create: `.checks/package.json`, `.checks/playwright.config.mjs`, `.checks/lib/pages.mjs`, `.checks/lib/visual.mjs`, `.checks/capture-reference.mjs`
- Create (generiert): `.checks/reference/live/`, `.checks/reference/maintenance/`, `.checks/reference/shots/*.png`

**Interfaces:**
- Produces: alles aus „Prüfstand: gemeinsame Schnittstellen“, dazu die Referenzbilder `<key>-<width>.png`, `home-menu-375.png` (Burger offen) und `maintenance-<width>.png`.

- [ ] **Step 1:** `.checks/` in `.git/info/exclude` eintragen. Prüfen: `git status --short` zeigt nach dem Anlegen von `.checks/` nichts davon.
- [ ] **Step 2:** In `.checks/` die Abhängigkeiten installieren: `npm init -y && npm i -D @playwright/test pixelmatch pngjs http-server lighthouse html-validate && npx playwright install chromium`.
- [ ] **Step 3: Referenz „live“ bauen.** `git worktree add .checks/ref-src main`. In `.checks/ref-src/src/podo-web/src/app/app.module.ts` `AppConstructionRoutingModule` durch `AppRoutingModule` (aus `./app-routing.module`) ersetzen und `bootstrap: [AppComponent]` setzen. Dann `npm ci && npm run build` und `dist/podo-web/browser` nach `.checks/reference/live` kopieren.
  Erwartet: `ls .checks/reference/live` zeigt `index.html`, `ngsw-worker.js`, `assets/`.
- [ ] **Step 4: Referenz „maintenance“ bauen.** Die Änderung aus Step 3 zurücksetzen (`git -C .checks/ref-src checkout .`), erneut bauen und nach `.checks/reference/maintenance` kopieren.
- [ ] **Step 5:** `pages.mjs`, `visual.mjs` und `playwright.config.mjs` laut Schnittstellen schreiben. `capture-reference.mjs` startet `http-server` auf `reference/live` (Port 8010) und fotografiert jede Seite über `REF + refPath` in allen `WIDTHS`. Vor dem Screenshot wird auf `networkidle` gewartet und darauf, dass `document.title` dem `title` entspricht. Danach `home-menu-375` (Burger-Button klicken), dann dasselbe für `reference/maintenance` als `maintenance-<width>`.
- [ ] **Step 6:** `node capture-reference.mjs`. Erwartet: 24 Seitenbilder, 1 Menübild, 3 Wartungsbilder in `reference/shots/`. Stichprobe: `kontakt-375.png` und `leistungen-1280.png` ansehen. Es muss echter Inhalt zu sehen sein, nicht die Wartungsseite.
- [ ] **Step 7:** Kein Commit, weil alles in `.checks/` liegt.

---

### Task 2: Grundgerüst, Basis-CSS, `main.js` und Startseite

**Files:**
- Create: `site/index.html`, `site/assets/css/styles.css`, `site/assets/js/main.js`
- Create (kopiert): `site/assets/img/{logo.svg,header.webp,evi1.webp,evi2.webp,praxis1.webp,praxis2.webp}`, `site/assets/icons/*.webp`, `site/favicon.ico` aus `src/podo-web/src/...`. `site/assets/fonts/Roboto-{Regular,Medium,Bold,ThinItalic}.woff2`
- Test: `.checks/tests/shell.spec.mjs`

**Interfaces:**
- Consumes: Prüfstand (Task 1).
- Produces (alle späteren Seiten kopieren dieses Gerüst aus `site/index.html`):
  - Header-Markup: `<header class="site-header">`, Logo-Link `<a class="brand" href="/">` mit `<span class="site-title">Podologie Lahn</span>`, `<nav class="nav-desktop">`, `<button class="nav-toggle" aria-controls="mobile-nav" aria-expanded="false" aria-label="Steuert das Seitenmenü">`, `<nav id="mobile-nav" class="nav-mobile" hidden>`. Aktiver Link mit `aria-current="page"`.
  - Footer: `<footer class="site-footer">` mit `<span data-year>2026</span>`.
  - `<head>`-Basisblock: charset, viewport, `theme-color #83cc16`, Lizenzkommentar, `favicon.ico`, Preload `/assets/fonts/Roboto-Regular.woff2` (`as="font" type="font/woff2" crossorigin`), Stylesheet, `main.js` mit `defer`, `<noscript><style>.nav-mobile[hidden]{display:block}</style></noscript>`. SEO-Tags kommen in Task 6.
  - CSS-Klassen für spätere Tasks: `.container`, `.divider` (Linie–Text–Linie), `.quote-band`, `.contact-tiles`/`.contact-tile`/`.icon-circle`, `.visually-hidden`, `.h1-style`, `.icon` (SVG-Basis: `width:1em;height:1em;fill:currentColor`).
  - `main.js`: initialisiert per `document.querySelector` die Elemente `.nav-toggle`, `[data-year]` und `[data-map]` und bricht ab, wenn ein Element fehlt.

- [ ] **Step 1: Failing Tests schreiben** in `shell.spec.mjs`:

```js
test('home matches reference', ...)          // für jede w in WIDTHS: expectMatchesReference(page,'home',w)
test('burger menu toggles', ...)             // 375px: nav-toggle klicken → #mobile-nav sichtbar, aria-expanded="true"; erneut → hidden, "false"
test('burger menu open matches reference')   // 375px, Menü offen: expectMatchesReference(page,'home-menu',375)
test('footer shows current year')            // [data-year] textContent === String(new Date().getFullYear())
test('home nav item is current')             // .nav-desktop a[aria-current="page"] hat href "/"
test('works without JS')                     // context javaScriptEnabled:false, 375px: #mobile-nav sichtbar, [data-year] === '2026'
test('exactly one h1, header title is not h1') // count('h1')===1, h1 Text 'Willkommen', .site-title.tagName==='SPAN'
test('touch targets')                        // 375px: .nav-toggle und jeder #mobile-nav-Link (offen) haben boundingBox height >= 44
```

- [ ] **Step 2:** `npx playwright test shell.spec.mjs` ausführen. Erwartet: FAIL (404, Seite fehlt).
- [ ] **Step 3: `styles.css` Abschnitte 1–5 und 8 schreiben (§5).** Die Werte stammen aus `.checks/ref-src/src/podo-web/node_modules/tailwindcss/theme.css` und `src/podo-web/src/styles.css`. Das Original-Markup (`app.component.html`, `home.component.html`) dient Klasse für Klasse als Vorlage. `@font-face` nur für die vier Schnitte. `.aspect-ratio-box` (Header-Bild, `padding-bottom: 28.279%`) übernehmen.
- [ ] **Step 4: `site/index.html` schreiben.** Header, Startseiten-Inhalt und Footer. Icons `map-location-dot`, `phone`, `business-time`, `bars` als inline SVG (Pfade aus `.checks/ref-src/src/podo-web/node_modules/@fortawesome/free-solid-svg-icons/*.js`), mit `class="icon"` und `aria-hidden="true"`. Header-Bild mit `width`/`height`, `fetchpriority="high"`. „Willkommen“ als `<h1>` im `.divider`.
- [ ] **Step 5: `main.js` schreiben** (§6, Punkte 1–2). Menülink-Klick schließt das Menü.
- [ ] **Step 6:** Tests ausführen. Erwartet: PASS. Bei Abweichungen `.checks/out/home-*-side.png` ansehen und das CSS korrigieren, bis alles grün ist.
- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "Add static site shell, base styles and home page"
```

---

### Task 3: Seiten „Über mich“, „Leistungen“, „Podo-Taping“

**Files:**
- Create: `site/ueber/index.html`, `site/leistungen/index.html`, `site/podo-taping/index.html`
- Modify: `site/assets/css/styles.css` (Abschnitte 6–7: `.feature-grid`, `.feature`, `.media-row`, `.practice-list` für `#berufspraxis`, Zitat in Roboto Thin Italic)
- Test: `.checks/tests/content-pages.spec.mjs`

**Interfaces:**
- Consumes: Gerüst und CSS-Klassen aus Task 2.
- Produces: CSS-Klassen `.feature-grid`, `.feature`, `.media-row`. Icons `star`, `graduation-cap`, `car`, `user-nurse`, `house` als inline SVG.

- [ ] **Step 1: Failing Tests** für `key` in `['ueber','leistungen','podo-taping']`:

```js
test(`${key} matches reference`)      // alle WIDTHS
test(`${key} has exactly one h1`)     // ueber: h1.visually-hidden Text 'Über mich'; leistungen: 'Podologische Grundbehandlung'; podo-taping: 'Was ist Podo-Taping?'
test(`${key} nav item is current`)    // aria-current auf passendem Link
test(`${key} images sized`)           // jedes img hat width+height; alle außer dem ersten hat loading="lazy"
```

- [ ] **Step 2:** Tests ausführen. Erwartet: FAIL.
- [ ] **Step 3:** Die drei Seiten aus dem Gerüst und den Angular-Templates schreiben. Die zweite und dritte `<h1>` werden `<h2 class="h1-style">` (§4). Bildgrößen wie die `width`/`height` aus den `ngSrc`-Attributen. Das erste Bild der Seite bekommt kein `lazy`.
- [ ] **Step 4:** Tests ausführen. Erwartet: PASS. Side-by-side-Bilder prüfen.
- [ ] **Step 5: Commit** – `git add site/ && git commit -m "Add about, services and podo-taping pages"`

---

### Task 4: Kontaktseite mit Klick-zum-Laden-Karte

**Files:**
- Create: `site/kontakt/index.html`
- Modify: `site/assets/css/styles.css` (`.map-placeholder`), `site/assets/js/main.js` (§6 Punkt 3)
- Test: `.checks/tests/kontakt.spec.mjs`

**Interfaces:**
- Consumes: `.contact-tiles` (Task 2), `[data-map]`-Hook in `main.js` (Task 2).
- Produces: Anker-Link `/datenschutz/#google-maps`. Den Abschnitt dazu liefert Task 5.
- Markup: `<div class="map-placeholder" data-map data-src="<Original-iframe-URL>">` mit Icon, Adresse, `<button type="button" data-map-load>Karte laden</button>`, Hinweissatz laut §11, Link „In Google Maps öffnen“ auf `https://www.google.com/maps/search/?api=1&query=Bahnhofstra%C3%9Fe+12%2C+14789+Wusterwitz` mit `target="_blank" rel="noopener"`.

- [ ] **Step 1: Failing Tests:**

```js
test('kontakt matches reference (map masked)') // alle WIDTHS; maskRects = [boundingBox von .map-placeholder in Seitenkoordinaten
                                               // (box.y + scrollY)], auf beide Bilder angewendet; der Platzhalter muss genau 384px hoch sein
test('no third-party requests before click')   // page.on('request'): jede URL beginnt mit SITE
test('click loads map')                        // Klick [data-map-load] → iframe[src^="https://www.google.com/maps/embed"] sichtbar, title enthält 'Bahnhofstraße 12'
test('map button keyboard accessible')         // Fokus per Tab, Enter → iframe vorhanden
test('privacy link')                           // a[href="/datenschutz/#google-maps"] vorhanden
test('one h1')                                 // h1.visually-hidden 'Anfahrt & Kontakt'
```

- [ ] **Step 2:** Tests ausführen. Erwartet: FAIL.
- [ ] **Step 3:** Seite, Platzhalter-CSS (volle Breite, `height: 24rem`, `--gray-100`) und die Karten-Logik in `main.js` schreiben.
- [ ] **Step 4:** Tests ausführen. Erwartet: PASS.
- [ ] **Step 5: Commit** – `git commit -m "Add contact page with click-to-load map"`

---

### Task 5: Impressum, AGB, Datenschutz (inkl. Google Maps, TDDDG)

**Files:**
- Create: `site/impressum/index.html`, `site/agb/index.html`, `site/datenschutz/index.html`
- Test: `.checks/tests/legal.spec.mjs`

**Interfaces:**
- Consumes: Gerüst (Task 2).
- Produces: `<section id="google-maps">` bzw. eine Überschrift mit `id="google-maps"` in `/datenschutz/`.

- [ ] **Step 1: Failing Tests:**

```js
test('impressum, agb match reference')            // alle WIDTHS
test('datenschutz keeps original text')           // innerText der Referenz-<main> (REF/?/datenschutz) in Absätze zerlegen,
                                                  // 'TTDSG'→'TDDDG' ersetzen; jeder Absatz (whitespace-normalisiert) ist im neuen <main> enthalten
test('datenschutz has no TTDSG, has TDDDG')
test('google maps section')                       // #google-maps existiert; Text enthält 'Google Ireland Limited',
                                                  // 'Art. 6 Abs. 1 lit. a DSGVO', '§ 25 Abs. 1 TDDDG', 'Data Privacy Framework'
test('no placeholder markers')                    // <main>-Text matcht nicht /\bTODO\b|\bTBD\b|XXX|bitte (noch )?(prüfen|reviewen)|\[[^\]]*\]/i
test('footer link is current on legal pages')     // Footer-Link mit aria-current auf der jeweiligen Seite
```

- [ ] **Step 2:** Tests ausführen. Erwartet: FAIL.
- [ ] **Step 3:** Die drei Seiten aus den Templates übernehmen. In der Datenschutzerklärung den Abschnitt „Google Maps“ an der passenden Stelle einfügen (unter „Plugins und Tools“ bzw. als nächster nummerierter Abschnitt, wenn es keinen solchen gibt). Stil, Anrede und Nummerierung wie die übrigen Abschnitte. Inhalt laut §11. Alle Vorkommen von `TTDSG` durch `TDDDG` ersetzen.
- [ ] **Step 4:** Tests ausführen. Erwartet: PASS. `.checks/out/datenschutz-*-side.png` zusätzlich erzeugen (Test schreibt Side-by-side ohne Schwellwert), damit man es ansehen kann.
- [ ] **Step 5: Commit** – `git commit -m "Add legal pages with Google Maps privacy section"`

---

### Task 6: SEO, 404-Seite, alte URLs, Sitemap, Teilen-Vorschau

**Files:**
- Modify: alle 8 `site/**/index.html` (`<head>`), `site/index.html` (JSON-LD, Redirect-Skript)
- Create: `site/404.html`, `site/sitemap.xml`, `site/robots.txt`, `site/manifest.webmanifest`, `site/assets/img/og-image.jpg`, `site/assets/icons/apple-touch-icon.png`
- Test: `.checks/tests/seo.spec.mjs`

**Interfaces:**
- Consumes: alle Seiten aus Task 2–5, `PAGES`.
- Produces: JSON-LD-Block der Startseite. Task 7 kopiert ihn wörtlich in die Wartungsseite.

- [ ] **Step 1: Failing Tests:**

```js
for (const p of PAGES) {
  test(`${p.key} head`)  // title===p.title; meta description 120–160 Zeichen und über alle Seiten eindeutig;
                         // link[rel=canonical].href === 'https://podologie-lahn.de'+p.path; og:title, og:description, og:url (=canonical),
                         // og:image === 'https://podologie-lahn.de/assets/img/og-image.jpg', og:locale 'de_DE', twitter:card 'summary_large_image';
                         // kein meta[name=keywords]; link[rel=apple-touch-icon], link[rel=manifest]
  test(`${p.key} no horizontal scroll`) // Viewports 320×640 und 667×375: scrollWidth <= clientWidth
  test(`${p.key} internal links`)       // jeder a[href^="/"] endet auf '/' oder enthält '#'; GET jedes Links und jedes img/src → 200
}
test('json-ld')            // JSON.parse; @type 'Podiatric'; telephone '+4933839329063'; address.postalCode '14789';
                           // geo.latitude 52.3858, geo.longitude 12.37005;
                           // openingHoursSpecification: dayOfWeek Monday–Thursday, opens '08:00', closes '16:00'
test('old spa urls')       // '/?/kontakt'→'/kontakt/'; '/?/kontakt&x=1'→'/kontakt/?x=1'; '/?/'→'/'; '/?/gibtsnicht'→404-Inhalt
test('404 page')           // GET /gibtsnicht/ → Status 404, h1 'Seite nicht gefunden', a[href="/"], meta robots 'noindex', kein aria-current
test('no trailing slash')  // goto('/kontakt') → endet auf Kontaktseite
test('sitemap')            // 8 <loc> = canonical-URLs aus PAGES, jede lokal 200, lastmod == heute (YYYY-MM-DD)
test('og image size')      // og-image.jpg ist 1200×630 (aus JPEG-Header lesen)
```

- [ ] **Step 2:** Tests ausführen. Erwartet: FAIL.
- [ ] **Step 3:** Die `<head>`-Blöcke ergänzen (§8). Meta-Beschreibungen pro Seite aus dem Inhalt formulieren. Das Redirect-Skript als erstes Element im `<head>` von `site/index.html`: `?/a/b&c=d` wird zu `/a/b/?c=d` (`~and~` → `&`), per `location.replace`.
- [ ] **Step 4:** `og-image.jpg` erzeugen: `sips --resampleWidth 1200 res/header.jpg --out .checks/og-tmp.jpg`, dann `sips --cropToHeightWidth 630 1200 .checks/og-tmp.jpg --out site/assets/img/og-image.jpg`. Ist das Bild nach dem Skalieren niedriger als 630px, mit `--resampleHeight 630` skalieren und auf 1200 Breite zuschneiden. `apple-touch-icon.png`: `sips -s format png -z 180 180 src/podo-web/src/assets/icons/icon_192x192.webp --out site/assets/icons/apple-touch-icon.png`.
- [ ] **Step 5:** `404.html`, `sitemap.xml`, `robots.txt` und `manifest.webmanifest` schreiben (Inhalt wie das Original, Icon-Pfade Root-relativ).
- [ ] **Step 6:** Tests ausführen. Erwartet: PASS. Dazu alle bisherigen Tests: `npx playwright test`, alles grün.
- [ ] **Step 7: Commit** – `git commit -m "Add SEO metadata, 404 page, sitemap and legacy URL redirect"`

---

### Task 7: Wartungsseite und Service-Worker-Kill-Switch

**Files:**
- Create: `maintenance/index.html`, `maintenance/404.html`, `maintenance/robots.txt`, `maintenance/favicon.ico`, `maintenance/fonts/Roboto-{Regular,Bold}.woff2`, `maintenance/ngsw-worker.js`, `site/ngsw-worker.js`
- Test: `.checks/tests/maintenance.spec.mjs`, `.checks/tests/killswitch.spec.mjs`

**Interfaces:**
- Consumes: JSON-LD und Meta-Beschreibung der Startseite (Task 6).

- [ ] **Step 1: Failing Tests:**

```js
// maintenance.spec.mjs (gegen MAINT)
test('maintenance matches reference')   // alle WIDTHS, Name 'maintenance'
test('any path shows maintenance')      // /kontakt/ und /x/y → h1 'Website in Wartung'
test('maintenance seo')                 // title 'Podologie Lahn', canonical 'https://podologie-lahn.de/', JSON-LD @type 'Podiatric', kein noindex
test('maintenance self-contained')      // alle Requests gehen an MAINT; keine an /assets/
test('reduced motion stops pulse')      // emulateMedia reducedMotion:'reduce' → getComputedStyle(h1).animationName === 'none'

// killswitch.spec.mjs: für target in ['site','maintenance']
test(`old service worker is removed by ${target}`)
// 1. .checks/swap/ = Kopie von reference/live; http-server .checks/swap -p 8020 -c-1
// 2. persistentContext(userDataDir) → goto → warten bis navigator.serviceWorker.controller != null (max 30s, reload falls nötig)
// 3. swap/ leeren, Inhalt von ../<target> hineinkopieren
// 4. reload, 2 s warten, reload → Seite enthält kein <app-root>;
//    await navigator.serviceWorker.getRegistrations() hat Länge 0; caches.keys() ist leer
```

- [ ] **Step 2:** Tests ausführen. Erwartet: FAIL.
- [ ] **Step 3:** `maintenance/index.html` laut §9 schreiben (CSS inline, Roboto aus `/fonts/`, Puls-Animation wie Tailwinds `animate-pulse`: `2s cubic-bezier(0.4,0,0.6,1) infinite`, Opazität 1 → .5 → 1). `404.html` = Kopie von `index.html`. `robots.txt`: `User-agent: *` / `Allow: /`.
- [ ] **Step 4:** Den Kill-Switch in beide Ordner schreiben (identisch):

```js
// Ersetzt den früheren Angular Service Worker und entfernt sich selbst.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
```

- [ ] **Step 5:** Tests ausführen. Erwartet: PASS.
- [ ] **Step 6: Commit** – `git add maintenance/ site/ngsw-worker.js && git commit -m "Add maintenance page and service worker kill switch"`

---

### Task 8: Deploy-Workflow, README, Angular entfernen

**Files:**
- Create: `.github/workflows/deploy.yml`
- Delete: `.github/workflows/deploy-gh.yml`, `src/podo-web/` (komplett), danach das leere `src/`
- Modify: `README.md` (vollständig ersetzen, §14)

- [ ] **Step 1:** `brew install actionlint`. `actionlint .github/workflows/deploy.yml` meldet zunächst einen Fehler, weil die Datei noch fehlt.
- [ ] **Step 2: `deploy.yml` schreiben:**

```yaml
name: Deploy
on:
  workflow_dispatch:
    inputs:
      mode:
        description: "Was soll live gehen?"
        required: true
        type: choice
        options: [wartung, live]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - id: dir
        run: |
          if [ "${{ inputs.mode }}" = "live" ]; then echo "path=site" >> "$GITHUB_OUTPUT"; else echo "path=maintenance" >> "$GITHUB_OUTPUT"; fi
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ${{ steps.dir.outputs.path }}
      - id: deployment
        uses: actions/deploy-pages@v4
      - run: echo "Deployt: Modus **${{ inputs.mode }}** (\`${{ steps.dir.outputs.path }}/\`)" >> "$GITHUB_STEP_SUMMARY"
```

- [ ] **Step 3:** `actionlint .github/workflows/deploy.yml`. Erwartet: keine Ausgabe, Exit 0.
- [ ] **Step 4:** `README.md` laut §14 schreiben. Das Badge zeigt auf `actions/workflows/deploy.yml/badge.svg`.
- [ ] **Step 5:** `git rm -r src/podo-web .github/workflows/deploy-gh.yml`. Prüfen: `git ls-files | grep -E 'package.json|angular.json'` liefert nichts. Die komplette Testsuite läuft weiter grün (`cd .checks && npx playwright test`). Die Referenz liegt in `.checks/` und ist davon nicht betroffen.
- [ ] **Step 6: Commit** – `git add -A .github README.md && git commit -m "Replace Angular build with button-driven static deploy"`

---

### Task 9: Abschlussprüfung, Pull Request, erster Deploy

**Files:** keine Änderungen, nur Prüfung.

- [ ] **Step 1:** `cd .checks && npx playwright test`. Erwartet: alle Tests PASS.
- [ ] **Step 2: Lighthouse.** Mit `npx http-server ../site -p 8001 -s &` den Server starten. Dann `npx lighthouse http://localhost:8001/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --quiet --output=json --output-path=out/lh-home.json --chrome-flags="--headless"`, dasselbe für `/kontakt/`. Erwartet: jede Kategorie ≥ 0.95 (`jq '.categories[].score'`). Bei Abweichung den betroffenen Task nachbessern.
- [ ] **Step 3:** `npx html-validate "../site/**/*.html" "../maintenance/*.html"`. Erwartet: Exit 0.
- [ ] **Step 4:** Eine Übersicht aller `.checks/out/*-side.png` an den Nutzer schicken, inklusive Datenschutz und Kontakt.
- [ ] **Step 5:** `.checks/ref-src` aufräumen: `git worktree remove .checks/ref-src --force`.
- [ ] **Step 6:** Nur nach Freigabe durch den Nutzer: Branch `static-site` pushen und einen PR nach `main` erstellen. Der PR-Text beschreibt Umschalten, Abweichungen (§1) und den Hinweis „Merge deployt nicht“.
- [ ] **Step 7:** Nur nach Merge und ausdrücklicher Freigabe: `gh workflow run deploy.yml -f mode=wartung`, auf den Abschluss warten (`gh run watch`). Danach `https://podologie-lahn.de/` und `/kontakt/` prüfen: Beide zeigen die Wartungsseite, und `/ngsw-worker.js` liefert den Kill-Switch.
