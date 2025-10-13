   <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

## Steuerung einer LED über das WLAN

```C++
#include <WebServer.h>

// Achtung: Mit der SSID und dem Passwort kann jeder auf dein WLAN zugreifen.
// Du darfst daher nie diesen Code mit deinem Passwort an andere Personen weitergeben!
// ****************************************************************
const char* ssid = "Name des Netzwerks";            // SSID (= Name) des WLANs
const char* password = "geheimes Passwort";  // geheimes Passwort des WLANs
// ****************************************************************
const int httpPort = 80;  // This should not be changed

WebServer server(httpPort);  // Der ESP32 soll eine Internetseite als Server bereitstellen.


void startSeite() {
  server.send(200, "text/html", htmlText());
}

String htmlText() {
  String txt;
  txt = "<!DOCTYPE html><html><head><title>ESP32</title>";
  txt = txt + "<style>body{text-align:center;}button{margin:10px;padding:10px}</style>";
  txt = txt + "</head><body>";
  txt = txt + "<h1>ESP</h1>";

  txt = txt + "<a href=\"/an\">";
  txt = txt + "<button>LED an</button>";
  txt = txt + "</a>";
  txt = txt + "<a href=\"/aus\">";
  txt = txt + "<button>LED aus</button>";
  txt = txt + "</a>";

  txt = txt + "</body></html>";
  Serial.println(txt);
  return txt;
}

void ledAn() {
  digitalWrite(22, HIGH);
  startSeite();
}

void ledAus() {
  digitalWrite(22, LOW);
  startSeite();
}

void setup() {
  pinMode(22, OUTPUT);
  Serial.begin(115200);
  Serial.print("Verbindung zu WLAN: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Verbindung aufgebaut");
  Serial.print("IP-Addresse des ESP32: ");
  Serial.println(WiFi.localIP());

  // HTML Befehle abarbeiten
  server.on("/", startSeite);
  server.on("/an", ledAn);
  server.on("/aus", ledAus);

  server.begin();
}


void loop() {
  server.handleClient();
}
```

[zurück](../../index.html)    