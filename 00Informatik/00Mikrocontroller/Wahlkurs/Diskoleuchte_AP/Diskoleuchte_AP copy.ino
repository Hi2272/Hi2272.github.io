/**
 * @file Diskoleuchte_AP.ino
 * @brief Implementierung eines Access Points und Webservers für die Steuerung
 *        einer LED-Matrix (Diskoleuchte) auf einem ESP32-C6.
 */

// Wifi-Bibliotheken
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>

// Neopixel/Matrix BibliothekenR,G,B und der Text Farbe2 mit drei Inputboxen R,G,B stehen. Anschließend soll ein Button mit dem Text Farbwechsel stehen. Beim Klicken auf diesen Button sollen die  Werte der 6 Boxen an den ESP32 gesendet werden. Der ESP32 soll dann in 1000ms von Farbe1 zu Farbe2 überblenden und in den folgenden 1000ms wieder zurück. Dies soll solange geschehen, bis ein neuer Befehl von der Homepage kommt.
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

// --- Hardware Konfiguration (Muss an die Verdrahtung angepasst werden) ---
#define MATRIX_PIN 4     // GPIO Pin, an dem die Matrix angeschlossen ist
#define MATRIX_WIDTH 32  // Breite der Matrix in Pixel
#define MATRIX_HEIGHT 8  // Höhe der Matrix in Pixel
// Flags: Ursprung oben links, Spalten-Layout, Zick-Zack-Muster (typische Verdrahtung für viele Panels)
#define MATRIX_FLAGS (NEO_MATRIX_TOP + NEO_MATRIX_LEFT + NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG)
#define NEO_TYPE NEO_GRB + NEO_KHZ800
// -------------------------------------

// WiFi Access Point Konfiguration
const char *ssid = "Diskoleuchte";  // Name des Access Points
const char *password = "12345678";  // Passwort des Access Points

// Webserver und DNS-Einrichtungen
WebServer server(80);
// DNS Server für Captive Portal Funktionalität
DNSServer dnsServer;
const byte DNS_PORT = 53;

// NeoMatrix Objekt
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(MATRIX_WIDTH, MATRIX_HEIGHT, MATRIX_PIN, MATRIX_FLAGS, NEO_TYPE);

// Globale Helligkeit (0-255)
uint8_t brightness = 40;  // Standardwert

// Farbwechsel-Modus: zwei Farben und Steuerungsvariablen
volatile bool colorModeActive = false;
uint8_t color1_r = 255, color1_g = 0, color1_b = 0;
uint8_t color2_r = 0, color2_g = 0, color2_b = 255;
unsigned long colorModeStart = 0;
const unsigned long phaseDuration = 1000;      // 1000 ms Vorwärts / 1000 ms Rückwärts
const unsigned long colorUpdateInterval = 30;  // Update-Intervall in ms
unsigned long lastColorUpdate = 0;

// Farben für Regenbogen-Modus
uint8_t FARBEN[][3] = {
  { 255, 0, 0 },    // Rot
  { 255, 127, 0 },  // Orange
  { 255, 255, 0 },  // Gelb
  { 0, 255, 0 },    // Grün
  { 0, 0, 255 },    // Blau
  { 75, 0, 130 },   // Indigo
  { 148, 0, 211 }   // Violett
};
const int FARBE_COUNT = sizeof(FARBEN) / sizeof(FARBEN[0]);

// Regenbogen-Modus
volatile bool rainbowActive = false;
unsigned long rainbowStart = 0;
int seqLen = 0;
int seq[32];  // ausreichend groß für 2*FARBE_COUNT-2
// Scroll-Position für Regenbogen (rechts->links) und Spaltenbreite pro Farbe
int rainbowPos = 0;
const int RAINBOW_COL_WIDTH = 4;  // Anzahl Pixel pro Farbstreifen (anpassbar)

