#include <Arduino.h>

#include "R200.h"

// Konstruktor für die R200-Klasse
R200::R200() {};

  
/**
 * Initialisiert den R200-Leser mit den Einstellungen für die serielle Kommunikation.
 * 
 * @param serial Zeiger auf die HardwareSerial-Instanz für die Kommunikation.
 * @param baud Baudrate für die Kommunikation.
 * @param RxPin Pin-Nummer für den Empfang von Daten.
 * @param TxPin Pin-Nummer für das Senden von Daten.
 * @return true, wenn die Initialisierung erfolgreich ist.
 */
bool R200::begin(HardwareSerial *serial, int baud, uint8_t RxPin, uint8_t TxPin){
  _serial = serial; // Weist die serielle Instanz der Klassenvariable zu
  _serial->begin(baud, SERIAL_8N1, RxPin, TxPin); // Startet die serielle Kommunikation mit den angegebenen Parametern
  return true; // Gibt true zurück, um eine erfolgreiche Initialisierung anzuzeigen
};


/**
 * Gibt ein einzelnes Byte im hexadezimalen Format auf der seriellen Ausgabe aus.
 * 
 * @param name Name des Bytes zur Identifizierung in der Ausgabe.
 * @param value Der Byte-Wert, der ausgegeben werden soll.
 */
void printHexByte(char* name, uint8_t value){
  Serial.print(name);
  Serial.print(":");
  Serial.print(value < 0x10 ? "0x0" : "0x"); // Format für einstellige Hex-Werte
  Serial.println(value, HEX); // Gibt den Wert im hexadezimalen Format aus
}


/**
 * Gibt ein Array von Bytes im hexadezimalen Format auf der seriellen Ausgabe aus.
 * 
 * @param name Name des Byte-Arrays zur Identifizierung in der Ausgabe.
 * @param value Zeiger auf das Array von Bytes, das ausgegeben werden soll.
 * @param len Länge des Byte-Arrays.
 */
void printHexBytes(char* name, uint8_t *value, uint8_t len){
  Serial.print(name);
  Serial.print(":");
  Serial.print("0x");
  for(int i=0; i<len; i++){
    Serial.print(value[i] < 0x10 ? "0" : ""); // Format für einstellige Hex-Werte
    Serial.print(value[i], HEX); // Gibt jedes Byte im hexadezimalen Format aus
  }
  Serial.println(""); // Gibt eine neue Zeile am Ende aus
}


/**
 * Gibt zwei Bytes im hexadezimalen Format auf der seriellen Ausgabe aus.
 * 
 * @param name Name zur Identifizierung in der Ausgabe.
 * @param MSB Höchstwertiges Byte, das ausgegeben werden soll.
 * @param LSB Niedrigstwertiges Byte, das ausgegeben werden soll.
 */
void printHexWord(char* name, uint8_t MSB, uint8_t LSB){
  Serial.print(name);
  Serial.print(":");
  Serial.print(MSB < 0x10 ? "0x0" : "0x"); // Format für einstellige Hex-Werte
  Serial.println(MSB, HEX); // Gibt MSB im hexadezimalen Format aus
  Serial.print(LSB < 0x10 ? "0" : ""); // Format für einstellige Hex-Werte
  Serial.println(LSB, HEX); // Gibt LSB im hexadezimalen Format aus
}


/**
 * Hauptschleifenfunktion, die nach neuen Daten sucht und diese verarbeitet.
 */
