int pinGruen = 25;  // Pin für die grüne LED
int pinGelb = 26;   // Pin für die gelbe LED
int pinRot = 27;    // Pin für die rote LED

int taster = 14;    // Pin für den Drucktaster

unsigned long zeit;  // Variable zur Speicherung der Zeit
unsigned long zeiten[100]; // Array zur Speicherung von Reaktionszeiten
unsigned long anz = 0; // Zähler für die Anzahl der Messungen

int minZeit = 100000; // Variable zur Speicherung der minimalen Reaktionszeit
boolean fehlstart = false; // Flag für Fehlstart

void setup() {
  // Initialisierung der Pins
  pinMode(pinRot, OUTPUT);
  pinMode(pinGelb, OUTPUT);
  pinMode(pinGruen, OUTPUT);
  pinMode(taster, INPUT_PULLUP); // Taster als Eingangs-Pin mit Pull-Up-Widerstand
  randomSeed(analogRead(0)); // Initialisierung des Zufallszahlengenerators
  Serial.begin(115200); // Start der seriellen Kommunikation
}

void loop() {
  fehlstart = false; // Setze das Fehlstart-Flag zurück
  Serial.println("Taste drücken zum Start!"); // Aufforderung zum Start
  Serial.println("------------------");
  int pause = 0; // Initialisiere die Pause-Zählvariable
  while (digitalRead(taster) == HIGH) { // Warte, bis der Taster gedrückt wird
    pause = pause + 1; // Erhöhe Pause-Zähler
    pause = pause % 2000; // Zyklische Begrenzung auf 2000
    if (pause % 2000 > 1000) { // Blinkfunktion
      aus(); // Schalte alle LEDs aus
    } else {
      gelb(); // Schalte die gelbe LED ein
    }
    delay(1); // Kurze Verzögerung
  }
  
  // Warte, bis der Taster losgelassen wird
  while (digitalRead(taster) == LOW) { delay(1); }
  Serial.println("Bei Rot Taste drücken!"); // Aufforderung um auf Rot zu warten
  gruen(); // Schalte die grüne LED ein
  int warteZeit = 3000 + random(6000); // Wartezeit zwischen 3 und 9 Sekunden
  while (warteZeit > 0) {
    if (digitalRead(taster) == LOW) { // Überprüfe, ob der Taster gedrückt wurde
      Serial.println("Fehlstart!"); // Fehlstart festgestellt
      fehlstart = true; // Setze Fehlstart-Flag
      warteZeit = 0; // Breche die Wartezeit ab
      // Warte, bis der Taster losgelassen wird
      while (digitalRead(taster) == LOW) { delay(1); }
    }
    delay(1); // Kurze Verzögerung
    warteZeit--; // Verringere die Wartezeit
  }
  
  if (!fehlstart) { // Wenn kein Fehlstart
    // Warte, bis der Taster losgelassen wird
    while (digitalRead(taster) == LOW) { delay(1); }
    rot(); // Schalte die rote LED ein
    zeit = millis(); // Speichere die aktuelle Zeit
    // Warte, bis der Taster gedrückt wird
    while (digitalRead(taster) == HIGH) { delay(1); }
    zeit = millis() - zeit; // Berechne die Reaktionszeit
    Serial.println("Deine Reaktionszeit: " + String(zeit) + " ms"); // Ausgabe der Reaktionszeit

    // Ausgabe der statistischen Information
    if (anz < 100) {
      Serial.println("Statistik der letzten " + String(anz + 1) + " Messungen:");
    } else {
      Serial.println("Statistik der letzten 100 Messungen:");
    }
    
    // Überprüfung und Aktualisierung des Rekords
    if (zeit < minZeit) {
      Serial.println("Neue Rekordzeit!"); // Neue Rekordzeit
      minZeit = zeit; // Aktualisierung der minimalen Zeit
    } else {
      Serial.println("Geringste Reaktionszeit: " + String(minZeit) + " ms");
    }
    
    // Speichere die Reaktionszeit in das Array
    zeiten[anz % 100] = zeit;
    anz++; // Erhöhe die Anzahl der Messungen

    Serial.println("Mittlere Reaktionszeit " + String(mw()) + " ms"); // Ausgabe der mittleren Reaktionszeit

    Serial.println("---------------");
    // Warte, bis der Taster losgelassen wird
    while (digitalRead(taster) == LOW) { delay(1); }
  }
}

// Funktion zum Steuern der gelben LED
void gelb() {
  digitalWrite(pinGruen, LOW);
  digitalWrite(pinRot, LOW);
  digitalWrite(pinGelb, HIGH);
}

// Funktion zum Steuern der roten LED
void rot() {
  digitalWrite(pinGruen, LOW);
  digitalWrite(pinRot, HIGH);
  digitalWrite(pinGelb, LOW);
}

// Funktion zum Steuern der grünen LED
void gruen() {
  digitalWrite(pinGruen, HIGH);
  digitalWrite(pinRot, LOW);
  digitalWrite(pinGelb, LOW);
}

// Funktion zum Ausschalten aller LEDs
void aus() {
  digitalWrite(pinGruen, LOW);
  digitalWrite(pinRot, LOW);
  digitalWrite(pinGelb, LOW);
}

// Funktion zur Berechnung der mittleren Reaktionszeit
double mw() {
  int summe = 0; // Summe der Reaktionszeiten
  if (zeiten[0] == 0) {
    return 0.0; // Rückgabe 0.0, wenn keine Messungen vorliegen
  }
  for (int i = 0; i < 100; i++) {
    if (zeiten[i] > 0) {
      summe = summe + zeiten[i]; // Summiere die gültigen Zeiten
    } else {
      return summe * 1.0 / i; // Berechne den Durchschnitt
    }
  }
  return summe * 1.0 / 100; // Durchschnitt über 100 Messungen
}
