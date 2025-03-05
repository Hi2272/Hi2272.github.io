<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# ESPNow
## Allgemeines
ESP Now ermöglicht das Versenden von kurzen Nachrichten (max. 250 Bytes) zwischen ESP32-Boards. Hierzu ist kein externes WLan-Netz nötig - die Boards bauen selbst ein Netzwerk auf.

## Auslesen der MAC-Adressen
Um zwei ESP32 zu verbinden benötigen wir die **MAC-Adresse** der beiden Controller. Jedes Gerät, das in einem Netzwerk eingebunden werden kann, hat eine eindeutige MAC-Adresse.  
Diese Adresse können wir mit diesem Sketch auslesen:  
```C++

void setup(){
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.STA.begin();

  Serial.print("MAC Adresse des ESP32: ");
  uint8_t baseMac[6];
  esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
  if (ret == ESP_OK) {
    Serial.printf("%02x:%02x:%02x:%02x:%02x:%02x\n",
                  baseMac[0], baseMac[1], baseMac[2],
                  baseMac[3], baseMac[4], baseMac[5]);
  } else {
    Serial.println("MAC Adresse konnte nicht gelesen werden.");
  }

}

void loop(){
}
```
## Senden der Daten von einem ESP zum anderen
### Callback-Funktionen
Das Senden von Daten läuft über eine sogenannte **Callback-Funktion**. Dies wird automatisch aufgerufen, wenn eine Nachricht gesendet wurde.
In unserem Sketch heißt diese Funktion **datenGesendet**.   
Im der **setup**-Methode wird sie mit **esp_now_register_send_cb(datenGesendet);** als Callback-Funktion für das Senden registriert.  

### Sender-Sketch
Spiele auf den Sender diesen Sketch auf:
```c++
#include <esp_now.h>  // Einbinden der ESP-NOW-Bibliothek
#include <WiFi.h>     // Einbinden der WiFi-Bibliothek

// Hier musst du die MAC-Adresse des Empfängers
uint8_t empfaengerMAC[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

int nr=0;  // Zahl, die gesendet werden soll

esp_now_peer_info_t peerInfo;  // Struktur für Peer-Informationen

// Callback-Funktion, die aufgerufen wird, wenn Daten gesendet werden
void datenGesendet(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLetzter Paket-Sendestatus:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Lieferung erfolgreich" : "Lieferung fehlgeschlagen");
}

void setup() {
  Serial.begin(115200);  // Start der seriellen Kommunikation mit 115200 Baud

  WiFi.mode(WIFI_STA);  // Setzen des WiFi-Modus auf Station, d.h. der ESP wirkt als Client im Netzwerk

  // Initialisieren von ESP-NOW und Überprüfen auf Fehler
  if (esp_now_init() != ESP_OK) {
    Serial.println("Fehler bei der Initialisierung von ESP-NOW");
    return;  // Hier bricht die Ausführung ab.
  }

  // Registrieren der Callback-Funktion für gesendete Daten
  esp_now_register_send_cb(datenGesendet);
  
  // Kopieren der Empfänger-Adresse in die Peer-Info
  memcpy(peerInfo.peer_addr, empfaengerMAC, 6);
  peerInfo.channel = 0;  // Festlegen des Kanals (0 bedeutet, dass der aktuell eingestellte Kanal verwendet wird)
  peerInfo.encrypt = false;  // Keine Verschlüsselung verwenden
  
  // Hinzufügen des Peers zur ESP-NOW-Liste und Überprüfen auf Fehler
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Fehler beim Hinzufügen des Peers");
    return;
  }
}

void loop() {
  // Setzen der Werte, die gesendet werden sollen
  nr++;
  // Senden der Nachricht über ESP-NOW
  esp_err_t ergebnis = esp_now_send(empfaengerMAC, (uint8_t *) &nr, sizeof(nr));
   
  // Überprüfen, ob das Senden erfolgreich war und entsprechende Meldung ausgeben
  if (ergebnis == ESP_OK) {
    Serial.println(String(nr)+" gesendet!");
  }
  else {
    Serial.println("Fehler beim Senden von "+String(nr));
  }
  
  delay(2000);  // Verzögerung von 2 Sekunden vor dem nächsten Senden
}
```
### Empfangen von Daten
Auch beim Empfangen von Daten wird eine Callback-Funktion aufgerufen.  
Wir verwenden die Funktion **datenEmpfangen** und registrieren sie mit **esp_now_register_recv_cb(esp_now_recv_cb_t(datenEmpfangen));** als Callback-Funktion, die beim Empfangen (engl. **rec**ei**v**e) von Daten ausgelöst wird. 

```C++
#include <esp_now.h>
#include <WiFi.h>

int empfangeneZahl;  // Variable zum Speichern des empfangenen Ganzzahlwerts

// Callback-Funktion, die bei Empfang von Daten aufgerufen wird
void datenEmpfangen(const uint8_t * mac, const uint8_t *eingehendeDaten, int len) {
  // Überprüfen, ob die Länge der empfangenen Daten der Größe von empfangeneZahl entspricht
  if (len == sizeof(empfangeneZahl)) {  
    memcpy(&empfangeneZahl, eingehendeDaten, sizeof(empfangeneZahl));  // Kopiere die empfangenen Daten in die Variable
    Serial.print("Bytes empfangen: ");  // Ausgabe der Anzahl empfangener Bytes
    Serial.println(len);
    Serial.print("Empfangene Int-Zahl: ");  // Ausgabe der empfangenen Ganzzahl
    Serial.println(empfangeneZahl);
    Serial.println();
  } else {
    Serial.println("Fehler: Falsche Datenlänge empfangen");  // Fehlermeldung bei falscher Datenlänge
  }
}
 
void setup() {
  Serial.begin(115200);  // Start der seriellen Kommunikation mit 115200 Baud
  WiFi.mode(WIFI_STA);  // Setzen des WiFi-Modus auf Station

  // Initialisieren von ESP-NOW und Überprüfen auf Fehler
  if (esp_now_init() != ESP_OK) {
    Serial.println("Fehler bei der Initialisierung von ESP-NOW");
    return;
  }
  
  // Registrieren der Callback-Funktion für empfangene Daten
  esp_now_register_recv_cb(esp_now_recv_cb_t(datenEmpfangen));
}
 
void loop() {
  // Hier ist kein Code nötig, da die Datenverarbeitung in der Callback-Funktion erfolgt. 
}
```

[zurück](../index.html)
