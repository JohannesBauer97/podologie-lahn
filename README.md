# Podologie Lahn Website [![Deploy](https://github.com/JohannesBauer97/podologie-lahn/actions/workflows/deploy.yml/badge.svg)](https://github.com/JohannesBauer97/podologie-lahn/actions/workflows/deploy.yml)

Website der Podologie Lahn ([podologie-lahn.de](https://podologie-lahn.de)) – reines HTML, CSS und JavaScript, ohne Framework und ohne Build-Schritt. Was im Repository liegt, wird genau so ausgeliefert.

## Was liegt wo?

| Pfad | Inhalt |
|------|--------|
| `site/` | Die eigentliche Website. Jede Seite ist eine eigene `index.html` (`site/kontakt/index.html` = `/kontakt/`). |
| `site/assets/css/styles.css` | Das gesamte Styling. |
| `site/assets/js/main.js` | Mobiles Menü, Jahreszahl im Footer, Karte erst nach Klick laden. |
| `maintenance/` | Die Seite „Website in Wartung“ (komplett eigenständig). |
| `.github/workflows/deploy.yml` | Veröffentlichung auf GitHub Pages. |
| `res/` | Originalfotos. |

## Zwischen Wartung und Website umschalten

1. Auf GitHub das Repository öffnen → Reiter **Actions** → links **Deploy**.
2. Rechts **Run workflow** klicken.
3. Modus wählen: **wartung** (Wartungsseite) oder **live** (Website).
4. **Run workflow** bestätigen. Nach etwa einer Minute ist die Änderung online.

Das funktioniert auch im Browser am Handy. Ein normaler Push veröffentlicht bewusst nichts – online geht immer nur, was per Button gewählt wurde.

## Inhalte ändern

1. Die betreffende `index.html` in `site/` bearbeiten (z. B. Öffnungszeiten auf der Startseite und in `site/kontakt/index.html`).
2. Committen und pushen.
3. Über den Button oben neu veröffentlichen (Modus wie gewünscht).

Header und Footer stehen in jeder Seite als Kopie. Wer das Menü oder den Footer ändert, ändert ihn in allen Dateien gleich – die Stellen sind mit `<!-- HEADER -->` und `<!-- FOOTER -->` markiert.

## Lokal ansehen

```bash
cd site && python3 -m http.server 8000
```

Dann [http://localhost:8000](http://localhost:8000) öffnen. Für die Wartungsseite dasselbe im Ordner `maintenance/`.

## Einmalig nach dem Umstieg (optional)

In der [Google Search Console](https://search.google.com/search-console) die Sitemap `https://podologie-lahn.de/sitemap.xml` einreichen, damit Google die neuen Adressen schneller übernimmt.