// Status-Flag: true, wenn gerade Text gescrollt wird (blockiert den Farbmodus)
volatile bool isScrolling = false;
// Flag, das von anderen Handlern gesetzt wird, um das Scrollen vorzeitig zu beenden
volatile bool stopScrollRequested = false;

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
void scrollTextOnce(const String &text, uint16_t color = 0, uint16_t delayMs = 40) {
  if (text.length() == 0) return;

  isScrolling = true;         // Blockiert den Farbmodus/Regenbogen
  stopScrollRequested = false; // Reset any previous stop request
  matrix.setTextWrap(false);
  matrix.setFont(); // Standard-Schriftart (Adafruit 5x7)

  int16_t x1, y1;
  uint16_t fullW, fullH;
  String t = text;
  matrix.getTextBounds(t.c_str(), 0, 0, &x1, &y1, &fullW, &fullH);

  int16_t startX = matrix.width();       // Start rechts
  int16_t endX = -((int16_t)fullW);      // Ende links außerhalb des Displays

  for (int16_t baseX = startX; baseX >= endX; baseX--) {
    // Wenn ein Stop angefordert wurde, verlasse das Scrollen sofort
    if (stopScrollRequested) break;

    matrix.fillScreen(0);

    int16_t cursorX = baseX;
    // Zeichne jedes Zeichen einzeln in einer Regenbogenfarbe
    for (size_t i = 0; i < (size_t)t.length(); i++) {
      // Falls Stop während Zeichnen gesetzt wurde
      if (stopScrollRequested) break;

      char ch = t.charAt(i);
      char s[2] = { ch, '\0' };

      // Bestimme Breite des Zeichens
      int16_t bx, by;
      uint16_t bw, bh;
      matrix.getTextBounds(s, 0, 0, &bx, &by, &bw, &bh);

      // Wähle Farbe aus FARBEN zyklisch (jeder Buchstabe andere Farbe)
      int colIdx = (int)(i % FARBE_COUNT);
      uint16_t c = matrix.Color(FARBEN[colIdx][0], FARBEN[colIdx][1], FARBEN[colIdx][2]);
      matrix.setTextColor(c);

      // Vertikale Position: zentriert (für 5x7 Font ist Höhe ~8)
      int16_t y = (matrix.height() - 8) / 2;
      matrix.setCursor(cursorX, y);
      matrix.print(s);

      // Verschiebe Cursor um Zeichenbreite (Fallback 6 wenn bw==0)
      cursorX += (bw > 0 ? (int)bw : 6);
    }

    matrix.show();
    delay(delayMs);

    // Webserver/DNS weiter bedienen während Scrollen
    dnsServer.processNextRequest();
    server.handleClient();
  }

  // Falls Stop angefordert wurde, leave the flag set so callers know it was interrupted
  isScrolling = false;
}


// --- HTTP Handler Funktionen ---

/**
 * @brief Generiert und sendet die Haupt-HTML-Seite (Webinterface) an den Client.
 */
