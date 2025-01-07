# Variablen in Java

## 1. Definition
- Name für eine Speicheradresse
- **Primitive Datentypen:**
Speichern Werte direkt
  - `int` - Ganzzahlen
  - `double` - Gleitkommazahlen
  - `char` - Einzelne Zeichen
  - `boolean` - Wahrheitswerte
- **Referenzdatentypen:**
Speichern Adresse der Werte
  - Strings
  - Objekte
  - Arrays
  
## 2. Arten von Variablen
   - **Attribute = Instanzvariablen**
     - Zugehörig zu einem Objekt
     - Sichtbarkeit einstellbar:
       - public
       - private
       - protected
     - Lebensdauer entspricht der Lebensdauer des Objekts
   - **Parameter**
     - Deklaration im Kopf einer Methode
     - Sichtbarkeit beschränkt auf diese Methode
     - Lebensdauer beschränkt auf diese Methode
   - **Lokale Variablen**
     - Innerhalb von Methoden oder Blöcken
     - Sichtbarkeit beschränkt auf den Block
     - Lebensdauer beschränkt auf den Block
   
## 3. Deklaration und Initialisierung
   - **Deklaration**
     - Beispiel: `int zahl;`
   - **Initialisierung**
     - Beispiel: `zahl = 5;`
   - **Kombination**
     - Beispiel: `int zahl = 5;`