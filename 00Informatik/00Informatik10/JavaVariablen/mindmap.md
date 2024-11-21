markdown
# Variablen in Java

## 1. Definition
   - Speicherplatz für Daten
   - Benannte Referenzen auf Werte

## 2. Arten von Variablen
   - **Lokale Variablen**
     - Innerhalb von Methoden oder Blöcken
     - Sichtbarkeit beschränkt auf den Block
     - Lebensdauer beschränkt auf den Block
   - **Attribute = Instanzvariablen**
     - Zugehörig zu einem Objekt
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

## 5. Sichtbarkeit und Zugriffsmodifikatoren
   - **Öffentlich (public)**
   - **Privat (private)**
   - **Geschützt (protected)**
   - **Standard (package-private)**

## 6. Gültigkeitsbereich (Scope)
   - **Methoden-Scope**
     - Parameter
   - **Klassenscope**
     - Attribute
   - **Block-Scope**
     - lokale Variablen

## 7. Best Practices
   - aussagekräftige Namen wählen
   - Variablen möglichst nah am Einsatzort deklarieren
   - Verwendung von Konstanten für feststehende Werte
   - Vermeidung von globalen Variablen
