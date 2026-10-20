# Lösung Rezepte

### Zerlegung nach dem ER-Prinzip

Ein Rezept enthält mehrere Zutaten, und dieselbe Zutat kann in mehreren Rezepten vorkommen (**n:m-Beziehung**). Deshalb wird die Beziehung über die Tabelle `Rezept_Zutat` aufgelöst.

#### Rezept

| RezeptID (PK) | Rezeptname |
|---|---|
| 1 | Kartoffelpuffer |
| 2 | Kartoffelsuppe |
| 3 | Kartoffelpüree |

#### Zutat

| ZutatID (PK) | Zutatenname |
|---|---|
| 1 | Kartoffeln |
| 2 | Zwiebeln |
| 3 | Eier |
| 4 | Stärke |
| 5 | Mehl |
| 6 | Sahne |
| 7 | Karotten |
| 8 | Lauch |
| 9 | Sellerie |

#### Rezept_Zutat

Diese Tabelle löst die **n:m-Beziehung** zwischen Rezepten und Zutaten auf. Der zusammengesetzte Primärschlüssel besteht aus `RezeptID` und `ZutatID`.

| RezeptID (PK, FK) | ZutatID (PK, FK) |
|---|---|
| 1 | 1 |
| 1 | 2 |
| 1 | 3 |
| 1 | 4 |
| 1 | 5 |
| 2 | 1 |
| 2 | 2 |
| 2 | 7 |
| 2 | 8 |
| 2 | 9 |
| 3 | 1 |
| 3 | 6 |

`PK` bedeutet **Primärschlüssel**, `FK` bedeutet **Fremdschlüssel**.

### [zurück](index.html)