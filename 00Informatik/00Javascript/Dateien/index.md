  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Einlesen von Daten aus Dateien

[Bilddaten](#1-einlesen-von-bilddaten-mit-fetch)|
[CSV-Daten mit grafischer Darstellung](#2-laden-von-csv-dateien)| [JSON-Daten](#3-json-daten)  

Quelle: [TheCodingTrain](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/welcome/trailer)

## 1. Einlesen von Bilddaten mit Fetch
Quelle: [The CodingTrain](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/1-client-side/1-fetch)  
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
Anschließend werden die blob-Daten als URL-Objekt in das Image-Tag der HTML-Datei geschrieben.  
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
## 2. Laden von CSV-Dateien
### a) Einlesen und Umwandeln der Daten
Quelle: [The Coding Train](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/1-client-side/2-tabular-data)  

CSV-Dateien sind Text-Dateien, die Daten in Form einer Tabelle enthalten. Die einzelnen Spalten sind durch Kommas getrennt. Die Daten werden prinzipiell genauso geladen wie die Bilddaten. Allerdings ist das Format der Daten **text** statt **blob**:  

```JavaScript
    getData();

    async function getData() {
      const response = await fetch('test.csv');
      const data = await response.text();  // Daten werden aus Text-Datei geladen

      const table = data.split('\n'); // In Zeilen trennen
      table.slice(1); // Erste Zeile abschneiden (Spaltenköpfe)
      table.forEach(row => {
        const cols = row.split(',');  // In Spalten trennen
        const zeit = cols[0]
        const temp = cols[1]
        console.log(zeit, temp)
      });
    }

```
Die CSV-Daten werden anschließend mit der split-Funktion in ein Array umgewandelt. Die Trennung erfolgt hierbei an den Zeilenumbrüchen ('\n').  
Durch **split(",")** werden die Zeilen an den trennenden Kommas in Spalten aufgebrochen.  
### b) Grafische Darstellung der Daten
Quelle: [The Coding Train](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/1-client-side/3-graphing)  

Für die grafische Darstellung verwenden wir die **Chart.js**-Bibliothek:
``` HTML
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
```
Die grafische Darstellung muss auch in einer asynchrone Funktion eingebaut werden. 
``` Javascript
    <script>
      window.addEventListener('load', setup);  // Sobald das Fenster geladen ist, wird die Funktion setup gestartet

      async function setup() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const daten = await getData(); // asynchron, wartet auf Daten 
        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: daten.zeit,
            datasets: [
              {
                label: 'Temperatur in °C',
                data: daten.temp,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 1
              }
            ]
          },
          options: {}
        });
      }

      async function getData() {
        const response = await fetch('test.csv');  // wartet auf Öffnen der Datei
        const data = await response.text();  // wartet auf Daten aus Datei
        const zeit = [];  // Array für die Zeiten
        const temp = [];  // Array für die Temperaturen
        const rows = data.split('\n').slice(1); // In Zeilen auftrennen, 1. Zeile löschen
        rows.forEach(row => {
          const cols = row.split(',');  // Zeilen in Spalten auftrennen
          zeit.push(parseInt(cols[0])); // Zeit in Array speichern 
          temp.push(parseFloat(cols[1])); // Temperatur in Array speichern
        });
        return { zeit,temp };    // Objekt aus .zeit und .temp werden zurückgegeben
      }
```
[Gesamter Quellcode](Diagramm.txt)  
[Beispielsdatei](Diagramm.html)  
## 3. JSON-Daten
Quelle: [TheCodingTrain](https://thecodingtrain.com/tracks/data-and-apis-in-javascript/data/1-client-side/4-json)  
### a) JSON-Dateiformat
JSON (**J**ava**s**cript **O**bject **N**otification)-Dateien sind Text-Dateien, die wie Javascript Objekte aufgebaut sind:  
``` JSON
{
    "long"  : -45,
    "lat" : 12
}

```
Die Namen der Attribute müssen in Anführungszeichen stehen.  
### b) Daten aus APIs
Eine API (**A**plication **P**rogramming **I**nterface) ist eine Schnittstelle einer Internetseite, die Daten für Programmme zur Verfügung stellt. Diese Daten werden häufig im JSON-Format ausgegeben. Bei den meisten APIs ist eine Registrierung und eine Anmeldung durch das Programm nötig, das die Daten auslesen will.  
### c) Auslesen der Position der ISS
Die Internetseite [https://wheretheiss.at](https://wheretheiss.at) stellt die aktuelle Position der ISS dar und bietet diese Daten über eine API an, bei der keine Registrierung nötig ist.  
``` JavaScript
  const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'; 

      async function getISS() {
        const response = await fetch(api_url);
        const data = await response.json(); 
        console.log(data);
        document.getElementById('lat').textContent = data.latitude.toFixed(2);
        document.getElementById('lon').textContent = data.longitude.toFixed(2);
      }

      getISS();
```
Mit **const data = await response.json();** werden die Daten im JSON-Format ausgelesen und in der Variable **data** gespeichert.  
**data** ist jetzt ein JavaScript-Objekt mit genau der Struktur, die von den JSON-Daten vorgegeben wird:  
- altitude
: 
416.66524936621  
- daynum
: 
2460295.8288657  
- footprint
: 
4490.4586852502  
- id
: 
25544  
- latitude
: 
25.812254803638  
- longitude
: 
94.92145927701  
- name
: 
"iss"  
- solar_lat
: 
-23.347875554415  
- solar_lon
: 
60.580360454248  
- timestamp
: 
1702799614  
- units
: 
"kilometers"  
- velocity
: 
27592.352341487  
- visibility
: 
"daylight"  
        
[Gesamter Quellcode](ISS01.txt)  
[Beispielsdatei](ISS01.html)  
[zurück](../index.html)

