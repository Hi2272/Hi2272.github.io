# Variablen in Java

## 1. Definition
   - Speicherplatz für Daten
   - Benannte Adressen im Speicher
## 2. Arten von Variablen
   - **Lokale Variablen**
     - Innerhalb von Methoden oder Blöcken
     - Sichtbarkeit beschränkt auf den Block
     - Lebensdauer beschränkt auf den Block
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

## 3. Datentypen
   - **Primitive Datentypen**
     - `int` - Ganzzahlen
     - `double` - Gleitkommazahlen
     - `char` - Einzelne Zeichen
     - `boolean` - Wahrheitswerte
   - **Referenzdatentypen**
     - Objekte
     - Arrays
     - Strings

## 4. Deklaration und Initialisierung
   - **Deklaration**
     - Beispiel: `int zahl;`
   - **Initialisierung**
     - Beispiel: `zahl = 5;`
   - **Kombination**
     - Beispiel: `int zahl = 5;`

## 5. Best Practices
   - aussagekräftige Namen wählen
   - Variablen möglichst nah am Einsatzort deklarieren
   - Verwendung von Konstanten für feststehende Werte
   - Vermeidung von globalen Variablen
