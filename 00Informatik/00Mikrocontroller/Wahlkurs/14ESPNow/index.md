<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# ESPNow
## Allgemeines
ESP Now ermöglicht das Versenden von kurzen Nachrichten (max. 250 Bytes) zwischen ESP32-Boards. Hierzu ist kein externes WLan-Netz nötig - die Boards bauen selbst ein Netzwerk auf.

## Auslesen der MAC-Adressen
Um zwei ESP32 zu verbinden benötigen wir die **MAC-Adresse** der beiden Controller. Jedes Gerät, das in einem Netzwerk eingebunden werden kann, hat eine eindeutige MAC-Adresse.  
Diese Adresse können wir mit diesem Sketch auslesen:  
```C++
#include "WiFi.h"  // Einbinden der WiFi-Bibliothek für ESP32

void setup(){
    Serial.begin(115200);    // Serielle Schnittstelle mit 115200 Baud starten
    delay(1000);             // Kurze Wartezeit, damit der Serial Monitor Zeit zum Verbinden hat

    WiFi.mode(WIFI_STA);     // WLAN-Modus auf Station (Client) setzen (notwendig für ESP-NOW und MAC-Adresse)

    // Warten bis WiFi Station (WLAN-Interface) gestartet ist
    while (!(WiFi.STA.started())) { 
        delay(10);           // 10 ms warten und nochmal prüfen
    }

    Serial.print("MAC-Addresse: ");
    String mac = WiFi.macAddress();   // MAC-Adresse als String einlesen (Format: "XX:XX:XX:XX:XX:XX")
    Serial.println(mac);              // MAC-Adresse als String ausgeben

    Serial.print("Formatiert: ");
    Serial.print("{");
    
    int index = 0;
    // Schleife über 6 Teile (6 Bytes der MAC-Adresse)
    for(int i=0; i<6; i++){
        Serial.print("0x");                           // Hex-Zahlenformat angeben
        Serial.print(mac.substring(index, index+2)); // MAC-Byte als Hex-Paar aus String extrahieren (z.B. "24")
        if(i<5){
            Serial.print(", ");                        // Komma und Leerzeichen zwischen den Bytes (außer nach dem letzten)
        }
        index += 3;   // Jedes Byte hat Format "XX:" (2 Zeichen Hex + 1 Zeichen Doppelpunkt), also Index-Ziel um 3 erhöhen
    }
    Serial.println("}");  // Ausgabe mit geschweifter Klammer abschließen
}

void loop(){}
```

Die MAC-Adressen bestehen aus sechs Bytes:  
uint8_t receiverAddress[] = {0xC8, 0xF0, 0x9E, 0x74, 0x16, 0xC4};


## Senden der Daten von einem ESP zum anderen

Spiele auf den Sender diesen Sketch auf:
```c++
#include <esp_now.h>  // Einbinden der ESP-NOW-Bibliothek
#include <WiFi.h>     // Einbinden der WiFi-Bibliothek

// MAC-Adresse des Empfängers
uint8_t empfaengerMAC[] = {0xC8, 0xF0, 0x9E, 0x74, 0x16, 0xC4};

int nr=0;  // Zahl, die gesendet werden soll

esp_now_peer_info_t peerInfo;  // Struktur für Peer-Informationen

void setup() {
  Serial.begin(115200);  // Start der seriellen Kommunikation mit 115200 Baud

  WiFi.mode(WIFI_STA);  // Setzen des WiFi-Modus auf Station, d.h. der ESP wirkt als Client im Netzwerk

  // Initialisieren von ESP-NOW und Überprüfen auf Fehler

  if (esp_now_init() != ESP_OK) {
    Serial.println("Fehler bei der Initialisierung von ESP-NOW");
    return;  // Hier bricht die Ausführung ab.
  }
  
  // Kopieren der Empfänger-Adresse in die Variable peerInfo
  memcpy(peerInfo.peer_addr, empfaengerMAC, 6);
  peerInfo.channel = 0;  // Standard-Kanal zum Senden
  peerInfo.encrypt = false;  // Keine Verschlüsselung verwenden
  
  // Hinzufügen des Peers zur ESP-NOW-Liste und Überprüfen auf Fehler
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Fehler beim Hinzufügen des Peers");
    return;
  }
}

void loop() {
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

### Erläuterungen zum Sketch

#### esp_now_peer_info_t peerInfo;
ESP-Now speichert alle wesentlichen Faktoren zur Datenübertragung in einer zusammengesetzen Variable vom Typ **esp_now_peer_info_t**. Sie hat folgende Felder:
- peer_addr[6]: Hier wird die MAC-Adresse des ESP-NOW-Partners (engl. peer) gespeichert. Die MAC-Adresse ist 6 Bytes lang und eindeutig.
- encrypt_enable: Ein boolescher Wert, der angibt, ob die Verschlüsselung für diesen Peer aktiviert ist.
- encrypt: Gibt an welche Verschlüsselung für die Verbindung mit diesem Peer verwendet wird (z.B. ESP_NOW_ENCRYPTION_NONE oder ESP_NOW_ENCRYPTION_AES128).
- lmk[16]: Der lokale Verschlüsselungsschlüssel (Local Master Key), wenn Verschlüsselung verwendet wird.
- ifidx: Die WLAN-Schnittstelle, über die kommuniziert wird, entweder Station (STA) oder Access Point (AP) Modus.
- channel: Der WiFi-Kanal, auf dem die Kommunikation mit diesem Peer stattfinden soll. Als Standard wird hierbei 0 verwendet.

Einzelne Felder werden über die Punktnotation angesprochen:  
- peerInfo.channel = 0;  // Standard-Kanal zum Senden
- peerInfo.encrypt = false;  // Keine Verschlüsselung verwenden
  
#### memcpy(peerInfo.peer_addr, empfaengerMAC, 6);

Mit **memcpy** wird die Empfängeradresse **empfaengerMAC** Byte-für-Byte in den Speicherbereich **peerInfo.peer_addr** kopiert. Hierbei müssen **6** Bytes kopiert werden.

#### if (esp_now_add_peer(&peerInfo) != ESP_OK) {
Vor dem Senden muss der Empfänger in eine Liste von Partnern (peers) aufgenommen werden. Wenn das funktioniert, gibt die Methode **esp_now_add_peer(&peerInfo)** den Wert **ESP_OK** zurück.
  
#### esp_err_t ergebnis = esp_now_send(empfaengerMAC, (uint8_t *) &nr, sizeof(nr));
Die Methode **esp_now_send** sendet Daten über ESPNow. Sie hat 3 Parameter:
- empfaengerMAC: MAC-Adresse des Empfängers
- &nr: Die Variable **nr** enthält die Daten, die gesendet werden sollen. Als Parameter wird aber nicht diese Variable, sondern ein Zeiger auf ihren Speicherort übergeben. Dies wird durch das vorgesetzte **&**-Zeichen erreicht. Außerdem muss diese Variable in eine Folge von 8-Bit-Zahlen umgewandelt werden. Hierzu dient die (uint_8 *) Anweisung.
- sizeof(nr): Abschließend muss die Länge der gesendeten Daten angeben werden.
   
## Empfangen von Daten
Beim Empfangen von Daten wird automatisch eine **Callback-Funktion** aufgerufen. Diese muss im **setup** registriert werden.

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
  
  Serial.print("MAC-Adresse des Senders: ");
  Serial.printf("%02x:%02x:%02x:%02x:%02x:%02x\n",
                  mac[0], mac[1], mac[2],
                  mac[3], mac[4], mac[5]);
  
  
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
