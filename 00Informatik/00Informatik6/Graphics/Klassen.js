function cardFormat(k, s) {
    k.innerHTML = s;
    k.style.borderStyle = "solid";
    k.style.borderRadius = "10px";
    k.style.margin = "10px";
    k.style.backgroundColor = "white";
}

class Shape {
    constructor(nam, klasse) {
        this.nam = nam;
        this.klasse = klasse;
        this.x = 50;
        this.y = 50;
        this.stroke = 'black';
        this.strokeWidth = 1;
    }

    setFill(fill) { }
    setPoints(xyz) { }
    setRadius(r) { }
    setWidth(w) { }
    setHeight(h) { }

    draw() {
        document.getElementById('svg').appendChild(this.svg());
        console.log(document.getElementById("svg").innerHTML);
    }

    drawCard() {
        var attribute = Object.entries(this);
        var s = attribute[0][1] + ": " + attribute[1][1] + "<hr>";  // Name:Klasse
        for (i = 2; i < attribute.length; i++) {
            s = s + attribute[i][0] + ": " + attribute[i][1] + "<br>";
        }
        let k = document.getElementById("Karte");
        cardFormat(k, s);
    }

    setStroke(stroke) {
        this.stroke = stroke;
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
    }

    moveX(dx) {
        this.x = parseInt(this.x) + parseInt(dx);
    }

    moveY(dy) {
        this.y = parseInt(this.y) + parseInt(dy);
    }
    moveTo(xy) {
        let d = xy.split(",");
        if (d.length != 2) {
            error(-1, "Fehler bei moveTo(x,y). Hier sind zwei Parameter-Werte nötig!");
        } else {
            this.x = parseInt(d[0]);
            this.y = parseInt(d[1]);
        }
 }
copyPaste(oNeu,oAlt,dx,dy){
    oNeu.x=oAlt.x+dx;
    oNeu.y=oAlt.y+dy;
    oNeu.stroke=oAlt.stroke;
    oNeu.strokeWidth=oAlt.strokeWidth;
    return oNeu;
} 
}

class ClosedShape extends Shape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.fill = "blue";
    }
    setFill(fill) {
        this.fill = fill;
    }
    copyPaste(oNeu,oAlt,dx,dy){
        oNeu=super.copyPaste(oNeu,oAlt,dx,dy);
        oNeu.fill=oAlt.fill;
        return oNeu;
    }

}

class Circle extends ClosedShape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.radius = 20;
        this.draw();
        this.drawCard();
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('r', this.radius.toString());
        s.setAttribute('cx', this.x.toString());
        s.setAttribute('cy', this.y.toString());
        s.setAttribute('opacity', (document.getElementById("opacity").value / 100).toString());

        return s;
    }

    setRadius(r) {
        this.radius = r;
    }

    setPoints(xy) {
        this.moveTo(xy);
    }

    copyPaste(nam,dx,dy){
        let o=new Circle(nam,this.klasse);
        o=super.copyPaste(o,this,dx,dy);
        o.radius=this.radius;
        return o;
    }

}


class Rect extends ClosedShape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.width = 50;
        this.height = 20;
        this.draw();
        this.drawCard();
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('width', this.width.toString());
        s.setAttribute('height', this.height.toString());
        s.setAttribute('x', this.x.toString());
        s.setAttribute('y', this.y.toString());
        s.setAttribute('opacity', (document.getElementById("opacity").value / 100).toString());

        return s;
    }
    setWidth(w) {
        this.width = parseInt(w);
    }
    setHeight(h) {
        this.height = parseInt(h);
    }

    setPoints(xyxy) {
        let d = xyxy.split(",");
        if (d.length != 4) {
            error(-1, "Fehler bei setpoint(x,y,x1,y1). Ein Rechteck braucht vier Parameter-Werte!");
        } else {
            if (parseInt(d[0]) > parseInt(d[2])) { let z = d[0]; d[0] = d[2]; d[2] = z; }
            if (parseInt(d[1]) > parseInt(d[3])) { let z = d[1]; d[1] = d[3]; d[3] = z; }

            this.x = parseInt(d[0]);
            this.y = parseInt(d[1]);
            this.width = parseInt(d[2]) - parseInt(d[0]);
            this.height = parseInt(d[3]) - parseInt(d[1]);

        }
    }
    copyPaste(nam,dx,dy){
        let o=new Rect(nam,this.klasse);
        o=super.copyPaste(o,this,dx,dy);
        o.width=this.width;
        o.height=this.height;
        return o;
    }


}