void R200::loop(){
  // Überprüft, ob neue Daten empfangen wurden
  if(dataAvailable()){
    // Versucht, ein vollständiges Datenpaket zu empfangen
    if(receiveData()){
      if(dataIsValid()){
        // Wenn ein vollständiges Datenpaket empfangen wurde, wird es geparst
        switch(_buffer[R200_CommandPos]){
          case CMD_GetModuleInfo:
            for (uint8_t i=0; i<RX_BUFFER_LENGTH-8; i++) {
              Serial.print((char)_buffer[6 + i]); // Gibt die Modulinformationen aus dem Puffer aus
              // Stoppt, wenn nur noch zwei Bytes für die CRC und den Frame-Endmarker übrig sind
              if (_buffer[8 + i] == R200_FrameEnd) {
                break; // Verlässt die Schleife, wenn das Ende des Pakets erreicht ist
              }
            }
            Serial.println(""); // Gibt eine neue Zeile nach den Modulinformationen aus
            break;
          case CMD_SinglePollInstruction:
            #ifdef DEBUG
              printHexByte("RSSI", _buffer[6]); // Gibt den RSSI-Wert aus
              printHexWord("PC", _buffer[7], _buffer[8]); // Gibt den PC-Code aus
              printHexBytes("EPC(", &_buffer[9], 12); // Gibt den EPC-Code aus
            #endif
            if(memcmp(uid, &_buffer[9], 12) != 0) { // Überprüft, ob sich die UID geändert hat
              memcpy(uid, &_buffer[9], 12); // Aktualisiert die UID
              #ifdef DEBUG
                Serial.print("Neue Karte erkannt: "); // Benachrichtigt über die Erkennung einer neuen Karte
                dumpUIDToSerial(); // Gibt die UID auf der seriellen Ausgabe aus
                Serial.println(""); // Gibt eine neue Zeile aus
              #endif
            }
            else {
              #ifdef DEBUG
                Serial.print("Die gleiche Karte ist weiterhin vorhanden: "); // Benachrichtigt über das Vorhandensein derselben Karte
                dumpUIDToSerial(); // Gibt die UID auf der seriellen Ausgabe aus
                Serial.println(""); // Gibt eine neue Zeile aus
              #endif
            }
            #ifdef DEBUG
              printHexWord("CRC", _buffer[20], _buffer[21]); // Gibt den CRC-Wert aus
            #endif
            break;
          case CMD_ExecutionFailure:
            switch(_buffer[R200_ParamPos]){
              case ERR_CommandError:
                Serial.println("Befehlsfehler"); // Gibt die Fehlermeldung für den Befehl aus
                break;
              case ERR_InventoryFail:
                // Dies ist nicht unbedingt ein "Fehler" - es bedeutet lediglich, dass keine Karten in Reichweite sind
                if(memcmp(uid, blankUid, sizeof uid) != 0) { // Überprüft, ob zuvor eine UID gespeichert wurde
                  #ifdef DEBUG
                    Serial.print("Karte entfernt: "); // Benachrichtigt über die Entfernung der Karte
                    dumpUIDToSerial(); // Gibt die UID auf der seriellen Ausgabe aus
                    Serial.println(""); // Gibt eine neue Zeile aus
                  #endif
                  memset(uid, 0, sizeof uid); // Löscht die UID
                }
                break;
              case ERR_AccessFail:
                // Serial.println("Zugriffsfehler"); // Gibt die Fehlermeldung für den Zugriffsfehler aus
                break;
              case ERR_ReadFail:
                // Serial.println("Lese-Fehler"); // Gibt die Fehlermeldung für den Lese-Fehler aus
                break;
              case ERR_WriteFail:
                // Serial.println("Schreib-Fehler"); // Gibt die Fehlermeldung für den Schreib-Fehler aus
                break;
              default:
                // Serial.print("Fehlercode "); // Gibt den Fehlercode aus
                // Serial.println(_buffer[R200_ParamPos], HEX); // Gibt den Fehlercode im Hex-Format aus
                break;
            }
            break;
        }
      }
    }
  }
}


/**
 * Überprüft, ob die empfangenen Daten basierend auf der CRC gültig sind.
 * 
 * @return true, wenn die Daten gültig sind, andernfalls false.
 */
