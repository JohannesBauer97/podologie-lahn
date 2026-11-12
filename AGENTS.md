# AGENTS.md

Anleitung für KI-Agenten, die an dieser Website arbeiten. Wer dich beauftragt, nennt nur die gewünschte Änderung. Alles andere steht hier. Halte dich daran, ohne nachzufragen. Frag nur, wenn die gewünschte Änderung selbst unklar ist.

## Worum es geht

- Website der Praxis **Podologie Lahn** (Evelyn Lahn, Podologin, Bahnhofstraße 12, 14789 Wusterwitz): [podologie-lahn.de](https://podologie-lahn.de).
- Zielgruppe sind Patientinnen und Patienten aus der Region, oft älter und meist am Handy. Die Seite muss auf dem Handy einwandfrei funktionieren.
- Die Seite besteht aus reinem HTML, CSS und JavaScript, **ohne Framework, ohne Build-Schritt und ohne npm-Abhängigkeiten**. Was im Repo liegt, wird genau so ausgeliefert. Das bleibt so: Füge weder `package.json` noch Bundler, CSS- oder JS-Frameworks hinzu.
- Änderungen sind selten. Halte sie klein und nah am vorhandenen Stil.
- Das Repo ist öffentlich. Die `README.md` richtet sich an Kunden, die zufällig auf das Repo stoßen, und enthält nur die Kontaktdaten der Praxis. Technische Informationen gehören hierher, nicht in die README.

## Aufbau

| Pfad | Inhalt |
|------|--------|
| `site/` | Die eigentliche Website. Jede Seite ist eine eigene Datei: `site/<seite>/index.html` ergibt `/<seite>/`, die Startseite ist `site/index.html`. |
| `site/assets/css/styles.css` | Das gesamte Styling, handgeschrieben und mobile-first, gegliedert in 1. Variablen, 2. Schriften, 3. Basis, 4. Layout, 5. Header/Navigation/Footer, 6. Komponenten, 7. Seitenspezifisches, 8. Barrierefreiheit. |
| `site/assets/js/main.js` | Mobiles Menü, Jahreszahl im Footer, Google-Karte erst nach Klick laden. Vanilla JS, keine Abhängigkeiten. |
| `site/assets/img/`, `fonts/`, `icons/` | Bilder als WebP (dazu `logo.svg` und `og-image.jpg`), die Schrift Roboto als WOFF2, App-Icons. |
| `site/404.html`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest` | Fehlerseite, SEO und App-Manifest. |
| `maintenance/` | Die Seite „Website in Wartung“: `index.html` und `404.html` sind identisch, das CSS steht inline, die Schriften liegen im Ordner selbst. Komplett eigenständig. |
| `site/ngsw-worker.js`, `maintenance/ngsw-worker.js` | Kill-Switch für den Service Worker der früheren Angular-Version. Er räumt die Browser alter Besucher auf. **Nicht löschen.** |
| `.github/workflows/deploy.yml` | Veröffentlichung auf GitHub Pages, nur per Button. |
| `res/` | Originalfotos in voller Größe. |
| `CNAME`, `.nojekyll` | Einstellungen für GitHub Pages. |

Seiten: Home `/`, `/ueber/`, `/leistungen/`, `/podo-taping/`, `/kontakt/`, `/impressum/`, `/datenschutz/`, `/agb/` und dazu `404.html`.

## Veröffentlichen: Wartung oder Website

- GitHub → Actions → **Deploy** → **Run workflow**, dann den Modus `wartung` (liefert `maintenance/` aus) oder `live` (liefert `site/` aus) wählen. Per CLI: `gh workflow run deploy.yml -f mode=wartung` bzw. `-f mode=live`.
- Ein Push veröffentlicht **nichts**. Starte einen Deploy nur, wenn es ausdrücklich verlangt wird, und frag im Zweifel nach dem Modus. Welcher Modus zuletzt lief, zeigt `gh run list --workflow deploy.yml`.
- Nach einer inhaltlichen Änderung muss neu deployt werden, damit sie online geht. Weise darauf hin, statt es eigenmächtig zu tun.

## Regeln für Änderungen

**Aussehen**
- Das Design entspricht der früheren Angular/Tailwind-Seite: helles Lime-Grün, Grau und Roboto. Nutze die vorhandenen CSS-Variablen (`--lime-500`, `--gray-700`, `--text-xl` …) und Klassen und erfinde keine neuen Farben oder Abstände.
- Schreibe mobile-first. Die Breakpoints sind 640, 768, 1024, 1280 und 1536 px. Es darf kein horizontales Scrollen auf 375 px Breite geben.
- Icons sind inline eingebettete SVGs von Font Awesome Free (Klasse `icon`), nie Icon-Fonts oder CDNs.

**Header und Footer**
- Header und Footer stehen als Kopie in allen 9 HTML-Dateien von `site/`, markiert mit `<!-- HEADER -->` … `<!-- /HEADER -->` und `<!-- FOOTER -->` … `<!-- /FOOTER -->`. Ändere sie überall identisch.
- Der aktive Menüpunkt trägt `aria-current="page"`, und zwar in der Desktop- und in der mobilen Navigation.

**Neue Seite**
- Kopiere eine bestehende Seite nach `site/<slug>/index.html`.
- Passe diese Teile an:
  - den `<title>` im Format `Name | Podologie Lahn`;
  - den Block `<!-- PAGE-SPECIFIC -->` mit `description` (120–160 Zeichen), `canonical`, `og:title`, `og:description` und `og:url`;
  - das `aria-current` in Header bzw. Footer;
  - den Eintrag in `site/sitemap.xml`.
- Links sind root-relativ und enden mit einem Schrägstrich (`/kontakt/`).

**Kontaktdaten und Öffnungszeiten**
Sie stehen an mehreren Stellen. Ändere immer alle:
- den sichtbaren Text in `site/index.html`, `site/kontakt/index.html` und `site/impressum/index.html`;
- die strukturierten Daten (`<script type="application/ld+json">`) in `site/index.html`, `maintenance/index.html` und `maintenance/404.html`;
- die Meta-Description in `site/kontakt/index.html`;
- die `README.md`.

**Wartungsseite**
- `maintenance/index.html` und `maintenance/404.html` bleiben identisch.
- Verweise nie auf Dateien aus `site/`, denn im Wartungsmodus wird nur `maintenance/` ausgeliefert. Was die Wartungsseite braucht, liegt in ihrem eigenen Ordner, zum Beispiel `maintenance/assets/img/` für die strukturierten Daten.

**Datenschutz**
- Beim Seitenaufruf gehen keine Anfragen an Dritte raus: keine Google Fonts, kein CDN, kein Tracking, keine Analytics, keine Cookies, keine Social-Media-Einbettungen.
- Google Maps lädt nur nach dem Klick auf „Karte laden“ (`[data-map]` in `site/kontakt/index.html` und `main.js`).
- Jeder neue externe Dienst braucht einen eigenen Abschnitt in der Datenschutzerklärung und in der Regel eine Einwilligung per Klick.

**Rechtstexte (Impressum, Datenschutz, AGB)**
- Arbeite rechtlich sorgfältig und auf dem aktuellen Stand, zum Beispiel mit DDG, TDDDG und DSGVO statt TMG und TTDSG.
- Beschreibe nur, was auf dieser Website wirklich passiert. Es gibt kein Kontaktformular, keine Analyse des Nutzerverhaltens und keinen Auftragsverarbeitungsvertrag mit GitHub.
- Formuliere die Texte so, dass sie fertig sind und direkt online gehen können. Hinterlasse **keine** Hinweise wie „bitte prüfen“, „TODO“ oder Platzhalter in eckigen Klammern. Der Inhaber prüft selbst.

**Inhalte und Barrierefreiheit**
- Schreibe auf Deutsch, in der Sie-Form und mit echten Umlauten (die Dateien sind UTF-8).
- Telefonnummern in Links schreibst du mit `&nbsp;`, also `+49&nbsp;33839&nbsp;329063`.
- Jede Seite hat genau eine `<h1>`, die Überschriften sind sinnvoll verschachtelt.
- Bilder brauchen einen `alt`-Text, `width` und `height` und unterhalb des sichtbaren Bereichs `loading="lazy"`. Lege das Original in `res/` ab und binde eine WebP-Version aus `site/assets/img/` ein.
- Bedienelemente sind mindestens 44 × 44 px groß und mit der Tastatur erreichbar, der Fokus bleibt sichtbar.
- Für Text oder Buttons auf Weiß nimmst du `--lime-700` statt `--lime-500`, damit der Kontrast reicht.
- Die Seite muss auch ohne JavaScript benutzbar bleiben.
- Bei inhaltlichen Änderungen setzt du `<lastmod>` der betroffenen Seite in `site/sitemap.xml` auf das aktuelle Datum.

**Nicht anfassen ohne ausdrücklichen Auftrag**
- `ngsw-worker.js` in beiden Ordnern.
- `CNAME` und den Workflow.

## Vor dem Abschluss prüfen

1. **Lokal ansehen:**
   - `cd site && python3 -m http.server 8000` → http://localhost:8000
   - Wartungsseite: `cd maintenance && python3 -m http.server 8081` → http://localhost:8081
2. **Jede geänderte Seite** bei 375, 768 und 1280 px Breite ansehen. Sie darf keine Fehler in der Konsole zeigen und laut Network-Tab keine Anfragen an fremde Server stellen.
3. **HTML validieren:**
   ```bash
   npx --yes html-validate --rule 'doctype-style:off' site/*.html site/*/index.html maintenance/*.html
   ```
4. **Links prüfen:** Interne Links zeigen auf existierende Seiten.

## Git

- Arbeite auf `main`, solange nichts anderes gesagt wird. Committe oder pushe nur, wenn es verlangt wird. Ein Push deployt nicht.
- Commit-Nachrichten schreibst du auf Englisch, im Imperativ, mit einer kurzen Zusammenfassung.
