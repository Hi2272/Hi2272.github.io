#include "WiFi.h"  // Einbinden der WiFi-Bibliothek für ESP32

void setup(){
    Serial.begin(115200);    // Serielle Schnittstelle mit 115200 Baud starten
    delay(1000);             // Kurze Wartezeit, damit der Serial Monitor Zeit zum Verbinden hat

    WiFi.mode(WIFI_STA);     // WLAN-Modus auf Station (Client) setzen (notwendig für ESP-NOW und MAC-Adresse)

    // Warten bis WiFi Station (WLAN-Interface) gestartet ist
    // ACHTUNG: Diese Methode 'WiFi.STA.started()' existiert so nicht in der Arduino WiFi-API! 
    // Vermutlich ist hier ein Fehler oder Missverständnis.
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