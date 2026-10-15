# Lösung Wahlkurse

### Zerlegung nach dem ER-Prinzip

Die Tabelle enthält zwei Beziehungen: Schüler/innen können mehrere AGs besuchen und jede AG kann mehrere Schüler/innen haben (**n:m**). Jede AG wird von einer Lehrkraft betreut, die Lehrkraft kann mehrere AGs betreuen (**n:1**).

#### Schüler/in

| SchuelerID (PK) | Name |
|---|---|
| 1 | Mia Müller |
| 2 | Leon Schmidt |
| 3 | Emma Becker |

#### Lehrkraft

| LehrkraftID (PK) | Name | DienstID (FK) |
|---|---|---|
| 1 | Frau Weber | 1 |
| 2 | Herr Fischer | 2 |
| 3 | Frau Becker | 3 |

#### Dienstbezeichnung

| DienstID (PK) | Bezeichnung |
|---|---|
| 1 | StR |
| 2 | OStR |
| 3 | StD |

#### AG

| AGID (PK) | AG-Name | Raum | LehrkraftID (FK) |
|---|---|---|---|
| 1 | Theater-AG | Aula | 1 |
| 2 | Robotik-AG | Raum 204 | 2 |
| 3 | Chor-AG | Musikraum | 3 |

#### Teilnahme

Diese Tabelle löst die **n:m-Beziehung** zwischen Schüler/innen und AGs auf. Der zusammengesetzte Primärschlüssel besteht aus `SchuelerID` und `AGID`.

| SchuelerID (PK, FK) | AGID (PK, FK) |
|---|---|
| 1 | 1 |
| 1 | 2 |
| 2 | 1 |
| 2 | 3 |
| 3 | 2 |
| 3 | 3 |

`PK` bedeutet **Primärschlüssel**, `FK` bedeutet **Fremdschlüssel**. Die Dienstbezeichnung ist in eine eigene Tabelle ausgelagert, damit sie nicht mehrfach bei jeder Lehrkraft als Text gespeichert werden muss.

### [zurück](index.html)

