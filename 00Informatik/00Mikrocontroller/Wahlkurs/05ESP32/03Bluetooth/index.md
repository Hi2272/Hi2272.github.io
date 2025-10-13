   <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Bluetooth
## 1. Allgemeines 
Der ESP32 verfügt über ein eingebautes Bluetooth-Modul.   
Beim Arduino Uno kann ein Bluetooth-Modul eingebaut werden. Diese Module werden auf folgender Seite beschrieben: [Funduino HC05 und HC06](https://funduino.de/tutorial-hc-05-und-hc-06-bluetooth)  
  

Über Bluetooth kannst du Daten von deinem Mikrocontroller ans Handy senden oder den Mikrocontroller vom Handy aus steuern.  
Über die Internet-Plattform [MIT App Inventor](https://appinventor.mit.edu) kannst du relativ einfach Bluetooth-Apps für dein Handy entwickeln.  [Anleitung](../03bAppInventor/index.html)  

## 2. Senden von Daten über Bluetooth
Mit dem folgenden Programm senden wir jede Sekunde eine Zahl an die Bluetooth-Schnittstelle.  
Kopiere diesen Code in dein Programm:  

```C++
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup() {
  SerialBT.begin("Name",true); 
  SerialBT.setPin(123456);
}

int anz=0;

void loop() {
    SerialBT.println(anz);
    anz=anz+1;
    delay(1000);
 }
```
## Erläuterung des Codes
### #include "BluetoothSerial.h"
Diese Zeile bindet eine Bibliothek ein, die Befehle zum Senden und Empfangen über Bluetooth bereit stellt.
###  BluetoothSerial SerialBT;
Damit wir auf die Bluetooth-Schnittstelle zugreifen können, erzeugen wir ein Objekt **SerialBT** aus der Klasse **BluetoothSerial**.
###   SerialBT.begin("Name",true);
Mit diesem Befehl starten wir die Bluetooth-Schnittstelle. Die beiden Parameter haben folgende Bedeutung:
- "Name": Unter dieser Bezeichnung ist der ESP32 im Kopplungsmodus für dein Handy sichtbar.  
 Verwendet bitte unterschiedliche Namen, damit klar ist, mit welchem Gerät euer Handy gekoppelt werden soll.
- true: Dieser Parameter gibt an, dass bei der Kopplung am Handy ein Pin abgefragt wird. Damit wird sicher gestellt, dass sich kein fremdes Gerät mit eurem ESP32 koppeln kann.  
Der ESP32 bleibt so lange im Kopplungsmodus, bis er sich mit einem Handy verbunden hat.
### SerialBT.setPin(123456);
In dieser Zeile wird der Pin festgelegt, der zur Kopplung eingegeben werden muss. Bei eurem Programm solltet ihr etwas kreativer sein...  
###   SerialBT.println(anz);
SerialBT stellt vier verschiedene Befehle zum Senden von Daten über die Bluetooth-Schnittstelle zur Verfügung:
| <!-- -->      | <!-- -->        | 
|:-------------|:---------------|
|SerialBT.print(anz);  |Schreibt Text ohne Zeilenumbruch|
|SerialBT.println(anz);|Schreibt Text mit Zeilenumbruch|
|SerialBT.write(anz);|Schreibt Bytes ohne Zeilenumbruch|  
|SerialBT.writeln(anz);|Schreibt Bytes mit Zeilenumbruch|

## 4. Empfangen der Daten mit dem Handy
### 4.1 Vorbereiten des Handys
#### 4.1.1 Installation einer Bluetooth-App
Um die Bluetooth-Daten am Handy zu anzuzeigen, musst du eine App auf dem Handy installieren.  

Suche dazu im AppStore nach folgenden Begriffen **Bluetooth Terminal** oder **Bluetooth Serial Monitor** und installiere eine kostenfreie App.
#### 4.1.2 Kopplung des Handys mit dem ESP
- Aktiviere Bluetooth bei deinem Handy
- Suche nach neuen Bluetooth-Geräten
- Koppele das Gerät mit dem passenden Namen mit deinem Handy.   
### 4.2 Darstellen der Daten
- Starte die App, die du vorher installiert hast.
- Verbinde dich mit dem ESP32.   
  In der App müsste jetzt jede Sekunde eine neue Zahl angezeigt werden.

### [weiter zu Bluetooth Apps im dem AppInventor](../03bAppInventor/index.html)  
### [zurück](../../index.html)  

<footer >

Die Schaltpläne sind mit <a href="https://www.tinkercad.com/dashboard">Tinkercad</a> erstellt.

<h5>Haftungsausschluss</h5>
  <h5>Inhalt des Onlineangebotes</h5>
  <p>Der Autor übernimmt keinerlei Gewähr für die Aktualität, Richtigkeit und Vollständigkeit der bereitgestellten Informationen auf unserer Website. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.<br>
  Alle Angebote sind freibleibend und unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</p>
  <h5>Verweise und Links</h5>
  <p>Bei direkten oder indirekten Verweisen auf fremde Webseiten (“Hyperlinks”), die außerhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern.<br>
  Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und zukünftige Gestaltung, die Inhalte oder die Urheberschaft der verlinkten/verknüpften Seiten hat der Autor keinerlei Einfluss. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller verlinkten /verknüpften Seiten, die nach der Linksetzung verändert wurden. Diese Feststellung gilt für alle innerhalb des eigenen Internetangebotes gesetzten Links und Verweise sowie für Fremdeinträge in vom Autor eingerichteten Gästebüchern, Diskussionsforen, Linkverzeichnissen, Mailinglisten und in allen anderen Formen von Datenbanken, auf deren Inhalt externe Schreibzugriffe möglich sind. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist.</p>
  <h5>Urheber- und Kennzeichenrecht</h5>
  <p>Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte zurückzugreifen.<br>
  Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht durch Rechte Dritter geschützt sind!<br>
  Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet.</p>

Quelle: <a href="http://www.haftungsausschluss-vorlage.de/">Haftungsausschluss Muster</a> von <a href="http://www.haftungsausschluss.org/">Haftungsausschluss.org</a> und das <a href="http://www.dsgvo-gesetz.de/">Datenschutzgesetz</a>

</footer>
