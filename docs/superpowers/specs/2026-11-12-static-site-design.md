# Podologie Lahn: Umstellung auf statisches HTML/CSS/JS

Datum: 2026-11-12 · Status: Design freigegeben, Spec zur Durchsicht

## 1. Ziel und Rahmen

Die bestehende Angular-Website (`src/podo-web`) wird als reines HTML/CSS/JS-Projekt neu umgesetzt, ohne Framework, ohne npm und ohne Build-Schritt. Ziel ist minimaler Wartungsaufwand: keine Abhängigkeits-Updates mehr, jede Datei ist genau das, was ausgeliefert wird.

**Anforderungen**

- Aussehen und Inhalt entsprechen der aktuellen Angular-Seite (Live-Variante mit allen 8 Seiten) auf Handy, Tablet und Desktop.
- Hosting bleibt GitHub Pages mit der Domain `podologie-lahn.de` (Pages-Quelle „GitHub Actions“, HTTPS erzwungen, bereits so eingerichtet).
- Zwischen Wartungsseite und echter Website wird per Button in GitHub umgeschaltet. Live bleibt vorerst die Wartungsseite.
- Die Website ist für Mobilgeräte optimiert.
- Günstige SEO-, Performance- und Datenschutz-Verbesserungen werden mitgenommen, sofern sie keinen laufenden Aufwand verursachen.
- Künftige Änderungen sind selten und werden mit KI-Unterstützung gemacht. Der Code darf vollständig generiert sein, muss aber verständlich und konsistent bleiben.

**Bewusste Abweichungen vom Original** (alles andere ist 1:1)

1. Echte URLs (`/kontakt/`) statt SPA-URLs (`/?/kontakt`). Alte URLs werden umgeleitet.
2. Google Maps lädt erst nach Klick (Platzhalter in gleicher Größe).
3. Die Datenschutzerklärung erhält einen Abschnitt „Google Maps“. „TTDSG“ wird durchgehend in „TDDDG“ umbenannt.
4. Unbekannte Pfade zeigen eine echte 404-Seite im Seitenlayout statt einer stillen Weiterleitung zur Startseite.
5. Überschriften-Semantik wird bereinigt, ohne sichtbare Änderung (Details in Abschnitt 4): Der Schriftzug „Podologie Lahn“ im Header ist keine `<h1>` mehr, jede Seite hat genau eine `<h1>`.

**Nicht im Umfang:** neuer Service Worker/Offline-Modus, Analytics, Content-Security-Policy, Kontaktformular, inhaltliche Überarbeitung, dauerhafte Testsuite im Repo.

## 2. Struktur

```
/
├─ site/                         echte Website (wird im Modus „live“ deployt)
│  ├─ index.html                 Home
│  ├─ ueber/index.html           Über mich
│  ├─ leistungen/index.html      Leistungen
│  ├─ podo-taping/index.html     Podo-Taping Konzept
│  ├─ kontakt/index.html         Anfahrt & Kontakt
│  ├─ impressum/index.html
│  ├─ datenschutz/index.html
│  ├─ agb/index.html
│  ├─ 404.html
│  ├─ assets/css/styles.css
│  ├─ assets/js/main.js
│  ├─ assets/fonts/              Roboto, nur genutzte Schnitte, nur woff2
│  ├─ assets/img/                logo.svg, header.webp, evi1/2.webp, praxis1/2.webp, og-image.jpg
│  ├─ assets/icons/              Manifest-Icons (webp), apple-touch-icon.png
│  ├─ favicon.ico
│  ├─ manifest.webmanifest
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ ngsw-worker.js             Kill-Switch für den alten Angular Service Worker
├─ maintenance/                  Wartungsseite (wird im Modus „wartung“ deployt)
│  ├─ index.html                 eigenständig, CSS inline
│  ├─ 404.html                   identisch mit index.html
│  ├─ fonts/                     Roboto-Regular.woff2, Roboto-Bold.woff2
│  ├─ favicon.ico
│  ├─ robots.txt
│  └─ ngsw-worker.js             gleicher Kill-Switch
├─ .github/workflows/deploy.yml
├─ docs/superpowers/specs/       diese Spec
├─ res/                          Originalfotos (unverändert)
├─ CNAME                         unverändert
├─ .nojekyll                     unverändert
└─ README.md                     Kurzanleitung
```

