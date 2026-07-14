# Blackjack oder "17 und 4"

## Grundprinzip
Beim Blackjack zieht man Karten von einem Stapel.   
Es gewinnt der Spieler, der am meisten Punkte gezogen hat.  
Zieht man aber mehr als 21 (17+4) Punkte, verliert man automatisch

## Startpunkt
https://scratch.mit.edu/projects/408494284


## 1.	Durch einen Klick auf „Karten ziehen“ sollen zufällige Karten angezeigt werden.
1.	Definiere eine neue Variable kartenNummer für alle Objekte
2.	Wenn das Objekt „Karten ziehen“ angeklickt wird, soll die kartenNummer eine Zufallszahl zwischen 1 und 52 zugewiesen werden und die Nachricht „SpielerKarte“ an alle gesendet werden.
3.	Wenn das Objekt „Karten“ die Nachricht „SpielerKarte“ empfängt, soll das Objekt sichtbar werden und zum Kostüm mit der Variable „kartenNummer“wechseln.
4.	Anschließend soll die Karte einen Abdruck hinterlassen (Dunkelgrüner Bereich), 50 Schritte weit gehen und sich verstecken.
5.	Wenn die grüne Fahne angeklickt wird, sollen alle Malspuren weggewischt werden (Dunkelgrüner Bereich), das Objekt „Karten“ auf die Position x=-170, y=0 gehen, seine Größe auf 50% einstellen und sich verstecken.

	Das Programm zeigt beim mehrfachen Klicken zufällige Karten an, aber es simuliert nicht das Ziehen von Karten aus einem Kartenspiel. Welcher Fehler kann auftreten, wenn viele Karten gezogen werden?
		
## 2.	Buchführen über bereits gezogene Karten
1.	Erzeuge beim Objekt „Karten ziehen“ eine neue Liste mit dem Namen „gezogeneKarten“.
2.	Wenn die grüne Startfahne angeklickt wird, soll alles aus dieser Liste gelöscht werden.
3.	Die Zuweisung einer Zufallszahl zur Variable „kartenNummmer“ soll solange wiederholt werden, bis die Variable „kartenNummer“ nicht in der Liste „gezogeneKarten“ enthalten ist. (Nicht-Operator im hellgrünen Bereich)
4.	Am Ende muss die Variable „kartenNummer“ der Liste „gezogeneKarten“ zugefügt werden.

Das Programm hat immer noch einen Fehler, der für unser Spiel aber keine Rolle spielt. Was geschieht, wenn eine 53. Karte gezogen werden soll, obwohl nur 52 Karten existieren?
		
## 3.	Kartenwerte speichern
Beim BlackJack gelten folgende Kartenwerte:
2-10:	2-10 Punkte; 	Bube, Dame, König: 10 Punkte;	As: 11 Punkte
1.	Erstelle eine neue Liste „kartenWerte“ für diese Werte.
2.	Klicke im grauen Bereich jeweils auf das „+“-Symbol, um mit Hand folgende Werte einzutragen: 2,3,…,9,10,10,10,10,11 (13 Werte)
4.	Einer Karte ihren Wert zuweisen
Jede Karte im Spiel ist durch ihre kartenNummer eindeutig gekennzeichnet. So hat die Kreuz-Zwei die Nummer 1, die Pik-Zwei die Nummer 14, die Herz-Zwei die Nummer 27 und die Karo-Zwei die Nummer 40. Die Nummer steigt jeweils um 13, da 13 Karten von jeder Farbe im Spiel sind.
 
Die Nummern 1, 14, 27 und 40 stehen alle für Karten mit dem gleichen Wert: 2
Mit einer einfachen Rechnung können wir sie alle gleich machen:
1 : 13 = 0 Rest 1; 	14: 13 = 1 Rest 1; 	27:13 = 2 Rest 1; 	40:13 = 3 Rest 1
In der Mathematik bezeichnet man den Rest einer Division als Modulo. Der entsprechende Operator in Scratch lautet mod (hellgrüner Bereich).
1.	Erzeuge eine neue Variable „kartenWert“.
2.	Setze den Wert dieser Variable auf kartenNummer mod 13.
3.	Setze den Werte dieser Variable auf das Element kartenWert der Liste kartenWerte.
4.	Teste dein Programm – welcher Kartenwert wird falsch berechnet?
5.	Warum tritt dieser Fehler auf? Berechne den Rest der Division durch 13.
6.	Behebe den Fehler durch einen falls-dann-Baustein. Falls „kartenWert“ den problematischen Wert hat, soll der richtige Wert zugewiesen werden.
## 5.	Die Summe der Kartenwert bilden und mit 21 vergleichen
1.	Erstelle eine neue Variable punkteSpieler.
2.	Wenn die grüne Fahne angeklickt wird, soll diese Variable auf 0 gesetzt werden.
3.	Wenn „Karte ziehen“ angeklickt wird, soll die Variable um den Wert der gezogenen Karte erhöht werden.
4.	Wenn der Wert der gezogenen Karten gleich 21 ist, soll die Nachricht „Gewonnen“ an alle geschickt werden, wenn der Wert größer als 21 ist, die Nachricht „Verloren“.
5.	Programmiere die Objekte „gewonnen“ und „verloren“ so, dass sie beim Klicken auf die grüne Fahne unsichtbar werden und beim Empfang der passenden Nachricht sichtbar.
6.	Programmiere das Objekt „Neue Karte“ so, dass es beim Klicken auf die grüne Fahne sichtbar und beim Empfang der Nachrichten „Gewonnen“ und „Verloren“ unsichtbar wird.

## Zusatzaufgabe
1.	Erstelle ein neues Schaltflächen-Objekt, mit dem ein neues Spiel gestartet werden kann. 
2.	Wenn es angeklickt wird, soll die Nachricht „Start“ an alle gesandt werden.
3.	Programmiere alle Objekte so um, dass sie anstelle auf die grüne Fahne auf die Nachricht Start reagieren. 
4.	Bei einem Objekt muss beim Klicken auf die grüne Fahne die Nachricht Start an alle gesendet werden. 
 
