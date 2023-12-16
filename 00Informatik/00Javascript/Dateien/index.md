# Einlesen von Daten aus Dateien

Quelle: [TheCodingTrain](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/welcome/trailer)

## 1. Einlesen von Bilddaten mit Fetch
Quelle: [TheFetch()Function](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/1-client-side/1-fetch)  
```JavaScript
  async function catchBild() {
        const response = await fetch('bild.png');
        const blob = await response.blob();
        document.getElementById('bild').src = URL.createObjectURL(blob);
      }
```
Die Bilddaten werden mit der fetch()-Funktion aus der Datei *bild.png* geladen.  
Das Öffnen der Datei und das Laden der Daten dauert relativ lange. Aus diesem Grund muss das System warten, bis die Daten geladen sind.   
Dies geschieht zum einen dadurch, dass die funktion catchBild als asynchrone Funktion definiert wird: **async function catchBild()...**.  Zum anderen durch das Schlüsselwort **await** vor der fetch()-Funktion.  
Bilddaten werden als **blob**-Daten (**B**inary **L**arge **Ob**ject = Großes Objekts aus binären Daten) aus der Antwort der fetch()-Funktion gelesen. Auch diese Funktion muss mit **await** versehen werden, da auch das Auslesen relativ lange dauert.  
Allgemein müssen alle Funktionen, die direkt von den gelesenen Daten abhängig sind, in der asynchronen Funktion verarbeitet werden.  
Fehler beim Laden des Bildes können nach dem Aufruf der Funktion abgefangen werden:
``` Javascript
 catchBild()
        .then(response => {
          console.log('Bild geladen');
        })
        .catch(error => {
          console.log('Fehler beim Laden!');
          console.error(error);
        });
```
Der catch-Teil wird hierbei aufgerufen, wenn ein Fehler aufgetreten ist.  
Die Programmierung über die .then-Konstruktion ist eine andere Art der asynchronen Programmierung. Der .then-Teil wird erst ausgeführt, wenn die Bilddaten geladen sind. 

[Gesamter Quellcode](Quellcode.txt)  
[Beispielsdatei](Bild.html)  
[zurück](../index.html)