`src/podo-web/` wird vollständig gelöscht (bleibt in der Git-Historie). Asset-Pfade bleiben unter `/assets/...` wie bisher, damit bestehende externe Verweise (z. B. auf das Logo) gültig bleiben.

Alle internen Verweise sind Root-relativ (`/assets/css/styles.css`, `/kontakt/`). Lokale Vorschau per `python3 -m http.server` im jeweiligen Ordner.

## 3. Umschalten Wartung/Live

**Workflow `.github/workflows/deploy.yml`**

- Einziger Trigger: `workflow_dispatch` mit einem Pflicht-Input `mode` vom Typ `choice`, Optionen `wartung` (erste Option, vorausgewählt) und `live`.
- Kein Push-Trigger. Ein Push oder Merge auf `main` deployt nicht und kann den Modus daher nie versehentlich ändern.
- Ablauf: Checkout → Ordner wählen (`wartung` → `maintenance/`, `live` → `site/`) → `actions/configure-pages` → `actions/upload-pages-artifact` mit diesem Ordner → `actions/deploy-pages`.
- Kein Node, kein npm, keine Build-Schritte.
- Der Lauf schreibt den deployten Modus in die Job-Zusammenfassung (`$GITHUB_STEP_SUMMARY`), z. B. „Deployt: Modus live (site/)“.
- Berechtigungen, `concurrency` und `environment: github-pages` wie im bisherigen Workflow.

**Bedienung:** GitHub → Actions → „Deploy“ → „Run workflow“ → Modus wählen → starten. Das funktioniert auch im mobilen Browser. Nach inhaltlichen Änderungen wird auf demselben Weg neu deployt.

**Verhalten im Wartungsmodus:** Jede URL zeigt die Wartungsseite (`/` über `index.html`, alle anderen Pfade über `404.html`).

## 4. Seitenaufbau

**Gemeinsames Gerüst jeder Seite in `site/`**

```html
<!doctype html>
<html lang="de">
<head>
  meta charset, viewport, theme-color (#83cc16, wie im bisherigen Manifest)
  <title>…</title>, meta description, canonical, Open Graph, Twitter-Card
  favicon, apple-touch-icon, manifest
  preload der Roboto-Regular-Schrift
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/main.js" defer></script>
</head>
<body>
  <div class="page">
    <!-- HEADER: in allen Seiten identisch halten (nur aria-current wechselt) -->
    <header>…Logo + Schriftzug (Link auf /), Desktop-Navigation, Burger-Button, Mobile-Navigation…</header>
    <main>…Seiteninhalt…</main>
    <!-- FOOTER: in allen Seiten identisch halten -->
    <footer>…Copyright <span data-year>2026</span> Podologie Lahn | Impressum - Datenschutz - AGB…</footer>
  </div>
</body>
</html>
```

- Header und Footer sind in allen Seiten identisch kopiert. Pro Seite ändert sich nur, welcher Menüpunkt `aria-current="page"` trägt. Die Hervorhebung (grün) hängt per CSS an diesem Attribut.
- Navigationspunkte (Reihenfolge wie im Original): Home `/`, Über mich `/ueber/`, Leistungen `/leistungen/`, Podo-Taping Konzept `/podo-taping/`, Anfahrt & Kontakt `/kontakt/`. Footer: Impressum `/impressum/`, Datenschutz `/datenschutz/`, AGB `/agb/`.
- Die Mobile-Navigation steht im HTML mit dem Attribut `hidden` und wird per JS eingeblendet.
- Texte werden wörtlich aus den Angular-Templates übernommen, einschließlich des Hinweises zur Patientenaufnahme auf der Startseite.
- Pro Seite gibt es genau eine `<h1>`, ohne sichtbare Änderung:
  - Header-Schriftzug „Podologie Lahn“: `<span class="site-title">` statt `<h1>`, gleich gestaltet.
  - Home: Der Trennertext „Willkommen“ wird zur `<h1>` (Aussehen des Trenners bleibt).
  - Über mich: zusätzliche, nur für Screenreader und Suchmaschinen sichtbare `<h1 class="visually-hidden">Über mich</h1>`.
  - Kontakt: ebenso `<h1 class="visually-hidden">Anfahrt &amp; Kontakt</h1>`.
  - Leistungen (2 × `<h1>`) und Podo-Taping (3 × `<h1>`): Die erste bleibt `<h1>`, die weiteren werden `<h2 class="h1-style">` mit identischem Aussehen.
  - Impressum, Datenschutz, AGB: unverändert (je eine `<h1>`).
