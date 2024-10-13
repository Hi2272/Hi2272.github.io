 <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Klassen und Objekte in Javascript
## 1. Aufbau einer Klasse
Quellen:  
 [TheCodingTrain: Klassen](https://thecodingtrain.com/tracks/code-programming-with-p5-js/code/6-objects/2-classes)  
  [TheCodingTrain: Parameter](https://thecodingtrain.com/tracks/code-programming-with-p5-js/code/6-objects/2-classes)  

```Javascript
class Bubble{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    setX(x){
        this.x=x;
    }
}

let bubble=new Bubble(100,50);

```
- Klassendefinitionen werden mit dem Schlüsselwort **class** eingeleitet.
- Der Konstruktor heißt unabhängig vom Namen der Klasse immer **constructor**.
- Attribute der Klasse werden im Konstruktor mit **this.Attributname** deklariert und initialisiert.
- Das Schlüsselwort **this** verweist auf das aktuell  erzeugte Objekt der Klasse
- Methoden werden ohne Zusatz von function definert.
- Objekte werden mit dem **new** Operator erzeugt.

## 2. Vererbung in Javascript

```Javascript
class closedShape extends Shape{
  constructor(x,y,stroke,strokeWeight,fill){
    super(x,y,stroke,strokeWeight);
    this.fill=fill;
  }
  draw(){
    super.draw();
    fill(this.fill);
  }
}
```
- Das Schlüsselwort **extends** zeigt an, dass sich eine Klasse von einer Oberklasse ableitet.
- super(...) ruft im Konstruktor den Konstruktor der Oberklasse auf. Dieser Aufruf muss immer in der 1. Zeile des Konstruktors stehen.
- Methoden können in der Unterklasse überschrieben werden.   
  Hier wird die **draw()**-Methode überschrieben.
- mit super.methode() können Methoden der Oberklasse aufgerufen werden.

**Beispielcode mit mehrfacher Vererbung**
```Javascript
  
class Shape{
  constructor(x,y,stroke,strokeWeight){
    this.x=x;
    this.y=y;
    this.stroke=stroke;
    this.strokeWeight=strokeWeight;
  }
  moveX(dx){
    this.x=this.x+dx;
  }
  moveY(dy){
    this.y=this.y+dy;
  }
  moveTo(x,y){
    this.x=x;
    this.y=y;
  }
  draw(){
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
  }
}

class closedShape extends Shape{
  constructor(x,y,stroke,strokeWeight,fill){
    super(x,y,stroke,strokeWeight);
    this.fill=fill;
  }
  draw(){
    super.draw();
    fill(this.fill);
  }
}

class Kreis extends closedShape{
  constructor(x,y,r,stroke, strokeWeight,fill){
    super(x,y,stroke,strokeWeight,fill);
    this.r=r;
  }
  draw(){
    super.draw();
    circle(this.x,this.y,this.r);
  }
}

function setup() {
  createCanvas(400, 400);
  k=new  Kreis(100,100,20,"red",3,"yellow");
}

function draw() {
  background(220);
  k.draw();
  k.moveX(2);
}
```