class Line extends Shape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.dx = 50;
        this.dy = 100;
        this.draw();
        this.drawCard();
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        s.setAttribute('id', this.nam);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('x1', this.x.toString());
        s.setAttribute('y1', this.y.toString());
        s.setAttribute('x2', (this.x+this.dx).toString());
        s.setAttribute('y2', (this.y+this.dy).toString());
        s.setAttribute('opacity', (document.getElementById("opacity").value / 100).toString());

        return s;
    }

    setPoints(xyxy) {
        let d = xyxy.split(",");
        if (d.length != 4) {
            error(-1, "Fehler bei setpoint(x,y,x1,y1). Eine Linie braucht vier Parameter-Werte!");
        } else {
            this.x = parseInt(d[0]);
            this.y = parseInt(d[1]);
            this.dx = parseInt(d[2])-this.x;
            this.dy = parseInt(d[3])-this.y;
        }
    }

    moveTo(xy) {
        let d = xy.split(",");
        this.x = parseInt(d[0]);
        this.y = parseInt(d[1]);
    }
  
    moveX(dx) {
        this.x = parseInt(this.x) + parseInt(dx);
    }
    moveY(dy) {
        this.y = parseInt(this.y) + parseInt(dy);
    }

    copyPaste(nam,dx,dy){
        let o=new Line(nam,this.klasse);
        o=super.copyPaste(o,this,dx,dy);
        o.dx=this.dx;
        o.dy=this.dy;

        return o;
    }

}

class Triangle extends ClosedShape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.dx1 = 100;
        this.dy1 = 0;
        this.dx2 = 50;
        this.dy2 = 50;
        this.draw();
        this.drawCard();
    }

    setPoints(xyxy) {
        let d = xyxy.split(",");
        if (d.length != 6) {
            error(-1, "Fehler bei setpoint(x,y,x1,y1). Ein Dreieck braucht sechs Parameter-Werte!");
        } else {
            this.x = parseInt(d[0]);
            this.y = parseInt(d[1]);
            this.dx1 = parseInt(d[2])-this.x;
            this.dy1 = parseInt(d[3])-this.y;
            this.dx2 = parseInt(d[4])-this.x;
            this.dy2 = parseInt(d[5])-this.y;

        }
    }

    moveTo(xy) {
        let d = xy.split(",");
        this.x = parseInt(d[0]);
        this.y = parseInt(d[1]);
    }
    moveX(dx) {
        this.x = parseInt(this.x) + parseInt(dx);
    }
    moveY(dy) {
        this.y = parseInt(this.y) + parseInt(dy);
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('points', this.x.toString() + "," + this.y.toString() + ","
            + (this.x+this.dx1).toString() + "," + (this.y+this.dy1).toString() + ","
            + (this.x+this.dx2).toString() + "," + (this.y+this.dy2).toString());

        s.setAttribute('opacity', (document.getElementById("opacity").value / 100).toString());
        return s;
    }

    copyPaste(nam,dx,dy){

        let o=new Triangle(nam,this.klasse);
        o=super.copyPaste(o,this,dx,dy);
        o.dx1=this.dx1;
        o.dy1=this.dy1;
        o.dx2=this.dx2;
        o.dy2=this.dy2;
        return o;
    }


}

class Group {
    constructor(nam, klasse) {
        this.nam = nam;
        this.klasse = klasse;
        this.kinder = new Array();
    }

    add(n) {
        let o;
        for (i = 0; i < objekte.length; i++) {
            if (objekte[i].nam.toUpperCase() == n.toUpperCase()) {
                o = objekte[i];
            }
        }
        if (typeof o == "undefined") {
            error(-1, "Das Objekt " + n + " kenne ich nicht. Ich kann es nicht zur Gruppe " + this.nam + " hinzufügen.");
        } else {
            if (!this.kinder.includes(o)) {
                this.kinder.push(o);
            } else {
                error(-1, "Die Gruppe " + this.nam + " enthält schon ein Objekt mit dem Namen " + n + ".");
            }
        }
    }

    draw() {
    }

    setStroke(stroke) {
        this.kinder.forEach(element => {
            element.setStroke(stroke);
        });
    }

    setStrokeWidth(width) {
        this.kinder.forEach(element => {
            element.setStrokeWidth(width);
        });
    }

    moveTo(xy) {
        this.kinder.forEach(element => {
            element.moveTo(xy);
        });
    }

    moveX(dx) {
        this.kinder.forEach(element => {
            element.moveX(dx);
        });
    }

    moveY(dy) {
        this.kinder.forEach(element => {
            element.moveY(dy);
        });
    }

    setFill(fill) {
        this.kinder.forEach(element => {
            element.setFill(fill);
        });
    }

    setRadius(r) {
        this.kinder.forEach(element => {
            element.setRadius(r);
        });
    }

    setPoints(xyz) {
        this.kinder.forEach(element => {
            element.setPoints(xyz);
        });
    }
    setWidth(w) {
        this.kinder.forEach(element => {
            element.setWidth(w);
        });
    }
    setHeight(h) {
        this.kinder.forEach(element => {
            element.setHeight(h);
        });
    }

    drawCard() {
        var s = this.nam + ": " + this.klasse.toUpperCase() + "<hr>";  // Name:Klasse
        for (i = 0; i < this.kinder.length; i++) {
            s = s + this.kinder[i].nam + ":" + this.kinder[i].klasse.toUpperCase() + "<br>";
        }
        let k = document.getElementById("Karte");
        cardFormat(k, s);
    }

    copyPaste(nam,dx,dy){
        let o=new Group(nam,"Group");
        this.kinder.forEach(element => {
            o.kinder.push(element.copyPaste(nam+element.nam,dx,dy));
        });
        return o;
    }


}



