<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Leiterplatten-Design mit Fritzing
Für unsere Alarmanlage entwickeln wir ein Shield, das direkt auf den Arduino Uno aufgesteckt werden kann und Anschlüsse für alle Bauteile enthält.

## Entwurf in der Leiterplatten Ansicht.
### Arduino Uno
Ziehe einen Arduino UNO auf die Arbeitsfläche:  

![alt text](2024-11-03_08-23.png)  

Wenn wir die Platine später herstellen lassen, werden 
- die Beschriftungen aufgedruckt
- die Kontakte als Löcher gebohrt.
### Anschlüsse für Bewegungsmelder
1.  Ziehe aus dem **Anschlüsse**-Bereich einen **Generic female Header** auf den Arduino
2.  Stelle im Inspektor ein, dass er um 90° gedreht ist
3.  und 3 Pins hat:  
![alt text](2024-11-03_08-30.png)  
### Beschriftung
1. Schalte im Menü **Bauteil** den Punkt **Bauteilbeschriftung anzeigen** aus.
2. Ziehe aus dem **Leiterplattenansicht**-Bereich einen **text** auf den Arduino
3. Ändere im Inspektor den Text von **logo** auf **Bewegungsmelder**  
![alt text](2024-11-03_08-36.png)  
4.  Füge eine weitere Beschriftung mit **+ D -** hinzu.
![alt text](2024-11-03_08-39.png)
### Verdrahtung
1. Ziehe einen Draht von + zu 5V des Arduinos.
2. Ziehe einen Draht von - zu GND.
3. Ziehe einen Draht von D zu 6.
4. Ziehe an den Drähten, so dass sie gute Abstände zu den anderen Kontakten haben.    
**WICHTIG: Rechte Winkel sind auf Leiterplatten nicht erwünscht, da sie beim Ätzen Probleme bereiten.**   

![alt text](2024-11-03_08-44.png)
### 2-Farb-LED
1.  Ziehe aus dem **Anschlüsse**-Bereich einen weiteren **Generic female Header** auf den Arduino
2.  Stelle im Inspektor ein, dass er um 90° gedreht ist und 3 Pins hat.
3.  Beschrifte ihn mit **LED**
4.  Ziehe aus dem **Basis**-Bereich einen Widerstand auf den Arduino.
5.  Verbinde den Widerstand mit dem mittleren Pol der LED und GND.
6.  Verbinde die beiden anderen Pole der LED mit den Pins 7 und 8. 
Hierbei musst du den Draht von D zu Pin 6 kreuzen. Klicke ihn mit der rechten Maustaste an und verschiebe ihn auf die untere Ebene:  
![alt text](2024-11-03_08-52.png)  
### Buzzer
1. Ziehe aus dem **Anschlüsse**-Bereich einen weiteren **Generic female Header** auf den Arduino
2.  Stelle im Inspektor ein, dass er um 90° gedreht ist und 2 Pins hat.
3.  Beschrifte ihn mit **Buzzer**
4.  Beschrifte ihn mit - und A
5.  Schließe - an GND und A an Pin 5 an.


### Fernbedienungssensor
1. Füge einen weiteren 3-Pin-Anschluss für den IR-Sensor hinzu:   

![alt text](2024-11-03_09-04.png)  
### Entwurf speichern
Speichere den Entwurf im Menü **Datei.speichern** als Fritzing-Datei.
### Platine bestellen
#### Aisler
Die Platine kann beim deutshen Hersteller Aisler direkt aus Fritzing heraus bestellt werden.
1. Klicke auf das Menü **Datei.Leiterplatte bestellen**.
2. Wähle **Hochladen zur FAB**
3. Klicke auf **Open in Browser**
4. Klicke dich durch den Bestellprozess.

#### PCBWay
Für den chinesischen Anbieter PCBWay musst du die Platine zuerst als Sammlung von Gerber-Dateien exportieren:

1. Ziehe die graue Leiterplattenfläche so klein, dass sie den Arduino genau überdeckt.
2. Wähle das Menü **Datei.Exportieren.Für die Produktion.Extended Gerber** und speichere die Dateien in einem passenden Ordner.
![alt text](2024-11-03_09-08.png)  
3. Öffne den [Online-Gerber-Viewer](https://www.pcbway.com/project/OnlineGerberViewer.html) von PCBWay
4. Importiere alle Gerber-Dateien, die du vorher exportiert hast.
5. Klicke auf **Get Instant PCB Quote** um die Platinen zu bestellen.



