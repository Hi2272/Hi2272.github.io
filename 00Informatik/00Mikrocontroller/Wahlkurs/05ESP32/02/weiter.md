   <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# ESP32 als Websever
## 1. HTML Code
Kopiere folgende Codezeilen in dein Programm:  

```C++
String htmlText() {
  String txt;
  txt = "<!DOCTYPE html><html><head><title>ESP32</title>";
  txt=txt+"<style>body{text-align:center;}button{margin:10px;padding:10px}</style>";
  txt=txt+"</head><body>";
  txt = txt + "<h1>ESP</h1>";
  
  
  txt = txt + "</body></html>";
  Serial.println(txt);
  return txt;
}
```
### Erläuterungen zum Code
Der ESP32 stellt als Webserver eine HTML-Seite dar.  
Die Funktion **htmlText** erzeugt den HTML-Code, der auf dieser Seite angezeigt wird.  
Bisher besteht diese Seite nur aus einer Überschrift.  
## 2. Webseite anzeigen
### Die Methode startSeite()
Erstelle eine Methode **startSeite()** mit der der HTML-Code angezeigt wird:
```C++
void startSeite() {
    server.send(200, "text/html", htmlText());
}
```
Der Server sendet zwei Dinge:
1. Der HTML-Code 200 bedeutet, dass die Seite problemlos gefunden wurde. (404 wäre der entsprechende Fehlercode)
2. Der HTML-Text , den du in der Methode **htmlText()** aufgebaut hast.
### Warten auf Anfragen des Kunden (Clients)
Füge in der **loop()**-Methode folgende Zeile ein:
```C++
     server.handleClient();
```
Der Server verarbeitet jetzt Anfragen von Clients, wie zum Beispiel dem Internetbrowser, mit dem du die Seite aufrufst.
### Reaktion auf Anfragen des Clients
Füge in der **setup**-Methode folgende Anweisung vor der server.begin();-Zeile ein:
```C++
  server.on("/", startSeite);
```
Wenn die IP-Adresse des ESP ohne weitere Zusätze vom Browser aufgerufen wird, startet der ESP jetzt die Methode **startSeite**. Er stellt unsere Webseite dar.

### Testen der Seite
Starte einen Internetbrowser und tippe in die Adresszeile die IP-Adresse ein, die den ESP bei der Anmeldung erhalten hat.
Der Browser müsste jetzt eine Seite darstellen, auf der nur die Überschrift ESP steht.
## 3. Interaktive Webseiten
Füge nach der Zeile 
```C++
*txt = txt + "<h1>ESP</h1>";
```
 folgende Zeilen in die **htmlText**-Methode ein:
```C++
    txt = txt + "<a href=\"/an\">";
    txt = txt + "<button>LED an</button>";
    txt = txt + "</a>";
    txt = txt + "<a href=\"/aus\">";
    txt = txt + "<button>LED aus</button>";
    txt = txt + "</a>";
```
Wenn du die IP-Adresse des ESP jetzt im Browser aufrufst, werden zwei Buttons mit den Beschriftungen **LED an** und **LED aus** dargestellt.  
Beim Klicken werden die Unterseiten **/an** bzw. **/aus** augerufen.  
Jetzt musst du nur den ESP auf diese Unterseiten reagieren lassen.  
Füge hierzu folgende Zeilen in die **setup()**-Methode ein:  
```C++
  server.on("/an", ledAn);
  server.on("/aus", ledAus);
```
Wenn die IP-Adresse des ESP mit dem Zusatz **/an** aufgerufen wird, startet der ESP die Methode LEDAn, die wir noch programmieren müssen. Der Zusatz **/aus** soll die entsprechende Methode ledAus starten.
### LED anschließen und ansteuern.

1. Schließe auf dem Breadboard eine rote LED mit Widerstand an den Port 22 des ESP32 an.
2. Definiere diesen Port in der **setup()**-Methode als **OUTPUT**
3. Erstelle eine Methode **ledAn()**, die den Port 22 HIGH schaltet.
4. Erstelle eine Methode **ledAus()**, die den Port 22 LOW schaltet.
5. Teste dein Programm - die LED müsste jetzt über den Browser geschaltet werden können.



[Lösung](loesung.html)  

[zurück](../index.html)   