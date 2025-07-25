<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Lötvorlage aus Fritzing-Dateien

### Lötunterlage erstellen
Für Stiftsockelleisten kann eine Lötvorlage für den 3D-Drucker erstellt werden:

1. Exportiere das Projekt als SVG-Dateien:  
Datei.Exportieren.für die Produktion.Ätzbar(SVG)
2. Öffne eine Datei mit den Borhungen in Inkscape
3. Speichere die Datei im Autocad DXF12-Format (Datei.Speichern unter)
4. Stelle im Speichermenü die Einheit auf mm und die Zeichencodierung auf UTF-8
5. Starte Onshape und erzeuge eine neue Datei.
6. Erzeuge eine neue Skizze auf der Top-Ebene
7. Klicke auf DXF oder DWG einfügen (ggf. musst du das Werkzeug suchen lassen)
8. Importiere die DXF-Datei, die du gerade herunter geladen hast.
9. Extrudiere die Skizze 10 mm hoch.
10. Auf der Lötunterlage können jetzt die Stiftsockelleisten beim Löten aufgesteckt werden.

Um Buchsenleisten zu löten kann ebenfalls dieser Weg beschritten werden. Hier schließen sich weitere Schritte an:
11. Erzeuge eine neue Skizze auf der Oberfläche der Löthilfe
12. Für ungerade Bohrungszahlen:   
- Erstelle einen Dreipunktkreis auf der mittleren Bohrung
- Erstelle ein Mittelpunktrechteck auf dem Mittelpunkt des Kreises mit folgenden Maßen:  
  - n*2.54+5 mm Länge (n=Zahl der Bohrungen)
  - 3 mm Breite
13.  Für gerade Bohrungszahlen:
  - Erstelle zwei Dreipunktkreise auf den mittleren beiden Bohrungen
- Erstelle eine Linie zwischen den Mittelpunkten dieser beiden Kreis
- Erstelle das Mittelpunktrechteck auf dem Mittelpunkt dieser Linie.

14.  Extrudiere die Skizze als neues Objekt 7 mm hoch.
15.  Erstelle auf der Oberfläche eine neue Skizze
16.  Erzeuge ein Eckenrechteck auf dem gesamten Objekt
17.  Extrudiere dieses Rechteck 3 mm weit.

[zurück](../index.html)   