- Bilder bekommen `width`/`height`. Das Startseiten-Header-Bild bekommt `fetchpriority="high"`, alle Bilder außerhalb des ersten Bildschirms `loading="lazy"`. Alt-Texte wie im Original.

**404-Seite (`site/404.html`)**: normales Layout mit Header/Footer (kein Menüpunkt aktiv), Überschrift „Seite nicht gefunden“, kurzer Text und Link „Zur Startseite“, `meta robots noindex`.

## 5. CSS (`site/assets/css/styles.css`)

Eine handgeschriebene Datei, mobile-first, ohne Framework. Gliederung mit Kommentarüberschriften:

1. **Variablen** (`:root`): exakte Tailwind-v4-Werte der verwendeten Farben, übernommen als `oklch(...)` aus `tailwindcss/theme.css` (z. B. `--lime-500: oklch(76.8% 0.233 130.85)`; verwendet: `lime-400/500`, `gray-50/100/200/300/700`, `red-900`, weiß), Schriftgrößen-Skala (`text-sm` … `text-5xl` inkl. Zeilenhöhen), Abstände, Radius, Schatten, Übergangszeiten.
2. **Schriften**: `@font-face` für Roboto, `font-display: swap`.
3. **Basis**: Reset im Umfang dessen, was Tailwinds Preflight für diese Seiten bewirkt (Margins, Listen, Bilder als Block, Rahmenfarbe `gray-200`), `body` in Roboto und `gray-700`, Überschriften-Stile `h1`–`h4` wie in `styles.css` des Originals.
4. **Layout**: `.container` entsprechend Tailwinds `container mx-auto` (max-width je Breakpoint 640/768/1024/1280/1536 px).
5. **Header/Navigation**, **Footer**.
6. **Komponenten**: Abschnittstrenner mit Text (`.divider`), Zitatband, Kontakt-Kacheln mit runden Icon-Flächen inkl. Hover-Effekt, Feature-Listen mit Stern-Icon, Bild-Text-Zeilen, Berufspraxis-Liste (Über mich), Karten-Platzhalter.
7. **Seitenspezifisches**, nur wo nötig.
8. **Barrierefreiheit/Mobile**: `:focus-visible`-Ring in Lime, Touch-Ziele mindestens 44 px, Safe-Area-Abstand im Footer (`env(safe-area-inset-bottom)`), `prefers-reduced-motion` schaltet Übergänge und die Puls-Animation ab.

Breakpoints wie Tailwind: `sm` = 640 px, `md` = 768 px, `lg` = 1024 px, `xl` = 1280 px. Schriftgewichte wie im Original (`semibold` = 500, `bold` = 700).

## 6. JavaScript (`site/assets/js/main.js`)

Abhängigkeitsfrei, `defer` geladen, etwa 30–40 Zeilen:

1. **Burger-Menü**: Der Button schaltet `hidden` an der Mobile-Navigation um und setzt `aria-expanded`. Ein Klick auf einen Menülink schließt das Menü (beim Seitenwechsel ohnehin).
2. **Jahreszahl**: Alle `[data-year]` erhalten das aktuelle Jahr. Im HTML steht das Jahr der Erstellung als Fallback.
3. **Karte nach Klick**: Der Button im Platzhalter `[data-map]` ersetzt den Platzhalter durch das Google-Maps-iframe (URL wie im Original, `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`, Titel „Karte: Bahnhofstraße 12, 14789 Wusterwitz“). Die iframe-URL steht als `data-src` am Platzhalter, nicht im JS.

**Inline-Skript nur in `site/index.html`** (im `<head>`, vor allem anderen): Beginnt die Query mit `?/`, wird auf den entsprechenden Pfad mit abschließendem Slash umgeleitet (`location.replace`), z. B. `/?/kontakt` → `/kontakt/`. Unbekannte Ziele landen dadurch auf der 404-Seite.

## 7. Icons, Schriften, Bilder

