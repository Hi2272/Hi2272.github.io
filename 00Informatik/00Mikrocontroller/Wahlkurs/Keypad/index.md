<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Tastatur-Matrix

## Zuordnen der Tasten
Mit diesem Sketch können die Tasten eines beliebigen Keypads ausgelesen werden.  
Anschließend kann die **keymap** aus dem seriellen Monitor herauskopiert und in den eigenen Sketch eingefügt werden.


```C++
// Größe der Tastaturmatrix: 4 Zeilen und 4 Spalten (Konstanten bleiben unverändert)
const int ANZ_ROWS = 4;
const int ANZ_COLS = 4;

// Pins der Spalten und Zeilen - umgekehrte Reihenfolge für passende Matrix-Belegung zum 4x4 Keypad
const int colPins[ANZ_COLS] = { 5, 4, 3, 2 };
const int rowPins[ANZ_ROWS] = { 9, 8, 7, 6 };

// Symbole auf den Tasten des 4x4 Keypads
const char symbols[ANZ_ROWS * ANZ_COLS] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', '#', '*' };

// Matrix zur Speicherung der erfassten Symbole
char keymap[ANZ_ROWS][ANZ_COLS];

void setup() {
  Serial.begin(9600);

  // Setze Zeilen als OUTPUT und initialisiere mit HIGH
  for (int i = 0; i < ANZ_ROWS; i++) {
    pinMode(rowPins[i], OUTPUT);
    digitalWrite(rowPins[i], HIGH);
  }
  // Setze Spalten als INPUT mit internem Pullup-Widerstand
  for (int i = 0; i < ANZ_COLS; i++) {
    pinMode(colPins[i], INPUT_PULLUP);
  }

  // Fülle keymap zunächst mit Leerzeichen
  for (int r = 0; r < ANZ_ROWS; r++) {
    for (int c = 0; c < ANZ_COLS; c++) {
      keymap[r][c] = ' ';
    }
  }
  Serial.println("Starte Tastatur-Matrix-Zuordnung:");

  // Durchlaufe alle Symbole und fordere Tastendruck zur Zuordnung der Taste an
  for (int i = 0; i < ANZ_ROWS * ANZ_COLS; i++) {
    Serial.print("Bitte Taste drücken für Symbol '");
    Serial.print(symbols[i]);
    Serial.println("'");

    int pos = waitForAnyKey();
    if (pos == -1) {
      Serial.println("Fehler beim Lesen der Taste, nochmal versuchen.");
      i--;  // Wiederhole diesen symbolindex
      continue;
    }
    int row = pos / ANZ_COLS;  // Berechne Zeile aus Position
    int col = pos % ANZ_COLS;  // Berechne Spalte aus Position

    // Speichere das Symbol an der erkannten Position
    keymap[row][col] = symbols[i];
    Serial.print("Position (Spalte ");
    Serial.print(col);
    Serial.print(", Zeile ");
    Serial.print(row);
    Serial.println(") gespeichert.");

    printKeymap();
    Serial.println("--------------------");
  }
  Serial.println("Alle Symbole eingetragen.");
  printKeymap();
  Serial.println("Teste jetzt die Matrix!");
}

void loop() {
  int pos = getKey();
  if (pos != -1){
    int row = pos / ANZ_COLS;  // Zeile
    int col = pos % ANZ_COLS;  // Spalte
    Serial.print("Spalte: ");
    Serial.print(col);
    Serial.print(", Zeile: ");
    Serial.print(row);
    Serial.print(" Symbol: ");
    Serial.println(keymap[row][col]);
    delay(100);
  }
}

/**
 * Ermittelt, welche Taste aktuell gedrückt wurde.
 * 
 * @return Die Position der gedrückten Taste als Index (Zeile * ANZ_COLS + Spalte) oder -1 wenn keine Taste gedrückt.
 */
int getKey() {
  for (int row = 0; row < ANZ_ROWS; row++) {
    digitalWrite(rowPins[row], LOW);  // Aktiviere aktuelle Zeile
    for (int col = 0; col < ANZ_COLS; col++) {
      if (digitalRead(colPins[col]) == LOW) {  // Taste sichtbar gedrückt
        delay(50); // Entprellzeit
        if (digitalRead(colPins[col]) == LOW) { // Bestätige Tastendruck
          while (digitalRead(colPins[col]) == LOW) ; // Warte bis Taste losgelassen
          digitalWrite(rowPins[row], HIGH); // Deaktiviere Zeile
          return row * ANZ_COLS + col; // Berechne Position und liefere zurück
        }
      }
    }
    digitalWrite(rowPins[row], HIGH); // Deaktiviere Zeile vor nächster Iteration
  }
  return -1; // Keine Taste gedrückt
}

/**
 * Wartet auf einen Tastendruck und gibt die Position der gedrückten Taste zurück.
 * 
 * @return Die Position der gedrückten Taste als Index (Zeile * ANZ_COLS + Spalte).
 */
int waitForAnyKey() {
  int i = -1;
  while (i == -1) {
    i = getKey();  // Solange keine Taste, weiter warten
  }
  return i;
}

/**
 * Gibt die aktuelle Belegung der Tastaturmatrix mit Symbolen über die serielle Schnittstelle aus.
 */
void printKeymap() {
  Serial.print("char keymap[");
  Serial.print(ANZ_COLS);
  Serial.print("][");
  Serial.print(ANZ_ROWS);
  Serial.println("] = {");
  for (int r = 0; r < ANZ_ROWS; r++) {
    Serial.print("  {");
    for (int c = 0; c < ANZ_COLS; c++) {
      Serial.print('\'');
      Serial.print(keymap[r][c]);
      Serial.print('\'');
      if (c < ANZ_COLS - 1) Serial.print(", ");
    }
    Serial.print("}");
    if (r < ANZ_ROWS - 1) Serial.println(",");
    else Serial.println();
  }
  Serial.println("};");
}
```

