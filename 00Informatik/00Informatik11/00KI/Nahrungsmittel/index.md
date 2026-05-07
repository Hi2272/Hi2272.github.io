# Schwellenwertbasierte Entscheidungsbäume

Bei Attributen, die Zahlenwerte speichern, wird in den Knoten des Entscheidungsbaums geprüft, ob sie oberhalb eines bestimmten Schwellenwertes liegen.  
In dieser Übung soll der Einfluss des Schwellenwertes auf das Verhalten des Baumes untersucht werden.

## 1. Online-Tool 
Folge den Anweisungen auf dieser Seite und erstelle einen Entscheidungsbaum:
<a href="https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI/schritt1" target="_blank">https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI/schritt1</a>

## 2. Umsetzen mit Excel

1. Kopiere den gelabelten Datensatz in eine Exceltabelle
2. Sortiere die Daten jeweils nach dem Attribut, nach dem du trennen möchtest.
3. Wähle einen sinnvollen Schwellenwert und trenne den Datensatz, indem du den Teil oberhalb des Schwellenwertes ausschneidest und in eine neue Tabelle einfügst.
4. Notiere deinen Entscheidungsbaum im Heft.

Datensatz (Quelle: https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI/schritt7)


| Name | Energie | Fett | ges. Fettsäuren | Kohlenhydrate | Zucker | Eiweiß | Salz | Label |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Apfel | 52 | 0,2 | 0 | 13,8 | 11 | 0,3 | 0 | Eher empf. |
| Banane | 95 | 0,3 | 0,1 | 21 | 12 | 1,1 | 0,1 | Eher empf. |
| Nudeln | 359 | 2 | 0,5 | 70,9 | 3,5 | 12,8 | 0 | Eher empf. |
| Erbsen | 86 | 1 | 0,2 | 9,4 | 3,5 | 6,4 | 0 | Eher empf. |
| Eisbergsalat | 7 | 0 | 0 | 0,7 | 0,7 | 0,5 | 0 | Eher empf. |
| Brotscheibe | 229 | 4,9 | 0,8 | 35 | 2,3 | 7,7 | 1 | Eher empf. |
| Knäckebrot | 349 | 3 | 0,7 | 61 | 0,7 | 12 | 0,5 | Eher empf. |
| Salatgurke | 12 | 0,1 | 0 | 3,6 | 1,7 | 0,7 | 2 | Eher empf. |
| Brokkoli | 43 | 0,2 | 0,1 | 2,9 | 1,7 | 4 | 0 | Eher empf. |
| Haferflocken | 368 | 7 | 1,5 | 58,7 | 0,7 | 13,5 | 0 | Eher empf. |
| Kartoffel | 71 | 0,1 | 0 | 15 | 0,8 | 1,7 | 2 | Eher empf. |
| Putenbrustfilet (gebraten) | 111 | 1,7 | 0,6 | 0 | 0 | 24 | 0,2 | Eher empf. |
| Avocado | 160 | 13 | 2,8 | 2 | 0,7 | 1,5 | 0,1 | Eher empf. |
| Haselnussschnitte | 542 | 31,9 | 18,6 | 54 | 42,6 | 7,6 | 0,4 | Eher nicht empf. |
| Gummibärchen | 343 | 0,1 | 0,1 | 77 | 46 | 6,9 | 0,1 | Eher nicht empf. |
| Chips | 503 | 28 | 2,6 | 53 | 2,9 | 6,3 | 2,8 | Eher nicht empf. |
| Pommes | 289 | 14 | 1,3 | 36 | 0,3 | 3,4 | 0,7 | Eher nicht empf. |
| Frikadelle | 294 | 22 | 2,8 | 10,5 | 2 | 13,5 | 1,5 | Eher nicht empf. |
| Popcorn | 499 | 23 | 13,8 | 57 | 3,8 | 10,7 | 1,8 | Eher nicht empf. |
| Vanilleeis | 207 | 11 | 6,7 | 24 | 21 | 3,5 | 0,1 | Eher nicht empf. |
| Marmorkuchen | 447 | 26 | 14 | 54 | 33 | 5,4 | 0,4 | Eher nicht empf. |
| Chicken Nuggets | 241 | 11 | 1,5 | 21 | 0,5 | 14 | 1 | Eher nicht empf. |
| Erdbeerjoghurt | 93 | 2,8 | 1,8 | 14 | 13 | 3 | 0,1 | Eher nicht empf. |
| Schokomüsli | 406 | 11,3 | 4,7 | 60,7 | 22,2 | 10,7 | 0,3 | Eher nicht empf. |
| Waffel | 459 | 24,3 | 12,7 | 53 | 33,8 | 7,5 | 0,3 | Eher nicht empf. |
| Vollmilchschokolade | 530 | 29,5 | 17,5 | 58,5 | 57,5 | 6,6 | 0,2 | Eher nicht empf. |
| Majonaise | 721 | 79,3 | 10 | 0,2 | 0,2 | 1,2 | 0,8 | Eher nicht empf. |
| Himbeermarmelade | 223 | 0,2 | 0 | 52,2 | 51,7 | 0,7 | 0 | Eher nicht empf. |
