 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# WLan Startseite
## Grundfunktionen

Der ESP32 soll ein eigenes WLan aufbauen, das keine Verbindung zum Internet hat. Beim Anmelden in diesem WLan soll der Nutzer automatisch auf eine HTML-Seite geleitet werden, die der ESP32 bereitstellt. Von dieser Seite aus soll der ESP32 über Textfelder oder Buttons gesteuert werden können.

## Funktionsprinzip
Der ESP32 funktioniert als Access Point (Zugriffspunkt) für sein eigenes WLan. Der Name (SSID) und das Passwort für dieses WLan wird im Programmcode festgelegt.  
Außerdem läuft auf dem ESP32 ein Webserver, der eine HTML-Seite bereit stellt. Auch der HTML-Code dieser Seite wird im Programmcode festgelegt. Die Buttons werden über Javascript-Funktionen im Code abgefragt.  
Als drittes muss auf dem ESP32 ein DNS-Server laufen. Ein DNS-Server wandelt eine eingegebene Internetadresse (google.de) in die passende IP-Adresse (172.217.30.9) um. In unserem Fall müssen **alle eingegebene Internetadressen** auf die Startadresse des ESP32 (**192.168.4.1**) umgewandelt werden. Damit wird beim Öffnen eines Webbrowsers immer und ausschließlich die Startseite unseres Systems aufgerufen. Diese Technik heißt **Captive Portal**-Technik. Sie wird häufig bei öffentlichen WLan-Netzen wie unserem Schulnetz verwendet, um den Nutzer auf eine Anmeldeseite umzuleiten.

## Code

```C++
// Wifi-Bibliotheken
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>


// WiFi Access Point Konfiguration
const char *ssid = "Diskoleuchte";      // Name des Access Points
const char *password = "12345678";    // Passwort des Access Points

// Webserver und DNS-Einrichtungen
WebServer server(80);
// DNS Server für Captive Portal Funktionalität
DNSServer dnsServer;
const byte DNS_PORT = 53;

// Helligkeitswert, der über Buttons verändert werden kann
int brightness=100;

// --- HTTP Handler Funktionen ---

/**
 * @brief Generiert und sendet die Haupt-HTML-Seite (Webinterface) an den Client.
 * \n fügt einen Zeilenumbruch (new Line) in den Code ein
 */
void handleRoot()
{
    String html = "";
    html += "<!DOCTYPE html>\n";
    html += "<html>\n";
    html += "<head>\n";
    html += "  <meta charset=\"utf-8\">\n";
    html += "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n";
    html += "  <title>Diskoleuchte</title>\n";
    html += "  <style>\n";
    html += "    body { font-family: Arial, Helvetica, sans-serif; text-align: center; padding: 2rem; background: #111; color: #0ff; margin: 0; }\n";
    html += "    h1 { font-size: 3rem; color: #ff0; margin: 1rem 0; text-shadow: 0 0 8px #f0f; }\n";
    html += "    p { color: #afa; }\n";
    html += "    .box { padding: 1rem; border-radius: 8px; display: inline-block; background: rgba(255,255,255,0.03); }\n";
    html += "    input { font-size: 1rem; padding: .5rem; border-radius: 4px; border: 1px solid #444; }\n";
    html += "    button { font-size: 1rem; padding: .5rem 1rem; border-radius: 4px; margin-left: .5rem; }\n";
    html += "  </style>\n";
    html += "</head>\n";
    html += "<body>\n";
    html += "  <div class=\"box\">\n";
    html += "    <h1>Diskoleuchte</h1>\n";
    html += "    <p>ESP32 Accesspoint</p>\n";
    html += "  </div>\n";
    html += "  <div style=\"margin-top:1rem;\">\n";
    html += "    <input type=\"text\" id=\"userText\" placeholder=\"Text eingeben\" style=\"width:60%;\">\n";
    html += "    <button onclick=\"sendText()\">Sende Text</button>\n";
    html += "    <hr>\n";
    html += "    <button onclick=\"sendHeller()\">Heller</button>\n";
    html += "    <button onclick=\"sendDunkler()\">Dunkler</button>\n";
    html += "  </div>\n";
    html += "  <script>\n";
    html += "    function sendText(){\n";
    html += "      var v = document.getElementById('userText').value;\n";
    html += "      fetch('/send?text='+encodeURIComponent(v))\n";
    html += "        .then(function(resp){ return resp.text(); })\n";
    html += "        .then(function(txt){ alert(txt); })\n";
    html += "        .catch(function(err){ alert('Fehler beim Senden'); });\n";
    html += "    }\n";
    html += "    function sendHeller(){\n";
    html += "      fetch('/cmd?name=heller')\n";
    html += "        .then(function(resp){ return resp.text(); })\n";
    html += "        .then(function(txt){ alert(txt); })\n";
    html += "        .catch(function(err){ alert('Fehler beim Senden'); });\n";
    html += "    }\n";
    html += "    function sendDunkler(){\n";
    html += "      fetch('/cmd?name=dunkler')\n";
    html += "        .then(function(resp){ return resp.text(); })\n";
    html += "        .then(function(txt){ alert(txt); })\n";
    html += "        .catch(function(err){ alert('Fehler beim Senden'); });\n";
    html += "    }\n";
    html += "  </script>\n";
    html += "</body>\n";
    html += "</html>\n";

    server.send(200, "text/html", html);
}

/**
 * @brief Handler für den "/send" Endpunkt.
 *
 * Empfängt Text über den 'text'-Parameter 
 */
void handleSend()
{
    String text = server.arg("text");
    Serial.print("Empfangen: ");
    Serial.println(text);
    server.send(200, "text/plain", "Empfangen: " + text);

    // Hier soll der Text weiter bearbeitet werden
}

/**
 * @brief Handler für den "/cmd" Endpunkt.
 *
 * Empfängt Steuerbefehle (z.B. "heller", "dunkler") über den 'name'-Parameter
 */
void handleCmd()
{
    String cmd = server.arg("name");
    Serial.print("CMD empfangen: ");
    Serial.println(cmd);

    if (cmd == "heller") {
        if (brightness < 255) brightness++;
    } else if (cmd == "dunkler") {
        if (brightness > 0) brightness--;
    }

     server.send(200, "text/plain", "Empfangen: " + cmd + " brightness=" + String(brightness));

     // Hier muss die Helligkeit weiter verarbeitet werden.
}

/**
 * @brief Initialisierung des Systems.
 *
 * Startet die serielle Kommunikation, initialisiert die LED-Matrix, konfiguriert
 * den WiFi Access Point und startet den Webserver sowie den DNS-Dienst.
 */
void setup()
{
    Serial.begin(115200);
    delay(500);
    Serial.println();
    Serial.println("Starte Diskoleuchte AP...");

    
    // Startet den WiFi Access Point
    bool ok = WiFi.softAP(ssid, password);
    if (!ok)
    {
        Serial.println("Fehler beim Starten des softAP mit Passwort.");
    }
    else
    {
        Serial.println("softAP mit WPA2 Passwort gestartet.");
    }

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP Adresse: ");
    Serial.println(IP);

    // Startet den DNS-Server, um alle Hostnamen abzufangen und auf die AP IP umzuleiten (Captive Portal)
    dnsServer.start(DNS_PORT, "*", IP);

    // Registriert die Handler für die Webserver-Endpunkte
    server.on("/", HTTP_GET, handleRoot);
    server.on("/send", HTTP_GET, handleSend);
    server.on("/cmd", HTTP_GET, handleCmd);
    // Leitet jede unbekannte Anfrage zur Root-Seite um (hilft beim Auto-Öffnen/Captive Portal)
    server.onNotFound([]() {
        String redirect = String("http://") + WiFi.softAPIP().toString();
        server.sendHeader("Location", redirect, true);
        server.send(302, "text/plain", "");
    });
    server.begin();
    Serial.println("HTTP Server gestartet, hört auf Port 80");
}

/**
 * @brief Hauptprogrammschleife.
 *
 * Verarbeitet kontinuierlich Webserver- und DNS-Anfragen.
 * Führt den Visualizer-Schritt aus, wenn gerade kein Text gescrollt wird.
 */
void loop()
{
    // Verarbeitet DNS-Anfragen des Captive Portals
    dnsServer.processNextRequest();
    // Verarbeitet HTTP-Anfragen
    server.handleClient();
    // Kurze Pause, um das System nicht komplett auszulasten
    delay(1);
}
```