void handleRoot() {
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
  html += "    <label for='repeat' style='margin-left:8px;color:#afa;'>Wdh:</label>\n";
  html += "    <input id='repeat' type='number' min='1' max='99' value='1' style='width:60px;margin-left:6px;'>\n";
  html += "    <button onclick=\"sendText()\">Sende Text</button>\n";
  html += "    <hr>\n";

  // Farbsteuerung: Prozent-Eingaben 0..100
  html += "    <div style='margin-top:8px;'>\n";
  html += "      <div><strong>Farbe1 (Prozent):</strong> R <input id='r1' type='number' min='0' max='100' value='100' style='width:60px;'> ";
  html += "G <input id='g1' type='number' min='0' max='100' value='0' style='width:60px;'> ";
  html += "B <input id='b1' type='number' min='0' max='100' value='0' style='width:60px;'></div>\n";
  html += "      <div style='margin-top:6px;'><strong>Farbe2 (Prozent):</strong> R <input id='r2' type='number' min='0' max='100' value='0' style='width:60px;'> ";
  html += "G <input id='g2' type='number' min='0' max='100' value='0' style='width:60px;'> ";
  html += "B <input id='b2' type='number' min='0' max='100' value='100' style='width:60px;'></div>\n";
  html += "      <div style='margin-top:8px;'><button onclick='sendColor()'>Farbwechsel</button></div>\n";
  html += "    </div>\n";

  html += "    <hr>\n";

  // Helligkeits-Slider (0..100%)
  html += "    <div style='margin-top:8px;'>\n";
  html += "      <label for='brightnessSlider'><strong>Helligkeit:</strong></label>\n";
  html += "      <input id='brightnessSlider' type='range' min='0' max='100' value='" + String(round(brightness * 100.0 / 255.0)) + "' oninput='updateBrightnessLabel(this.value)' onchange='sendBrightness()' style='width:40%;'>\n";
  html += "      <span id='brightnessVal'>" + String(round(brightness * 100.0 / 255.0)) + "%</span>\n";
  html += "    </div>\n";

  html += "    <hr>\n";
  html += "    <label style='margin-right:8px;color:#afa;'><input id='micControl' type='checkbox' onchange='sendMicToggle(this.checked)'> Lautstärkeregulierung</label>\n";
  html += "    <button onclick=\"sendRainbow()\">Regenbogen</button>\n";
  // Status-Anzeige
  html += "    <div id='status' style='margin-top:10px;color:#afa;min-height:1.2em'></div>\n";
  html += "  </div>\n";
  
  // JavaScript: keine alerts mehr, Status-Element wird aktualisiert
  html += "  <script>\n";
  html += "    function updateStatus(txt){ document.getElementById('status').innerText = txt; }\n";
  html += "    function updateBrightnessLabel(v){ document.getElementById('brightnessVal').innerText = v + '%'; }\n";
  html += "    function sendText(){\n";
  html += "      var v = document.getElementById('userText').value;\n";
  html += "      var rep = document.getElementById('repeat').value || '1';\n";
  html += "      fetch('/send?text='+encodeURIComponent(v)+'&repeat='+encodeURIComponent(rep)).then(r=>r.text()).then(t=>updateStatus(t)).catch(e=>updateStatus('Fehler beim Senden'));\n";
  html += "    }\n";
  html += "    function sendColor(){\n";
  html += "      var r1 = Number(document.getElementById('r1').value)||0;\n";
  html += "      var g1 = Number(document.getElementById('g1').value)||0;\n";
  html += "      var b1 = Number(document.getElementById('b1').value)||0;\n";
  html += "      var r2 = Number(document.getElementById('r2').value)||0;\n";
  html += "      var g2 = Number(document.getElementById('g2').value)||0;\n";
  html += "      var b2 = Number(document.getElementById('b2').value)||0;\n";
  html += "      var url = '/color?r1='+r1+'&g1='+g1+'&b1='+b1+'&r2='+r2+'&g2='+g2+'&b2='+b2;\n";
  html += "      fetch(url).then(r=>r.text()).then(t=>updateStatus(t)).catch(e=>updateStatus('Fehler beim Senden'));\n";
  html += "    }\n";
  html += "    function sendBrightness(){ var v = document.getElementById('brightnessSlider').value; fetch('/brightness?val='+v).then(r=>r.text()).then(t=>updateStatus(t)).catch(e=>updateStatus('Fehler beim Senden')); }\n";
  html += "    function sendRainbow(){ fetch('/rainbow').then(r=>r.text()).then(t=>updateStatus(t)).catch(e=>updateStatus('Fehler beim Senden')); }\n";
  html += "    function sendMicToggle(on){ fetch('/mic?on=' + (on ? '1':'0')).then(r=>r.text()).then(t=>updateStatus(t)).catch(e=>updateStatus('Fehler beim Senden')); }\n";
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
void handleSend() {
  // Empfange Text-Parameter und bestätige Empfang dem Client
  String text = server.arg("text");
  text = normalizeUmlauts(text); // Umlaute umschreiben
  int repeat = constrain(server.arg("repeat").toInt(), 1, 99);
  Serial.print("Empfangen: ");
  Serial.println(text);
  server.send(200, "text/plain", "Empfangen: " + text + " (Wdh=" + String(repeat) + ")");

  // Aktuellen Modus merken, dann für das Scrollen pausieren
  bool prevRainbow = rainbowActive;
  bool prevColor = colorModeActive;
  int prevRainbowPos = rainbowPos;

  // Pause running modes
  rainbowActive = false;
  colorModeActive = false;

  // Ensure stop flag cleared before starting
  stopScrollRequested = false;

  // Scrollt den Text 'repeat' -mal über die Matrix (blockierend; server/DNS werden währenddessen bedient)
  for (int i = 0; i < repeat; i++) {
    // If another command requested stop before starting next repetition, break
    if (stopScrollRequested) break;
    scrollTextOnce(text);
    if (stopScrollRequested) break;
  }

  // Wenn das Scrollen von einer anderen Funktion unterbrochen wurde, wiederherstellung vermeiden:
  if (stopScrollRequested) {
    // clear stop flag but DON'T restore previous modes because the interrupting handler
    // (z.B. handleRainbow/handleColor) already set the desired mode.
    stopScrollRequested = false;
    return;
  }

  // Nach dem Scrollen vorherigen Modus wiederherstellen
  if (prevColor) {
    colorModeStart = millis();   // neu starten, damit Phase von vorn läuft
    lastColorUpdate = 0;
    colorModeActive = true;
  }
  if (prevRainbow) {
    rainbowStart = millis();
    lastColorUpdate = 0;
    rainbowPos = prevRainbowPos; // ggf. weitermachen an gleicher Position
    rainbowActive = true;
  }
}

/**
 * @brief Handler für den "/helligkeit" Endpunkt.
 *
 * passt die globale Helligkeit der Matrix an.
 */
void handleBrightness() {
  // Request to stop any ongoing scrolling
  stopScrollRequested = true;

  // Merke vorherigen Modus
  bool prevRainbow = rainbowActive;
  bool prevColor = colorModeActive;
  int prevRainbowPos = rainbowPos;

  // Pausiere aktive Modi während der Anpassung
  rainbowActive = false;
  colorModeActive = false;

  String sval = server.arg("val");
  int p = constrain(sval.toInt(), 0, 100);
  brightness = (uint8_t)round(p * 255.0 / 100.0);
  matrix.setBrightness(brightness);
  matrix.show();
  server.send(200, "text/plain", "Helligkeit gesetzt: " + String(p) + "% (" + String(brightness) + ")");

  // Vorherigen Modus wiederherstellen
  if (prevColor) {
    colorModeStart = millis();
    lastColorUpdate = 0;
    colorModeActive = true;
  }
  if (prevRainbow) {
    rainbowStart = millis();
    lastColorUpdate = 0;
    rainbowPos = prevRainbowPos;
    rainbowActive = true;
  }
}

// Anpassung: handleColor erwartet Prozentwerte 0..100 -> konvertiere zu 0..255
void handleColor() {
  // Request to stop any ongoing scrolling
  stopScrollRequested = true;

  rainbowActive = false;  // neuer Befehl stoppt Regenbogen
  int r1p = constrain(server.arg("r1").toInt(), 0, 100);
  int g1p = constrain(server.arg("g1").toInt(), 0, 100);
  int b1p = constrain(server.arg("b1").toInt(), 0, 100);
  int r2p = constrain(server.arg("r2").toInt(), 0, 100);
  int g2p = constrain(server.arg("g2").toInt(), 0, 100);
  int b2p = constrain(server.arg("b2").toInt(), 0, 100);

  color1_r = (uint8_t)round(r1p * 255.0 / 100.0);
  color1_g = (uint8_t)round(g1p * 255.0 / 100.0);
  color1_b = (uint8_t)round(b1p * 255.0 / 100.0);
  color2_r = (uint8_t)round(r2p * 255.0 / 100.0);
  color2_g = (uint8_t)round(g2p * 255.0 / 100.0);
  color2_b = (uint8_t)round(b2p * 255.0 / 100.0);

  colorModeStart = millis();
  lastColorUpdate = 0;
  colorModeActive = true;

  String resp = "Farbwechsel gestartet: [" + String(r1p) + "%," + String(g1p) + "%," + String(b1p) + "%] -> [" + String(r2p) + "%," + String(g2p) + "%," + String(b2p) + "%]";
  Serial.println(resp);
  server.send(200, "text/plain", resp);
}

// Neuer Handler: Regenbogen starten (schaltet anderen Farbmodus aus)
void handleRainbow() {
  // Request to stop any ongoing scrolling
  stopScrollRequested = true;

  // Aktiviere Regenbogenmodus
  rainbowActive = true;
  colorModeActive = false;
  colorModeStart = 0;
  rainbowStart = millis();
  lastColorUpdate = 0;
  // Erzeuge die Ping-Pong Sequenz: 0..n-1, n-2..1
  int idx = 0;
  for (int i = 0; i < FARBE_COUNT; i++) seq[idx++] = i;
  for (int i = FARBE_COUNT - 2; i >= 1; i--) seq[idx++] = i;
  seqLen = idx;

  String resp = "Regenbogen gestartet";
  Serial.println(resp);
  server.send(200, "text/plain", resp);
}

/**
    * @brief Initialisierung des Systems.
    *
    * Startet die serielle Kommunikation, initialisiert die LED-Matrix, konfiguriert
    * den WiFi Access Point und startet den Webserver sowie den DNS-Dienst.
    */
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println();
  Serial.println("Starte Diskoleuchte AP...");

  // Initialisiert die Matrix
  matrix.begin();
  matrix.setBrightness(brightness);
  matrix.fillScreen(0);
  matrix.show();

  // Starte direkt im Farbwechselmodus (Standard: Rot -> Blau)
  color1_r = 255;
  color1_g = 0;
  color1_b = 0;  // Rot
  color2_r = 0;
  color2_g = 0;
  color2_b = 255;  // Blau
  colorModeStart = millis();
  lastColorUpdate = 0;
  colorModeActive = true;

  // Startet den WiFi Access Point
  bool ok = WiFi.softAP(ssid, password);
  if (!ok) {
    Serial.println("Fehler beim Starten des softAP mit Passwort.");
  } else {
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
  server.on("/color", HTTP_GET, handleColor);
  server.on("/rainbow", HTTP_GET, handleRainbow);
  server.on("/brightness", HTTP_GET, handleBrightness);  // neu: Slider-Endpoint
  // Leitet jede unbekannte Anfrage zur Root-Seite um (hilft beim Auto-Öffnen/Captive Portal)
  server.onNotFound([]() {
    String redirect = String("http://") + WiFi.softAPIP().toString();
    server.sendHeader("Location", redirect, true);
    server.send(302, "text/plain", "");
  });
  server.begin();
  Serial.println("HTTP Server gestartet, hört auf Port 80");
  scrollTextOnce(normalizeUmlauts("Monsterparty!"));
}

/**
    * @brief Hauptprogrammschleife.
    *
    * Verarbeitet kontinuierlich Webserver- und DNS-Anfragen.
    * Führt den Visualizer-Schritt aus, wenn gerade kein Text gescrollt wird.
    */
void loop() {
  // Verarbeitet DNS-Anfragen des Captive Portals
  dnsServer.processNextRequest();
  // Verarbeitet HTTP-Anfragen
  server.handleClient();

  // Regenbogen-Modus: überblendet der Reihe nach zwischen FARBEN in Ping-Pong-Reihenfolge
  if (rainbowActive && !isScrolling) {
    unsigned long now = millis();
    if (now - lastColorUpdate >= colorUpdateInterval) {
      lastColorUpdate = now;
      // Scroll-Position vorwärts erhöhen -> optisch bewegt sich Muster von rechts nach links
      rainbowPos = (rainbowPos + 1) % (FARBE_COUNT * RAINBOW_COL_WIDTH);

      // Für jede Matrix-Spalte die passende Farbe bestimmen und zeichnen
      matrix.fillScreen(0);
      for (int x = 0; x < MATRIX_WIDTH; x++) {
        // Mapping: spaltenweise wiederholte Farben, mit Position-Offset für Scroll
        int idx = ((x + rainbowPos) / RAINBOW_COL_WIDTH) % FARBE_COUNT;
        uint8_t rr = FARBEN[idx][0];
        uint8_t gg = FARBEN[idx][1];
        uint8_t bb = FARBEN[idx][2];
        uint16_t col = matrix.Color(rr, gg, bb);
        for (int y = 0; y < MATRIX_HEIGHT; y++) {
          matrix.drawPixel(x, y, col);
        }
      }
      matrix.show();
    }
  } else if (colorModeActive && !isScrolling) {
    unsigned long now = millis();
    if (now - lastColorUpdate >= colorUpdateInterval) {
      lastColorUpdate = now;
      unsigned long elapsed = (now - colorModeStart) % (phaseDuration * 2);
      float t;
      if (elapsed < phaseDuration) {
        t = (float)elapsed / (float)phaseDuration;  // 0..1 Vorwärts
      } else {
        t = 1.0f - (float)(elapsed - phaseDuration) / (float)phaseDuration;  // 1..0 Rückwärts
      }
      // Interpoliere Farben
      uint8_t rr = lerp8(color1_r, color2_r, t);
      uint8_t gg = lerp8(color1_g, color2_g, t);
      uint8_t bb = lerp8(color1_b, color2_b, t);

      // Fülle Matrix mit interpolierter Farbe
      uint16_t col = matrix.Color(rr, gg, bb);
      matrix.fillScreen(col);
      matrix.show();
    }

    // Kurze Pause, um das System nicht komplett auszulasten
    delay(1);
  }
}

// Hilfsfunktion: lineare Interpolation zwischen zwei Werten
static inline uint8_t lerp8(uint8_t a, uint8_t b, float t) {
  return (uint8_t)round(a + (b - a) * t);
}

/**
 * Ersetzt deutsche Umlaute und ß durch Umschreibungen:
 * Ä/ä -> ae, Ö/ö -> oe, Ü/ü -> ue, ß -> ss
 */
String normalizeUmlauts(const String &s) {
  String t = s;
  // Großbuchstaben -> Groß + e
  t.replace("Ä", "Ae");
  t.replace("Ö", "Oe");
  t.replace("Ü", "Ue");
  // Kleinbuchstaben -> klein + e
  t.replace("ä", "ae");
  t.replace("ö", "oe");
  t.replace("ü", "ue");
  // scharfes s
  t.replace("ß", "ss");
  return t;
}