## Anwenden der Matrix
Dieser Sketch verwendet die oben erzeugte **keymap**:  

```C++

// Anzahl der Zeilen und Spalten der Tastaturmatrix (unveränderliche Konstanten)
const int ANZ_ROWS = 4;
const int ANZ_COLS = 4;

// Zuordnung der Pins zu den Spalten und Zeilen entsprechend der Tastaturmatrix
const int colPins[ANZ_COLS] = { 5, 4, 3, 2 };
const int rowPins[ANZ_ROWS] = { 9, 8, 7, 6 };

// Tastatur-Layout zur Zuordnung der Tastenposition zu den Symbolen
char keymap[4][4] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};

/**
 * Scannt die Tastaturmatrix auf eine gedrückte Taste.
 * 
 * Jede Zeile wird einzeln auf LOW gesetzt und die Spalten auf LOW geprüft.
 * Wird eine Taste erkannt, wartet die Funktion auf das Loslassen der Taste,
 * bevor sie die Position (als Integer codiert) zurückgibt.
 * 
 * @return Positionsindex der gedrückten Taste (Zeile * ANZ_COLS + Spalte),
 *         oder -1 wenn keine Taste gedrückt ist.
 */
int getKey() {
  for (int row = 0; row < ANZ_ROWS; row++) {
    digitalWrite(rowPins[row], LOW);
    for (int col = 0; col < ANZ_COLS; col++) {
      if (digitalRead(colPins[col]) == LOW) {
        // Warten bis die Taste wieder losgelassen wird
        while (digitalRead(colPins[col]) == LOW);
        digitalWrite(rowPins[row], HIGH);
        return row * ANZ_COLS + col;
      }
    }
    digitalWrite(rowPins[row], HIGH);
  }
  return -1;
}


/**
 * Initialisiert die serielle Kommunikation und konfiguriert die Pins
 * für die Zeilen als Ausgänge (initial HIGH) und Spalten als Eingänge
 * mit Pullup-Widerständen.
 */
void setup() {
  Serial.begin(9600);

  for (int i = 0; i < ANZ_ROWS; i++) {
    pinMode(rowPins[i], OUTPUT);
    digitalWrite(rowPins[i], HIGH);
  }
  for (int i = 0; i < ANZ_COLS; i++) {
    pinMode(colPins[i], INPUT_PULLUP);
  }
  Serial.println("Teste jetzt die Matrix!");
}

/**
 * Hauptschleife: Prüft kontinuierlich, ob eine Taste gedrückt wurde.
 * Bei Erkennung wird die Position ermittelt und das zugehörige Symbol
 * über die serielle Schnittstelle ausgegeben.
 */
void loop() {
  int pos = getKey();
  if (pos != -1) {
    int row = pos / ANZ_COLS;  // Berechnet die Zeilennummer aus der Position
    int col = pos % ANZ_COLS;  // Berechnet die Spaltennummer aus der Position
    Serial.print("col: ");
    Serial.print(col);
    Serial.print(", row: ");
    Serial.print(row);
    Serial.print(" Symbol: ");
    Serial.println(keymap[row][col]);
    delay(100);
  }
}

```
