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