bool R200::dataIsValid(){
  uint8_t CRC = calculateCheckSum(_buffer); // Berechnet die CRC für die empfangenen Daten

  // Berechnet die Parameterlänge aus dem Puffer
  uint16_t paramLength = _buffer[3];
  paramLength<<=8; // Verschiebt MSB nach links
  paramLength += _buffer[4]; // Addiert LSB
  uint8_t CRCpos = 5 + paramLength; // Bestimmt die Position der CRC im Puffer

  return (CRC == _buffer[CRCpos]); // Gibt true zurück, wenn die berechnete CRC mit der im Puffer übereinstimmt
}


/**
 * Überprüft, ob Daten vom Leser verfügbar sind.
 * 
 * @return true, wenn Daten verfügbar sind, andernfalls false.
 */
bool R200::dataAvailable(){
  return _serial->available() > 0; // Gibt true zurück, wenn Daten zum Lesen verfügbar sind
}


/**
 * Gibt die zuletzt gelesene UID auf der seriellen Ausgabe aus.
 */
void R200::dumpUIDToSerial(){
  Serial.print("0x");
  for (uint8_t i=0; i< 12; i++){
    Serial.print(uid[i] < 0x10 ? "0" : ""); // Format für einstellige Hex-Werte
    Serial.print(uid[i], HEX); // Gibt jedes Byte der UID im hexadezimalen Format aus
  }
   Serial.println(". Fertig."); // Gibt an, dass das Ausgeben der UID abgeschlossen ist
}


/**
 * Gibt den gesamten Empfangspuffer auf der seriellen Ausgabe aus.
 */
void R200::dumpReceiveBufferToSerial(){
  Serial.print("0x");
  for (uint8_t i=0; i< RX_BUFFER_LENGTH; i++){
    Serial.print(_buffer[i] < 0x10 ? "0" : ""); // Format für einstellige Hex-Werte
    Serial.print(_buffer[i], HEX); // Gibt jedes Byte des Puffers im hexadezimalen Format aus
  }
  Serial.println(". Fertig."); // Gibt an, dass das Ausgeben des Puffers abgeschlossen ist
}


/**
 * Parst die Daten, die im Empfangspuffer gespeichert wurden.
 * 
 * @return true, wenn das Parsen erfolgreich war, andernfalls false.
 */
bool R200::parseReceivedData() {
  switch(_buffer[R200_CommandPos]){
    case CMD_GetModuleInfo:
      break; // Keine Aktion erforderlich für Modulinformationen
    case CMD_SinglePollInstruction:
      for(uint8_t i=8; i<20; i++) {
        uid[i-8] = _buffer[i]; // Kopiert die UID aus dem Puffer in das uid-Array
      }
      break; // Verlässt den Fall nach dem Kopieren der UID
    case CMD_MultiplePollInstruction:
      for(uint8_t i=8; i<20; i++) {
        uid[i-8] = _buffer[i]; // Kopiert die UID aus dem Puffer in das uid-Array
      }
      break; // Verlässt den Fall nach dem Kopieren der UID
    case CMD_ExecutionFailure:
      break; // Keine Aktion erforderlich bei Ausführungsfehler
    default:
      break; // Keine Aktion erforderlich für unbekannten Befehl
  }
}


/**
 * Leert den eingehenden seriellen Puffer, indem alle Bytes verworfen werden.
 * 
 * @return Anzahl der verworfenen Bytes.
 */
uint8_t R200::flush(){
  uint8_t bytesDiscarded = 0; // Initialisiert den Zähler für verworfene Bytes
  while(_serial->available()){
    _serial->read(); // Verwirft jedes Byte im Puffer
    bytesDiscarded++; // Erhöht den Zähler
  }
  return bytesDiscarded; // Gibt die Anzahl der verworfenen Bytes zurück
}


