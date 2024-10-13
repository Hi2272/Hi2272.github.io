<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Kabelloser Game-Controller für Pac Man

## 1. Problemstellung

Der Spieleklassiker Pac Man kann online unter folgender Adresse gespielt werden:

[Google Pac Man](https://g.co/kgs/xKcSbFK)

Die Bedienung erfolgt nur über die Cursor-Tasten der Tastatur. Ein Game-Controller kann nicht eingebunden werden.  

In dieser Übung bauen wir einen einfachen Game-Controller mit einem Joystick, der sich über Bluetooth Low Energy (BLE) mit dem Computer verbindet. Der Rechner erkennt ihn als Tastatur und wir simulieren die entsprechenden Tastendrücke über den Joystick.






ardinformationen herunterladen

1. Öffne das Voreinstellungsmenü über File.Preferences
2. Kopiere folgende Adresse in das Feld **Additional Board...**:
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
3. Klicke auf **OK**
   ![Alt text](SC02.png)

### Boardinformationen installieren

1. Öffne den Board-Manager:
2. Trage in das Suchfeld **esp** ein.
3. Installiere **esp32 by Espressif**
   ![Alt text](SC03.png)

   [Anleitung Script-Example.com](https://www.script-example.com/esp32)

## 2. ESP32 anschließen

Schließe den ESP32 mit dem Micro-USB-Kabel an einer der beiden Buchsen auf der rechten Seite des Rechners an.

## 3. Einstellen des ESP32 in der Software

Klicke auf die Pfeilspitze rechts von Select Board und wähle **Select other board and port**:![Alt text](Sc01.png)

1. Trage im Feld BOARDS **Node** ein.
2. Klicke auf **NodeMCU32S**
3. Wähle bei **PORTS** **/dev/tty/USB0 Serial Port (USB)**
4. Klicke auf **OK**
   ![Alt text](Sc05.png)

[zurück](../../index.html)
