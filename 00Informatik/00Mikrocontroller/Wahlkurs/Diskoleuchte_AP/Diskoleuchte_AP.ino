/**
 * @file Diskoleuchte_AP.ino
 * @brief Implementierung eines Access Points und Webservers für die Steuerung
 *        einer LED-Matrix (Diskoleuchte) auf einem ESP32-C6.
 */

    // Wifi-Bibliotheken
    #include <WiFi.h>
    #include <WebServer.h>
    #include <DNSServer.h>

// Neopixel/Matrix Bibliotheken
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

// --- Hardware Konfiguration (Muss an die Verdrahtung angepasst werden) ---
#define MATRIX_PIN 4        // GPIO Pin, an dem die Matrix angeschlossen ist
#define MATRIX_WIDTH 64     // Breite der Matrix in Pixel
#define MATRIX_HEIGHT 8     // Höhe der Matrix in Pixel
// Flags: Ursprung oben links, Zeilen-Layout, Zick-Zack-Muster (typische Verdrahtung für viele Panels)
#define MATRIX_FLAGS (NEO_MATRIX_TOP + NEO_MATRIX_LEFT + NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG)
#define NEO_TYPE NEO_GRB + NEO_KHZ800
// -------------------------------------

// WiFi Access Point Konfiguration
const char *ssid = "Diskoleuchte";      // Name des Access Points
const char *password = "12345678";    // Passwort des Access Points

// Webserver und DNS-Einrichtungen
WebServer server(80);
// DNS Server für Captive Portal Funktionalität
DNSServer dnsServer;
const byte DNS_PORT = 53;

// NeoMatrix Objekt
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(
    MATRIX_WIDTH, MATRIX_HEIGHT, MATRIX_PIN,
    MATRIX_FLAGS, NEO_TYPE);

// Globale Helligkeit (0-255)
uint8_t brightness = 100; // Standardwert

// Mikrofon-Pin
#define MIC_PIN 6

// Status-Flag: true, wenn gerade Text gescrollt wird (blockiert den Visualizer)
volatile bool isScrolling = false;

// Visualizer-Puffer: Speichert für jede Zeile die Anzahl der leuchtenden Pixel (0..MATRIX_WIDTH)
int visBuffer[MATRIX_HEIGHT] = {0};

// Visualizer Einstellungen
uint16_t visColor = matrix.Color(0, 160, 255); // Farbe der Visualizer-Balken
unsigned long lastVisMillis = 0;
const unsigned long visInterval = 80; // Intervall in ms zwischen Visualizer-Schritten

/**
 * @brief Scrollt einen gegebenen Text einmal über die LED-Matrix.
 *
 * Diese Funktion blockiert, um den gesamten Scrollvorgang abzuschließen.
 * Während des Scrollens werden Webserver-Anfragen verarbeitet, um das System
 * reaktionsfähig zu halten.
 *
 * @param text Der zu scrollende Text.
 * @param color Die Farbe des Textes (Standard: Weiß).
 * @param delayMs Die Verzögerung in Millisekunden zwischen den einzelnen Scroll-Schritten.
 */
void scrollTextOnce(const String &text, uint16_t color = matrix.Color(255, 255, 255), uint16_t delayMs = 40) {
    if (text.length() == 0) return;

    isScrolling = true; // Blockiert den Visualizer
    matrix.setTextWrap(false); // Kein Zeilenumbruch
    matrix.setFont(); // Standard-Schriftart (Adafruit 5x7)
    matrix.setTextColor(color);

    int16_t x1, y1;
    uint16_t w, h;
    // Ermittelt die Textgrenzen
    String t = text;
    matrix.getTextBounds(t.c_str(), 0, 0, &x1, &y1, &w, &h);

    int16_t startX = matrix.width();
    int16_t endX = -((int16_t)w); // Bewegung bis der Text komplett links aus dem Display ist

    for (int16_t x = startX; x >= endX; x--) {
        matrix.fillScreen(0);
        // Vertikale Zentrierung für die 8px hohe Matrix
        matrix.setCursor(x, (matrix.height() - 8) / 2);
        matrix.print(t);
        matrix.show();
        delay(delayMs);
        // Verarbeitet Clients während des Scrollens, um den Webserver reaktionsfähig zu halten
        dnsServer.processNextRequest();
        server.handleClient();
    }

    isScrolling = false; // Visualizer kann wieder laufen
}