- **Icons**: Die 9 verwendeten FontAwesome-Free-Icons (bars, map-location-dot, phone, business-time, star, graduation-cap, car, user-nurse, house) werden als inline SVG eingebettet (`fill="currentColor"`, `aria-hidden="true"`), Größen wie im Original. Lizenzhinweis (Font Awesome Free, CC BY 4.0) als HTML-Kommentar im `<head>` jeder Seite.
- **Schriften**: Nur die verwendeten Roboto-Schnitte, nur woff2: Regular (400), Medium (500, für `font-semibold`), Bold (700) und Thin Italic (100 kursiv, für das Zitat auf „Über mich“). ttf-Dateien und alle übrigen Schnitte entfallen. Vorgeladen wird nur Regular.
- **Bilder**: Die vorhandenen WebP-Dateien werden unverändert übernommen. Neu: `og-image.jpg` (1200 × 630, aus `res/header.jpg` einmalig mit `sips` erzeugt) und `apple-touch-icon.png` (180 × 180, aus dem vorhandenen Icon erzeugt).

## 8. SEO

- **Titel** pro Seite wie im Angular-Routing: „Podologie Lahn“, „Über mich | Podologie Lahn“, „Leistungen | Podologie Lahn“, „Podo-Taping | Podologie Lahn“, „Kontakt | Podologie Lahn“, „Impressum | Podologie Lahn“, „Datenschutz | Podologie Lahn“, „Allgemeine Geschäftsbedingungen | Podologie Lahn“.
- **Meta-Beschreibung** pro Seite, eigenständig formuliert aus dem jeweiligen Inhalt, 120–160 Zeichen.
- **Canonical** auf `https://podologie-lahn.de/<pfad>/`.
- **Open Graph / Twitter**: `og:type website`, `og:locale de_DE`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (`/assets/img/og-image.jpg`), `twitter:card summary_large_image`.
- `meta keywords` entfällt.
- **JSON-LD** (nur Startseite), Typ `Podiatric`: Name, Beschreibung, URL, `sameAs` www-Variante, Logo, Bild, E-Mail, Telefon, Adresse (wie bisher), `geo` (52.38580, 12.37005), `openingHoursSpecification` Montag–Donnerstag 08:00–16:00, `foundingDate` 2015.
- **sitemap.xml**: die 8 echten URLs mit `lastmod` = Datum der Umstellung, Prioritäten wie bisher. **robots.txt**: wie bisher (alles erlaubt, Verweis auf Sitemap).
- **Manifest**: bleibt inhaltlich gleich (Pfade angepasst), ohne Service Worker.

## 9. Wartungsseite (`maintenance/`)

- Optik exakt wie die aktuelle Wartungsseite: Vollbild in `#83cc16`, „Website in Wartung“ (weiß, fett, 3rem, pulsierend, zentriert), „Die Podologie Website wird gerade überarbeitet.“ (1.125rem), „(Die Praxis ist weiterhin geöffnet)“ (0.875rem).
- CSS inline im `<head>`. Einzige weitere Dateien: Favicon sowie Roboto Regular und Bold als woff2 in `maintenance/fonts/` (wie im Original wird Roboto verwendet).
- Unsichtbar für SEO: Titel „Podologie Lahn“, Meta-Beschreibung wie die Startseite, dasselbe JSON-LD wie die Startseite, Canonical auf `https://podologie-lahn.de/`. Kein `noindex`.
- `404.html` ist inhaltlich identisch mit `index.html`.

## 10. Service-Worker-Kill-Switch

Besucher der bisherigen Seite haben den Angular Service Worker (`/ngsw-worker.js`) installiert. Er würde weiter die alte, gecachte Version ausliefern. In beiden Ordnern liegt deshalb unter genau diesem Pfad ein Ersatz-Worker, der beim Aktivieren alle Caches löscht, sich selbst abmeldet und offene Tabs neu lädt (entsprechend Angulars `safety-worker.js`). Der Browser prüft beim nächsten Seitenaufruf auf ein Update des Workers, findet den Ersatz und entfernt sich damit selbst. Die neuen Seiten registrieren keinen Service Worker.

## 11. Datenschutz und Karte

