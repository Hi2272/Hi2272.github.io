<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Datenbank-Design in Access

## Entwurfs- und Eingabemodus
In Access muss grundsätzlich zwischen zwei Bearbeitungsmodi unterschieden werden:  
### Entwurfsmodus
![alt text](00Entwurf.png)  
schaltet in den Entwurfsmodus um.  
Hier können die Datenbanktabellen gestaltet werden.  
### Eingabemodus
- ![alt text](00Eingabe.png)  
schaltet in den Eingabemodus um.  
Hier werden Daten in die bestehenden Tabellen eingetragen.  
## Erzeugen der Tabelle Schueler
Schalte in den Entwurfsmodus und erzeuge folgende Tabelle:  
![alt text](01Schueler.png)  
Speichere die Tabelle unter dem Namen "Schueler". (Evtl. musst du die Tabelle1 mit einem Rechtsklick in Schueler umbenennen.)
 ## Erzeugen der Tabelle Klasse  
 Erzeuge im **Erstellen**-Menü eine neue Tabelle und speichere sie unter dem Namen **Klassen.**  
 ![alt text](03NeueTabelle.png)  
 Trage im Entwurfsmodus folgende Attribute ein:  
 ![alt text](03Attribute.png)  
 Überprüfe, dass für das Attribut ID folgende Feldeigenschaften gelten:  
 ![alt text](03Constraints.png)  
 Damit legen wir ID als Primärschlüssel fest, der aber nicht automatisch erzeugt wird.  
 ## Beziehungen erzeugen
 Schließe alle Tabellen durch eine Rechtsklick auf den Tabellenkopf:  
 ![alt text](04AlleSchliessen.png)  
 - Wechsele ins Menü **Datenbanktools** und klicke dort auf Beziehungen:  
 ![alt text](04Beziehungen.png)  
 - Ziehe beide Tabellen auf die Arbeitsfläche.  
 Beziehungen zwischen den Tabellen werden jetzt erstellt, indem der Primärschlüssel der einen Tabelle auf das passende Attribut der zweiten Tabelle gezogen wird.  
 - Ziehe die **ID** der Tabelle **Klassen** auf das Attribut **Klasse** der Tabelle **Schüler**.
 - Die Kardinalität der Beziehung wird automatisch gesetzt. Da jeder Schüler genau eine Klasse besucht, eine Klasse aber von beliebig vielen Schüler besucht wird, entsteht eine 1:n-Beziehung.  
    
 - Wähle zusätzlich **referentielle Integrität**, damit Access automatisch prüft, ob die Klasse, die in der Tabelle Schüler eingetragen wird, auch tatsächlich existiert:  
  ![alt text](04Relationstyp.png)  
 - Im Ergebnis wird die Relation korrekt dargestellt:  
  ![alt text](04Relationfertig.png)
  ## Die Tabelle Raum
- Erstelle eine Tabelle **Raum** mit folgenden Attributen:  
  ![alt text](05Raum.png)
- Ändere die Feldeigenschaften des Attributs **Klassenzimmer** in der Tabelle **Klasse** auf **Indiziert: Ja (Ohne Duplikate)**  
- Erzeuge diese 1:1-Beziehung:  
 ![alt text](06RelationRaum.png) 
 Da wir bei beiden Attributen keine Duplikate zulassen, erzeugt Access automatisch eine 1:1-Relation.  
 ## Daten eintragen
 Trage in die drei Tabelle in folgender Reihenfolge Werte ein:  
 ![alt text](06WerteRaum.png)  
 ![alt text](06WerteKlassen.png)  
 ![alt text](06WerteSchueler.png)  
 ## Die Tabelle Lehrer
 Erstelle eine Tabelle Lehrer und binde sie in dein Datenbankschema ein:  
 ![alt text](07RelationLehrer.png)  
 ## Wahlkurse
 Ergänze deine Datenbank um die Tabellen **Wahlkurs** und **Kurswahl**:  
 ![alt text](08RelationsWahlkursWahlunterricht.png)  
 Trage in deine Tabellen in der richtigen Reihenfolge Daten ein, so dass Schüler Wahlkurse belegt haben.  

 
[zurück](../../index.html)  