/**
 * @brief Liest die aktuelle Lautstärke vom Mikrofon-Pin und gibt die entsprechende
 *        Balkenlänge (in Pixeln) zurück.
 *
 * Die Funktion führt eine einfache RMS/Peak-Approximation über eine kurze Sample-Periode
 * durch und mappt das Ergebnis auf den Bereich 0 bis MATRIX_WIDTH.
 *
 * @return Die berechnete Lautstärke als Anzahl leuchtender Pixel (0 bis MATRIX_WIDTH).
 */
int readMicLevelPixels() {
    const int samples = 150;
    long sum = 0;
    int v;
    for (int i = 0; i < samples; i++) {
        v = analogRead(MIC_PIN);
        // ESP32 analogRead: 0..4095, Mitte ~2048
        sum += abs(v - 2048);
    }
    int avg = sum / samples; // Durchschnittswert
    // Mappe den Messwert (0 bis max. erwarteter Wert) auf 0..MATRIX_WIDTH
    int level = map(constrain(avg, 0, 2500), 0, 2500, 0, MATRIX_WIDTH);
    return level;
}

/**
 * @brief Führt einen Schritt des Audio-Visualizers aus.
 *
 * Liest die aktuelle Lautstärke, verschiebt den Visualizer-Puffer nach unten (Scroll-Effekt)
 * und zeichnet den neuen Puffer auf der Matrix.
 */
void visualizerStep() {
    // Lese Lautstärke und bestimme Anzahl Pixel in der neuen obersten Zeile
    int newLevel = readMicLevelPixels();

    // Verschiebt den Puffer nach unten (y nimmt zu), die letzte Zeile fällt heraus
    for (int y = MATRIX_HEIGHT - 1; y > 0; y--) {
        visBuffer[y] = visBuffer[y - 1];
    }
    // Fügt den neuen Wert in die oberste Zeile ein
    visBuffer[0] = newLevel;

    // Zeichne Puffer: Für jede Zeile werden N Pixel von links eingeschaltet
    matrix.fillScreen(0);
    for (int y = 0; y < MATRIX_HEIGHT; y++) {
        int n = visBuffer[y];
        if (n > 0) {
            for (int x = 0; x < n; x++) {
                matrix.drawPixel(x, y, visColor);
            }
        }
    }
    matrix.show();
}

// --- HTTP Handler Funktionen ---

/**
 * @brief Generiert und sendet die Haupt-HTML-Seite (Webinterface) an den Client.
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
    html += "    <h1>Helges Diskoleuchte</h1>\n";
    html += "    <p>2025 Familie Hille</p>\n";
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
 * Empfängt Text über den 'text'-Parameter und startet den Scrollvorgang.
 */
void handleSend()
{
    String text = server.arg("text");
    Serial.print("Empfangen: ");
    Serial.println(text);
    server.send(200, "text/plain", "Empfangen: " + text);

    // Scrollt den Text einmal über die Matrix (blockierend, ruft aber server.handleClient() intern auf)
    scrollTextOnce(text);
}

/**
 * @brief Handler für den "/cmd" Endpunkt.
 *
 * Empfängt Steuerbefehle (z.B. "heller", "dunkler") über den 'name'-Parameter
 * und passt die globale Helligkeit der Matrix an.
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

    // Setzt die neue Helligkeit
    matrix.setBrightness(brightness);
    matrix.show();

    server.send(200, "text/plain", "Empfangen: " + cmd + " brightness=" + String(brightness));
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

        // Initialisiert die Matrix
        matrix.begin();
        matrix.setBrightness(brightness);
        matrix.fillScreen(0);
        matrix.show();

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

        // Wenn kein Text gescrollt wird, läuft der Visualizer
        if (!isScrolling) {
            unsigned long now = millis();
            // Zeitintervall prüfen, um die Aktualisierungsrate zu steuern
            if (now - lastVisMillis >= visInterval) {
                lastVisMillis = now;
                visualizerStep();
            }
        }

        // Kurze Pause, um das System nicht komplett auszulasten
        delay(1);
    }
