# Klassenshirt Bestellung

Eine Schulklasse möchte Kleidungsstücke mit ihrem Schul- und Klassenlogo bestellen. Zu diesem Zweck hat sie eine Tabelle angelegt, auf der jedes Klassenmitglied seine Wünschen mit einem x kennzeichnen kann:  

| Namen | T-Shirt | Hoodie | Cap |
|---|---|---|---|
|Preis|19,99|39,99|9,99|
| Ahrens, Mia | x |  | x |
| Albrecht, Jonas |  | x |  |
| Bauer, Emma | x | x |  |
| Becker, Leon |  |  |  |
| Bergmann, Lina | x |  |  |
| Brandt, Noah |  | x | x |
| Busch, Ella | x | x |  |
| Clausen, Finn |  |  | x |
| Dahl, Mila | x |  | x |
| Ebert, Paul |  |  |  |
| Engel, Sophie | x | x | x |
| Fischer, Ben |  | x |  |
| Frank, Clara | x |  |  |
| Graf, Emil |  | x | x |
| Hartmann, Amelie | x | x |  |
| Heinrich, Theo |  |  | x |
| Jung, Hannah | x |  |  |
| Kaiser, Elias |  | x | x |
| Keller, Marie | x | x | x |
| Koch, Oskar |  |  |  |
| Lange, Johanna | x |  | x |
| Lehmann, Luca |  | x |  |
| Maier, Greta | x | x |  |
| Neumann, David |  |  | x |
| Schneider, Frieda |  | x |  |
| Wagner, Mats |  |  |  |

## Aufgabenstellung
1. Markiere die Tabelle, kopiere sie (Strg C) und füge sie in eine leere Excel-Tabelle ein (Zelle A1 anklicken, Strg V)
2. Erstelle in Zelle E3 eine Funktion, die wenn in Zelle B3 ein "x" steht, den Preis von Zelle B2 anzeigt, sonst soll sie leer bleiben.  
Wichtig: Die Funktion soll nach unten und nach rechts kopiert werden können. Verwende die passenden absoluten Bezüge.
3. Kopiere diese Funktion in die Zellen F3 und G3.
4. Erstelle in I3 eine Funktion, die den gesamten Preis berechnet, den die Person bezahlen muss. Wenn die Summe 0 ist, soll die Zelle leer bleiben.
5. Kopiere die Zellen E3 bis I3 auf das gesamte Tabellenblatt.
6. Markiere die Spalten B bis D und schalte über Daten.Filter einen Filter auf diese Spalten.  
Experimentiere mit diesem Filter. Welchen Sinn haben gefilterte Listen.
7. Füge einen Filter hinzu, mit dem du alle Schüler anzeigen kannst, die keine Kleidungsstücke bestellt haben.
8. Füge in Zelle B30 diese Funktion ein: **=ZÄHLENWENN(B3:B28,"x")**
9. Kopiere die Funktion in die Zellen C30 und D30 und erläutere ihre Sinn.
10. Füge in die Zellen B29 eine Funktion ein, die den Inhalt von B1 anzeigt.
11. Kopiere auch dieses Funktion in die Zellen C29 und D29.
