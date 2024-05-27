  <meta charset="utf-8" />
  <title>HTML und CSS</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# CSS
[CSS-Selektoren](#css-selektoren) | [Rahmen](#rahmen) | [Abstände](#abstände) | [Cascade](#cascade) | [Links](#hyperlinks)  

## CSS-Selektoren
### HTML-Element
HTML Elemente werden direkt durch den Namen des HTML-Tags selektiert:  
```CSS
  h1{color:red;}
```
Mehrere HTML-Elemente können hierbei durch Kommas getrennt werden:  
```CSS
  h1, h2, h3{color:red;}
```
Dies gilt grundsätzlich auch für HTML-Klassen und Ids.

### HTML-Klassen
HTML Klassen werden mit einem **führenden Punkt** selektiert:  
```CSS
.wichtig{
    color:red;
    background-color:yellow;
    }
```
Im HTML-Code wird die Klasse mit dem Zusatz **class** definiert:  
```HTML
<div class="wichtig">
Dieser Text wird mit roter Schrift auf gelbem Grund dargestellt.  
</div>
``` 
Damit können mehrere gleichartig formatierte Bereiche in einem Text erzeugt werden.
### HTML-Ids
Mit Ids können einzelne HTML-Elemente formatiert werden. Im CSS werden sie mit einem **führenden #** defininert:  
```CSS
#impressum{
    color:red;
    font-size:small;
    text-align:right;
}
```
Der Text wird rechtsbündig, mit kleiner roter Schrift dargestellt.  
```HTML
<div id="impressum">
2024 Gymnasium Waldkraiburg
</div>
```
### Universalselektor
Mit dem Universalselektor <b>*</b> können die CSS-Attribute für alle HTML-Element geändert werden:  
```CSS
*{
    margin:0px;
}
```
Mit dieser Regel wird der Außenabstand aller HTML-Elemente auf 0 gesetzt. Damit werden die Standard-Einstellungen des Browsers überschrieben.  

## Rahmen
Das **border**-Attribut besteht aus drei Untereinheiten:  
```CSS
table, tr, td{
    border-width: 1px;
    border-style: solid;
    border-color: gray;
}
```
Diese drei Attribute können in einem Aufruf gesetzt werden:
```CSS
table, tr, td{
    border: 1px solid gray;
}
```
Das Problem hierbei ist, dass alle Rahmenlinien doppelt gesetzt werden. Dies kann durch das Attribut **border-collapse** beseitigt werden:
```CSS
table, tr, td{
    border: 1px solid gray;
    border-collapse: collapse;
}
```
## Abstände
Im **Box**-Modell von CSS werden Abstände zwischen Inhalt und Rahmen definiert.
- width: Breite des Inhalts
- height: Höhe des Inhalts
- padding: Abstand des Rahmens vom Inhalt
- border: Breite des Rahmens
- margin: Abstand des Rahmens zum nächsten Inhalt.  

Bei **padding**, **border** und **margin** können zusätzlich die vier Seiten definiert werden:  
- margin-top: 10px;
- margin-right: 5px;
- margin-bottom: 10 px;
- margin-left: 5px;

Wichtig ist in diesem Zusammenhang, dass **padding, border und margin** zu den Werte von **width** und **height** des Inhalts addiert werden. 

## Cascade
CSS ist kaskaden- oder stufenartig aufgebaut (Cascading Style Sheet). Die sogenannte kleine Cascade umfasst dabei drei Stufen:    
### Stufe 0: Grundeinstellungen
Wenn für ein Attribut keine Regeln vorgegeben sind, wird die Grundeinstellung des Browsers verwendet.
### Stufe 1: Vererbung
Eine Kind-Klasse erbt die Attribute der Elternklasse.  
Bsp.:
```HTML
<body>
    <h1>Überschrift</h1>
</body>
```
```CSS
body{color:red;}
```
Die Überschrift wird rot dargestellt, da die **h1**-Klasse als Kind das Attribut der **body**-Klasse erbt.  
Aus diesem Grund sollten Attribute, die das ganze HTML-Dokument beeinflussen, möglichst weit oben im Vererbungsbaum gesetzt werden: **body** oder **html**.
### Stufe 2: Direkte Attributzuweisung
Die Vererbung kann durch eine direkte Zuweisung von Attributen zu HTML-Klassen überschrieben werden.  
Bsp.:
```HTML
<body>
    <h1>Überschrift</h1>
</body>
```
```CSS
body{color:red;}
h1{color:yellow;}
```
In diesem Fall wird die Überschrift gelb dargestellt.
### Reihenfolge gleichartiger Zuweisungen
Werden zwei Attribute auf der gleichen Ebene zweimal zugewiesen, so gilt die Zuweisung, die später erfolgt.  
Bsp.:
```HTML
<body>
    <h1>Überschrift</h1>
</body>
```
```CSS
h1{ color:yellow;
    color: red;
}
```
In diesem Fall wird die Überschrift rot dargestellt, da die zweite Zuweisung die erste überschreibt.  
Besonders relevant wird diese Regel bei der **inline**-Zuweisung:  
```HTML
<body>
    <h1 style="color: blue;">Überschrift</h1>
</body>
```
In diesem Fall wird die Überschrift immer blau dargestellt, da alle Zuweisungen aus der CSS-Datei durch die inline-Zuweisung überschrieben werden. Sie ist immer die letzte und damit entscheidende Zuweisung.

## Hyperlinks
In CSS kann das Aussehen von Hyperlinks angepasst werden:
```CSS
/* Vor dem Klick*/
a:link{
    color:green;
}

/* Nach dem Klick*/
a:visited{
    color:red;
}

/* Beim Klick */
a:active {
    color:gray;
}

/* Beim Hovern mit der Maus*/
a:hover{
    color:black;
}

/* Beim Durchklicken mit der Tab-Taste*/
a:focus{
    color:black;
}
```





