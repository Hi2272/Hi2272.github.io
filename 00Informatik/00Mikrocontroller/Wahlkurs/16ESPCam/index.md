# ESPCam

[Anschließen eines Servos](02Servo.html)
[Objekterkennung mit EdgeImpulse](03EdgeImpulse.html)

## Allgemeines
Das ESPCam-Modul besteht aus einer winzigen Kamera (Vorderseite) und einem ESP32 (Rückseite).  
Dem Modul fehlt der USB-Anschluss. Daher kann er nicht direkt an den Computer zum Programmieren angeschlossen werden.  

## Anschluss an den Rechner
### ESP32Cam-MB
Das Modul kann auf dieses Modul aufgesteckt und direkt an den Rechner angeschlossen werden: [ESP32 Cam-MB](https://www.berrybase.de/en/esp32-cam-mb-usb-to-serial-interface-for-esp32-cam?srsltid=AfmBOoo2_zXrAcEurUu3ynlBjHiJlrHmuEOPiQ8vfa4VtswALVWoFEel)
### FT232-Modul
Alternativ kann das Modul über ein FT232-Modul programmiert werden. [FT232-Modul](https://www.jf-elektronik.de/esp32-cam-einrichten/)

## Vorbereiten der Arduino-IDE
### ESP32 einbinden
[ESP32 einbinden](../05ESP32/01Install/index.html)  
### ESP32Cam als Board auswählen
1. Schließe den ESP32 über USB an den Rechner an und versetze ihn in den Boot-Modus (s.o.).
2. Wähle im BoardManager das Board **AI Thinker ESP32-CAM**

## Programmieren der Kamera
### Blink-Sketch
Die Blitzlicht-LED ist an Pin4 angeschlossen. Mit diesem Sketch können wir das Board testen:

```C++
const int ledPin = 4;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}
```

### Beispiel-Sketch
Unter Examples.ESP32.Camera.CameraWebServer kannst du ein Programm öffnen, mit dem die ESP32Cam zu einem Webserver wird. das Kamerabild kann über einen Webbrowser aufgerufen werden.   
Der Sketch muss an folgenden Stellen noch angepasst werden:

#### CameraWebServer.ino
In Zeile 12 und 13 müssen die Daten deines Wlans eingetragen werden. Achte darauf, dass du diese Daten niemals an andere Personen weitergibst.
#### board_config.h
Im Bereich **Select Camera model** müssen alle Zeilen  außer **#define CAMERA_MODEL_AI_THINKER // Has PSRAM** auskommentiert werden.

- Nach dem Hochladen des Sketches musst du den **SerialMonitor** öffnen und den Reset-Button des Moduls drücken.  
- Wenn hier unlesbare Zeichen erscheinen, musst du die **Baudrate** auf **115200** einstellen.
- Der Fehler **E (40) camera: Detected camera not supported.** tritt auf, wenn du in **board_config.h** das falsche Kamera-Modell eingestellt hast (s.o.).
- Wenn alles funktioniert, verbindet sich die ESP32-Cam mit deinem Wlan und gibt eine IP-Adresse aus: **-> Camera Ready! Use 'http://xxx.xxx.xxx.xxx' to connect**.  
Starte einen Webbrowser am Computer und kopiere diese IP-Adresse in die Adress-Zeile.  
Mit **Start Stream** kannst du das Video-Bild im Browser anzeigen lassen.

### Bibliothek AViShaESPCam

1. Suche im Bibliotheksmanager die **AViShaESPCam**-Bibliothek und installiere diese.
2. Öffne in Files.Examples.AviShaESPCam die Datei Simple_Video_Web_Streaming
3. Trage in den Code deine WLan-Zugangsdaten ein.
4. Lade den Sketch auf das Modul hoch.
5. Kopiere die IP-Adresse des Moduls aus dem Seriellen Monitor und füge sie in die Adresszeile des Browsers ein.

Der Code ist deutlich kürzer als der Beispiel-Sketch von oben:

```C++
#include <WiFi.h>
#include <WebServer.h>
#include <AViShaESPCam.h>

const char* ssid = "YOUSSID";
const char* password = "YourPassword";

WebServer server(80);
AViShaESPCam cam;

void setup() {
  Serial.begin(115200);

  // Initialize camera
  cam.enableLogging(true);
  cam.init(AI_THINKER(), QVGA);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  Serial.print("Camera Stream IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, []() {
    WiFiClient client = server.client();
    String response = "HTTP/1.1 200 OK\r\n";
    response += "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
    client.print(response);
    while (client.connected()) {
      FrameBuffer* frame = cam.capture();
      if (frame) {
        client.print("--frame\r\n");
        client.print("Content-Type: image/jpeg\r\n\r\n");
        client.write(frame->buf, frame->len);
        client.print("\r\n");
        cam.returnFrame(frame);
      }
      delay(1);
    }
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
```



