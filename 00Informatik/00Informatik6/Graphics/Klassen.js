class Shape {
    constructor(nam, klasse) {
        this.nam = nam;
        this.klasse = klasse;
        this.x = 50;
        this.y = 50;
        this.stroke = 'black';
        this.strokeWidth = 1;
    }

    draw() {
        document.getElementById("svg").innerHTML = document.getElementById("svg").innerHTML + this.svg();
    }

    drawCard() {
        var attribute = Object.entries(this);
        var s = attribute[0][1] + ": " + attribute[1][1] + "<hr>";  // Name:Klasse
        for (i = 2; i < attribute.length; i++) {
            s = s + attribute[i][0] + ": " + attribute[i][1] + "<br>";
        }
        let k = document.getElementById("Karte");
        k.innerHTML = s;
        k.style.borderStyle = "solid";
        k.style.borderRadius="25px";
        k.style.margin="10px";
        k.style.backgroundColor="white";
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
}

class ClosedShape extends Shape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.fill = "blue";
    }
    setFill(fill) {
        this.fill = fill;
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
        let s = "<circle id='" + this.nam + "'";
        s = s + " cx='" + this.x.toString() + "' cy='" + this.y.toString() + "' r='" + this.radius.toString() + "'";
        s = s + " stroke-width='" + this.strokeWidth + "'";
        s = s + " fill='" + this.fill + "' stroke='" + this.stroke + "'/>";

        return s;
    }

    setRadius(r) {
        this.radius = r;
    }

    setPoints(xy) {
        this.moveTo(xy);
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
        let s = "<rect id='" + this.nam + "'";
        s = s + " x='" + this.x.toString() + "' y='" + this.y.toString() + "' width='" + this.width.toString() + "' height='" + this.height.toString() + "'";
        s = s + " stroke-width='" + this.strokeWidth + "'";
        s = s + " fill='" + this.fill + "' stroke='" + this.stroke + "'/>";
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


}

class Line extends Shape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.x1 = 100;
        this.y1 = 100;
        this.draw();
        this.drawCard();
    }

    svg() {
        let s = "<line id='" + this.nam + "'";
        s = s + " x1='" + this.x.toString() + "' y1='" + this.y.toString() + "'";
        s = s + " x2='" + this.x1.toString() + "' y2='" + this.y1.toString() + "'";
        s = s + " stroke-width='" + this.strokeWidth + "'";
        s = s + " stroke='" + this.stroke + "'/>";
        return s;
    }
    setPoints(xyxy) {
        let d = xyxy.split(",");
        if (d.length != 4) {
            error(-1, "Fehler bei setpoint(x,y,x1,y1). Eine Linie braucht vier Parameter-Werte!");
        } else {
            this.x = parseInt(d[0]);
            this.y = parseInt(d[1]);
            this.x1 = parseInt(d[2]);
            this.y1 = parseInt(d[3]);
        }
    }

    moveTo(xy) {
        let dx = parseInt(this.x1) - parseInt(this.x);
        let dy = parseInt(this.y1) - parseInt(this.y);
        let d = xy.split(",");
        this.x = parseInt(d[0]);
        this.y = parseInt(d[1]);
        this.x1 = parseInt(this.x) + dx;
        this.y1 = parseInt(this.y) + dy;

    }
    moveX(dx) {
        this.x = parseInt(this.x) + parseInt(dx);
        this.x1 = parseInt(this.x1) + parseInt(dx);
    }
    moveY(dy) {
        this.y = parseInt(this.y) + parseInt(dy);
        this.y1 = parseInt(this.y1) + parseInt(dy);
    }

}

class Triangle extends ClosedShape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.x1 = 100;
        this.y1 = 100;
        this.x2 = 75;
        this.y2 = 25;
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
            this.x1 = parseInt(d[2]);
            this.y1 = parseInt(d[3]);
            this.x2 = parseInt(d[4]);
            this.y2 = parseInt(d[5]);

        }
    }

    moveTo(xy) {
        let dx1 = parseInt(this.x1) - parseInt(this.x);
        let dy1 = parseInt(this.y1) - parseInt(this.y);
        let dx2 = parseInt(this.x2) - parseInt(this.x);
        let dy2 = parseInt(this.y2) - parseInt(this.y);
        let d = xy.split(",");
        this.x = parseInt(d[0]);
        this.y = parseInt(d[1]);
        this.x1 = parseInt(this.x) + dx1;
        this.y1 = parseInt(this.y) + dy1;
        this.x2 = parseInt(this.x) + dx2;
        this.y2 = parseInt(this.y) + dy2;

    }
    moveX(dx) {
        this.x = parseInt(this.x) + parseInt(dx);
        this.x1 = parseInt(this.x1) + parseInt(dx);
        this.x2 = parseInt(this.x2) + parseInt(dx);
    }
    moveY(dy) {
        this.y = parseInt(this.y) + parseInt(dy);
        this.y1 = parseInt(this.y1) + parseInt(dy);
        this.y2 = parseInt(this.y2) + parseInt(dy);
    }

    svg() {
        let s = "<polygon id='" + this.nam + "' points='";
        s = s + this.x.toString() + "," + this.y.toString() + ",";
        s = s + this.x1.toString() + "," + this.y1.toString() + ",";
        s = s + this.x2.toString() + "," + this.y2.toString() + "'";
        s = s + " stroke-width='" + this.strokeWidth + "'";
        s = s + " stroke='" + this.stroke + "' fill='" + this.fill + "'/>";
    
        return s;
    }


}