/**
 * Liest eingehende serielle Daten, die vom Leser gesendet wurden.
 * Dies kann entweder eine Antwort auf einen gesendeten Befehl oder eine Benachrichtigung sein.
 * Gibt true zurück, wenn ein vollständiges Datenpaket innerhalb des festgelegten Zeitlimits gelesen wurde.
 * 
 * @param timeOut Maximale Zeit, um auf Daten zu warten.
 * @return true, wenn ein vollständiges Paket empfangen wurde, andernfalls false.
 */
bool R200::receiveData(unsigned long timeOut){
  unsigned long startTime = millis(); // Zeichnet die Startzeit auf
  uint8_t bytesReceived = 0; // Initialisiert den Zähler für empfangene Bytes
  // Leert den Puffer
  for (int i = 0; i < RX_BUFFER_LENGTH; i++) { _buffer[i] = 0; } // Leert den Puffer

  // Wartet auf Daten, die innerhalb des Zeitlimits empfangen werden
  while ((millis() - startTime) < timeOut) {
    while (_serial->available()) {
      uint8_t b = _serial->read(); // Liest ein Byte aus dem seriellen Puffer
      if(bytesReceived > RX_BUFFER_LENGTH - 1) {
        Serial.print("Fehler: Maximale Pufferlänge überschritten!"); // Gibt eine Fehlermeldung aus, wenn der Puffer überläuft
        flush(); // Leert den seriellen Puffer
        return false; // Gibt false zurück, um einen Fehler anzuzeigen
      }
      else {
        _buffer[bytesReceived] = b; // Speichert das empfangene Byte im Puffer
      }
      bytesReceived++; // Erhöht den Zähler für empfangene Bytes
      if (b == R200_FrameEnd) { break; } // Verlässt die Schleife, wenn das Ende des Pakets erreicht ist
    }
  }

  // Überprüft, ob ein vollständiges Paket empfangen wurde
  if (bytesReceived > 1 && _buffer[0] == R200_FrameHeader && _buffer[bytesReceived - 1] == R200_FrameEnd) {
      return true; // Gibt true zurück, wenn das Paket gültig ist
  } else {
      return false; // Gibt false zurück, wenn das Paket ungültig ist
  }
}


/**
 * Sendet einen Befehl, um die Modulinformationen an den Leser zu übertragen.
 */
void R200::dumpModuleInfo(){
  uint8_t commandFrame[8] = {0}; // Initialisiert den Befehlsrahmen
  commandFrame[0] = R200_FrameHeader; // Setzt den Rahmenheader
  commandFrame[1] = FrameType_Command; // Setzt den Rahmentyp
  commandFrame[2] = CMD_GetModuleInfo; // Setzt den Befehl zum Abrufen von Modulinformationen
  commandFrame[3] = 0x00; // ParamLen MSB
  commandFrame[4] = 0x01; // ParamLen LSB
  commandFrame[5] = 0x00;  // Parameter
  commandFrame[6] = 0x04; // Berechnung der Prüfziffer
  commandFrame[7] = R200_FrameEnd; // Setzt das Ende des Rahmens
  _serial->write(commandFrame, 8); // Sendet den Befehlsrahmen
}


/**
 * Sendet einen Einzelabfragebefehl an den Leser.
 */
void R200::poll(){
  uint8_t commandFrame[7] = {0}; // Initialisiert den Befehlsrahmen
  commandFrame[0] = R200_FrameHeader; // Setzt den Rahmenheader
  commandFrame[1] = FrameType_Command; // Setzt den Rahmentyp
  commandFrame[2] = CMD_SinglePollInstruction; // Setzt den Befehl für die Einzelabfrage
  commandFrame[3] = 0x00; // ParamLen MSB
  commandFrame[4] = 0x00; // ParamLen LSB
  commandFrame[5] = 0x22;  // Prüfziffer
  commandFrame[6] = R200_FrameEnd; // Setzt das Ende des Rahmens
  _serial->write(commandFrame, 7); // Sendet den Befehlsrahmen
}


