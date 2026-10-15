# Lösung Vereinstabelle

### Zerlegung nach dem ER-Prinzip

Spieler/innen können an mehreren Spielen teilnehmen, und an jedem Spiel nehmen mehrere Spieler/innen teil (**n:m-Beziehung**). Deshalb wird die Beziehung über die Tabelle `Teilnahme` aufgelöst. Ort und Gegner werden jeweils in eigenen Tabellen gespeichert.

#### Spieler/in

| SpielerID (PK) | Name |
|---|---|
| 1 | Anna Müller |
| 2 | Ben Fischer |
| 3 | Clara Weber |
| 4 | David Schneider |
| 5 | Emma Hoffmann |

#### Ort

| OrtID (PK) | Ort |
|---|---|
| 1 | Sporthalle Nord |
| 2 | Vereinsplatz West |
| 3 | Turnhalle Mitte |

#### Gegner

| GegnerID (PK) | Name |
|---|---|
| 1 | SV Grün-Weiß |
| 2 | FC Adler |
| 3 | TSV Rot-Weiß |

#### Spiel

| SpielID (PK) | Datum | OrtID (FK) | GegnerID (FK) |
|---|---|---|---|
| 1 | 12.04.2026 | 1 | 1 |
| 2 | 19.04.2026 | 2 | 2 |
| 3 | 26.04.2026 | 3 | 3 |

#### Teilnahme

Diese Tabelle löst die **n:m-Beziehung** zwischen Spieler/innen und Spielen auf. Der zusammengesetzte Primärschlüssel besteht aus `SpielerID` und `SpielID`.

| SpielerID (PK, FK) | SpielID (PK, FK) |
|---|---|
| 1 | 1 |
| 2 | 1 |
| 3 | 1 |
| 4 | 2 |
| 5 | 2 |
| 1 | 2 |
| 2 | 3 |
| 3 | 3 |
| 4 | 3 |

`PK` bedeutet **Primärschlüssel**, `FK` bedeutet **Fremdschlüssel**. Jedes Spiel hat hier einen Ort und einen Gegner; derselbe Ort oder Gegner kann in mehreren Spielen vorkommen.

### [zurück](index.html)