Der ESP32 baut eine HTML-Seite mit diesem Code auf:
```HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Diskoleuchte</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; text-align: center; padding: 2rem; background: #111; color: #0ff; margin: 0; }
    h1 { font-size: 3rem; color: #ff0; margin: 1rem 0; text-shadow: 0 0 8px #f0f; }
    p { color: #afa; }
    .box { padding: 1rem; border-radius: 8px; display: inline-block; background: rgba(255,255,255,0.03); }
    input { font-size: 1rem; padding: .5rem; border-radius: 4px; border: 1px solid #444; }
    button { font-size: 1rem; padding: .5rem 1rem; border-radius: 4px; margin-left: .5rem; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Diskoleuchte</h1>
    <p>ESP32 Accesspoint</p>
  </div>
  <div style="margin-top:1rem;">
    <input type="text" id="userText" placeholder="Text eingeben" style="width:60%;">
    <button onclick="sendText()">Sende Text</button>
    <hr>
    <button onclick="sendHeller()">Heller</button>
    <button onclick="sendDunkler()">Dunkler</button>
  </div>
  <script>
    function sendText(){
      var v = document.getElementById('userText').value;
      fetch('/send?text='+encodeURIComponent(v))
        .then(function(resp){ return resp.text(); })
        .then(function(txt){ alert(txt); })
        .catch(function(err){ alert('Fehler beim Senden'); });
    }
    function sendHeller(){
      fetch('/cmd?name=heller')
        .then(function(resp){ return resp.text(); })
        .then(function(txt){ alert(txt); })
        .catch(function(err){ alert('Fehler beim Senden'); });
    }
    function sendDunkler(){
      fetch('/cmd?name=dunkler')
        .then(function(resp){ return resp.text(); })
        .then(function(txt){ alert(txt); })
        .catch(function(err){ alert('Fehler beim Senden'); });
    }
  </script>
</body>
</html>
```






[zurück](../index.html)