/**
 * Aktiviert oder deaktiviert den Modus für mehrere Abfragen.
 * 
 * @param enable true, um mehrere Abfragen zu aktivieren, false, um sie zu deaktivieren.
 */
void R200::setMultiplePollingMode(bool enable){
  if(enable){
    uint8_t commandFrame[10] = {0}; // Initialisiert den Befehlsrahmen
    commandFrame[0] = R200_FrameHeader; // Setzt den Rahmenheader
    commandFrame[1] = FrameType_Command; // Setzt den Rahmentyp
    commandFrame[2] = CMD_MultiplePollInstruction; // Setzt den Befehl für mehrere Abfragen
    commandFrame[3] = 0x00; // ParamLen MSB
    commandFrame[4] = 0x03; // ParamLen LSB
    commandFrame[5] = 0x22;  // Parameter (Reserviert? Immer 0x22 für diesen Befehl)
    commandFrame[6] = 0xFF;  // Anzahl der Abfragen, MSB
    commandFrame[7] = 0xFF;  // Anzahl der Abfragen, LSB
    commandFrame[8] = 0x4A; // Berechnung der Prüfziffer
    commandFrame[9] = R200_FrameEnd; // Setzt das Ende des Rahmens
    _serial->write(commandFrame, 10); // Sendet den Befehlsrahmen
  }
  else {
    uint8_t commandFrame[7] = {0}; // Initialisiert den Befehlsrahmen
    commandFrame[0] = R200_FrameHeader; // Setzt den Rahmenheader
    commandFrame[1] = FrameType_Command; // Setzt den Rahmentyp
    commandFrame[2] = CMD_StopMultiplePoll; // Setzt den Befehl zum Stoppen mehrerer Abfragen
    commandFrame[3] = 0x00; // ParamLen MSB
    commandFrame[4] = 0x00; // ParamLen LSB
    commandFrame[5] = 0x28; // Berechnung der Prüfziffer
    commandFrame[6] = R200_FrameEnd; // Setzt das Ende des Rahmens
    _serial->write(commandFrame, 7); // Sendet den Befehlsrahmen
  }
}


/**
 * Berechnet die Prüfziffer für den angegebenen Puffer.
 * 
 * @param buffer Zeiger auf den Puffer, für den die Prüfziffer berechnet werden soll.
 * @return Die berechnete Prüfziffer als einzelnes Byte.
 */
uint8_t R200::calculateCheckSum(uint8_t *buffer){
  // Extrahiert, wie viele Parameter im Puffer vorhanden sind
  uint16_t paramLength = buffer[3];
  paramLength<<=8; // Verschiebt MSB nach links
  paramLength+= buffer[4]; // Addiert LSB

  // Die Prüfziffer wird als Summe aller Parameter-Bytes berechnet
  // plus vier Steuerbytes am Anfang (Typ, Befehl und die 2-Byte-Parameterlänge)
  uint16_t check = 0; // Initialisiert die Prüfziffer-Variable
  for(uint16_t i=1; i < paramLength+4+1; i++) { // Iteriert durch die relevanten Bytes
    check += buffer[i]; // Addiert den Bytewert zur Prüfziffer
  }
  // Gibt jetzt nur das LSB zurück
  return (check & 0xff); // Gibt das niederwertige Byte der Prüfziffer zurück
}


/**
 * Wandelt ein zweibyte-Array in einen uint16_t-Wert um.
 * 
 * @param array Zeiger auf das Byte-Array, das umgewandelt werden soll.
 * @return Der umgewandelte uint16_t-Wert.
 */
uint16_t R200::arrayToUint16(uint8_t *array){
  uint16_t value = *array; // Holt das erste Byte
  value <<= 8; // Verschiebt nach links
  value += *(array+1); // Addiert das zweite Byte
  return value; // Gibt den kombinierten uint16_t-Wert zurück
}
