# Spieleentwicklung mit LibGDX

## Installation
### 1. Installation von gdx-liftoff
https://libgdx.com/wiki/start/project-generation

### 2. Installation von IntelliJ


## Neues Projekt starten

### 1. Gdx-Liftoff starten
Namen und Daten eintragen

### 2. IntelliJ starten und Projekt starten

#### a) Projekt laden
- In IntelliJ den gerade erstellen Projektordner öffnen
- Warten, bis alle Abhängigkeiten heruntergeladen sind
#### b) Projekt erstmalig ablaufen lassen
- Im Ordner lwjgl3/src/main/java/.../lwjgl3/Lwjgl3Launcher.java suchen
- Datei mit rechts anklicken und run Lwjgl3Launcher.main auswählen

## Ordner im Projekt
### /assets [main]
Enthält alle Bild- und Tondateien für das Programm

### /core/src/main/java/.../Main.java
- Hauptprogramm, das die create, render und dispose-Methoden für den Gameloop enthalten
- Im gleichen Verzeichnis müssen auch andere Klassendateien stehen.


### /core/build.gradle
Gradle-Datei, in dem die Abhängigkeiten eingetragen werden müssen, die vom Programm benötigt werden.

## Joystick programmieren
### Bibliothek einbinden

In /core/build.gradle müssen folgende Zeilen eingefügt werden:

Versionsnummer definieren:

ext {
  gdxControllersVersion = "2.2.4"
}

Unter dependencies diese Zeilen eingefügt werden:  

    implementation "com.badlogicgames.gdx-controllers:gdx-controllers-core:$gdxControllersVersion"
    implementation "com.badlogicgames.gdx-controllers:gdx-controllers-desktop:$gdxControllersVersion"


Beim Aktualisieren lädt das System die passende Bibliotheken aus dem Internet herunter

## Unterklasse Joystick erstellen.


public class JoyStick implements Controller {

Die Fehlermeldungen können durch Rechtsklick gelöst werden. Das System erstellt automatisch die fehlenden leeren Methoden.
