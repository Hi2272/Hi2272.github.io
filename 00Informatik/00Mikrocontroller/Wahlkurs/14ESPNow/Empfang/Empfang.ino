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