- **Platzhalter** auf der Kontaktseite, gleiche Breite und Höhe wie das bisherige iframe (volle Breite, 24rem hoch): heller Hintergrund (`gray-100`), Karten-Icon in Lime, Adresse, Button „Karte laden“ und ein Satz: „Beim Laden der Karte werden Daten an Google übertragen. Mehr dazu in der Datenschutzerklärung.“ (Link auf `/datenschutz/#google-maps`). Darunter ein Link „In Google Maps öffnen“, der ohne Einbettung direkt zu Google Maps führt.
- **Datenschutzerklärung**: wird wörtlich übernommen, ergänzt um einen Abschnitt „Google Maps“ (Anker `google-maps`) an der passenden Stelle der bestehenden Gliederung, in Stil und Aufbau der übrigen Abschnitte und mit fortlaufender Nummerierung. Inhalt: Anbieter Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Die Karte wird erst nach aktivem Klick geladen. Übertragene Daten (insbesondere IP-Adresse). Mögliche Übermittlung in die USA und das EU-US Data Privacy Framework. Rechtsgrundlage Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, jederzeit widerrufbar. Verweis auf die Datenschutzerklärung von Google. Der Text ist fertig formuliert und enthält keine Platzhalter oder Prüfhinweise.
- Alle Erwähnungen von „TTDSG“ werden in „TDDDG“ geändert.
- Ohne Klick auf die Karte stellt die Website keine Verbindung zu Dritten her, setzt keine Cookies und nutzt kein Tracking.

## 12. Prüfung und Abnahme

Die Prüfungen laufen einmalig lokal. Hilfsskripte und Screenshots liegen im Scratchpad und kommen nicht ins Repo.

1. **Referenz**: Die alte Angular-Seite wird in einer Wegwerf-Kopie im Live-Modus gebaut (Bootstrap auf `AppComponent` + `AppRoutingModule`) und lokal ausgeliefert, außerdem einmal im Wartungsmodus.
2. **Screenshot-Vergleich** mit Playwright, ganzseitig, in 375, 768 und 1280 px: alle 8 Seiten, die Wartungsseite und die Startseite mit geöffnetem Burger-Menü (375 px). Alt und neu werden nebeneinandergestellt und als Pixel-Diff verglichen. Abnahmekriterium: keine sichtbaren Unterschiede in Layout, Abständen, Farben, Schriftgrößen und Umbrüchen, außer den in Abschnitt 1 genannten Abweichungen. Minimale Kantenglättungs-Unterschiede durch Schriftdarstellung sind zulässig. Die Vergleichsbilder werden zur Durchsicht übergeben.
3. **Funktion**: Burger-Menü per Maus und Tastatur, `aria-expanded` korrekt. Vor dem Karten-Klick keine Anfrage an Google-Domains (Netzwerk-Log), nach dem Klick lädt das iframe. `/?/kontakt` → `/kontakt/`. Unbekannter Pfad → 404-Seite. Alle internen Links und Asset-Pfade lösen auf. Kein horizontaler Scroll bei 320 px.
4. **Lighthouse** (Mobil, einmalig via `npx lighthouse`): mindestens 95 in Performance, Barrierefreiheit, Best Practices und SEO für Startseite und Kontaktseite.
5. **Kill-Switch**: Alte Angular-Version lokal ausliefern und aufrufen (Service Worker installiert sich), dann Dateien durch `site/` ersetzen und neu laden. Erwartet: Service Worker abgemeldet, neue Seite sichtbar. Dasselbe mit `maintenance/`.
6. **HTML-Validität**: einmalig mit einem lokalen Validator (`npx html-validate`) ohne Fehler.

## 13. Umstellung

1. Umsetzung auf Branch `static-site`, Pull Request nach `main` mit neuer Seite, Wartungsseite, Workflow, README und Löschung von `src/podo-web`.
2. Der Merge löst keinen Deploy aus. Es bleibt die bisherige Angular-Wartungsseite live.
3. Nach Freigabe: erster Deploy über den Button mit Modus `wartung`. Danach Kontrolle von `https://podologie-lahn.de/` und einer Unterseite im Browser (Wartungsseite sichtbar, `/ngsw-worker.js` ist der Kill-Switch).
4. Der Wechsel auf `live` erfolgt durch den Eigentümer, wann immer gewünscht, auf demselben Weg (und zurück).

## 14. README

Ersetzt das bisherige README und beschreibt kurz:

- Was wo liegt (`site/`, `maintenance/`, Workflow).
- Umschalten Wartung/Live per Button, Schritt für Schritt.
- Inhalte ändern: Datei bearbeiten, committen, Button drücken. Hinweis, dass Header und Footer in allen Seiten identisch zu halten sind.
- Lokale Vorschau: `cd site && python3 -m http.server 8000`, dann `http://localhost:8000`.
- Optional, einmalig: Sitemap `https://podologie-lahn.de/sitemap.xml` in der Google Search Console einreichen.
- Workflow-Badge auf den neuen Workflow aktualisiert.
