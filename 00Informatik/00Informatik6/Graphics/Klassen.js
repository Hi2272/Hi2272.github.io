function y(y) {
    if (document.getElementById("yAchse").checked) {
        return y;
    } else {
        return 200 - y;
    }
}

function cardFormat(k, s) {
    k.innerHTML = s;
    k.style.borderStyle = "solid";
    k.style.borderRadius = "10px";
    k.style.margin = "10px";
    k.style.backgroundColor = "white";
}

function runde(s) {
    let num = parseFloat(s);

    if (isNaN(num)) {
        return atl(s);
    } else {
        num = num.toFixed(0);
        return num.toString();
    }
}

function atl(s) {
    let dict = {
        "stroke": "linienfarbe",
        "strokewidth": "linienstärke",
        "opacity": "deckkraft",
        "fill": "füllfarbe",
        "width": "breite",
        "height": "höhe",
        "circle": "kreis",
        "rect": "Rechteck",
        "rectangle": "Rechteck",
        "triangle": "Dreieck",
        "line": "Linie",
        "blue": "blau",
        "green": "grün",
        "yellow": "gelb",
        "red": "rot",
        "white": "weiß",
        "black": "schwarz",
        "lightblue": "hellblau",
        "lightgreen": "hellgrün",
        "violet": "violett",
        "lightyellow": "hellgelb",
        "brown": "braun",
        "silver": "silber",
        "darkblue": "dunkelblau",
        "olive": "olivgrün",
        "grey": "grau",
        "lightgrey": "hellgrau",
        "none": "keine"
    };
    console.log(s);
    s = s.toLowerCase();
    let tl = document.getElementById("translate").checked;

    if (s in dict && tl) {
        return dict[s];
    } else {
        return s;
    }
}


class Shape {
    constructor(nam, klasse) {
        this.nam = nam;
        this.klasse = klasse;
        this.x = 50;
        this.y = 50;
        this.stroke = 'black';
        this.strokeWidth = 1;
        this.opacity = 100;

    }

    setFill(fill) { }
    setPoints(xyz) { }
    setRadius(r) { }
    setWidth(w) { }
    setHeight(h) { }

    checkAttribut(linie, attr) {
        let gefunden = false;
        var attribute = Object.entries(this);
        for (let i = 2; i < attribute.length; i++) {
            let s = atl(attribute[i][0]).toLowerCase();
            if (s == atl(attr).toLowerCase()) {
                gefunden = true;
                i = attribute.length;
            }
        }
        if (!gefunden) {
            error(linie, "Das Objekt " + this.nam + " hat kein Attribut " + attr + ".");
            return false;
        } else {
            return true;
        }
    }


    methodencheck(s) {
        let dict = {
            "setzex": "setx",
            "setx": "setx",

            "setzey": "sety",
            "sety": "sety",

            "setopacity": "setopac",
            "setdeckkraft": "setopac",
            "setzedeckkraft": "setopac",
            "deckkraftsetzen": "setopac",
            "setopac": "setopac",

            "verschiebex": "movex",
            "verschiebenx": "movex",
            "movex": "movex",

            "verschiebey": "movey",
            "verschiebeny": "movey",
            "movey": "movey",

            "verschiebezu": "setxy",
            "verschiebenzu": "setxy",
            "verschiebennach": "setxy",
            "verschiebenach": "setxy",
            "moveto": "setxy",
            "setzexy":"setxy",
            "xysetzen":"setxy",
            "setxy": "setxy",

            "dupliziere": "copypaste",
            "duplizieren": "copypaste",
            "duplicate": "copypaste",
            "verdoppele": "copypaste",
            "copypaste": "copypaste",
            "verdopple": "copypaste",
            "verdoppeln": "copypaste",

            
            

            "setlinienfarbe": "setstroke",
            "setzelinienfarbe": "setstroke",
            "linienfarbesetzen": "setstroke",
            "setstroke": "setstroke",

            "linienbreitesetzen": "setstrokewidth",
            "setzelinienbreite": "setstrokewidth",
            "setlinienbreite": "setstrokewidth",
            "linienstärkesetzen": "setstrokewidth",
            "setlinienstärke": "setstrokewidth",
            "setzelinienstärke": "setstrokewidth",
            "setstrokewidth": "setstrokewidth",

            "skaliere": "scale",
            "strecke": "scale",
            "vergrößere": "scale",
            "vergrössere": "scale",
            "vergroessere": "scale",
            "vergroeßere": "scale",
            "verkleinere": "scale",
            "scale": "scale",

        };
        if (s in dict) {
            return dict[s];
        } else {
            return "Fehler";
        }
    }
    draw() {
        document.getElementById('svg').appendChild(this.svg());
        //      console.log(document.getElementById("svg").innerHTML);
    }

    drawCard() {
        var attribute = Object.entries(this);
        var s = attribute[0][1] + ": " + atl(attribute[1][1]).toUpperCase() + "<hr>";  // Name:Klasse
        for (let i = 2; i < attribute.length; i++) {
            s = s + atl(attribute[i][0]) + " = " + runde(attribute[i][1]) + "<br>";
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

    setOpac(opacity) {
        this.opacity = opacity;
    }
    moveX(dx) {
        this.x = parseFloat(this.x) + parseFloat(dx);
    }

    moveY(dy) {
        this.y = parseFloat(this.y) + parseFloat(dy);
    }

    setX(x) {
        this.x = parseFloat(x);
    }
    setY(y) {
        this.y = parseFloat(y);
    }

    moveTo(xy) {
        let d = xy.split(",");
        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
    }

    copyPaste(oNeu, oAlt, dx, dy) {
        oNeu.x = oAlt.x + dx;
        oNeu.y = oAlt.y + dy;
        oNeu.stroke = oAlt.stroke;
        oNeu.strokeWidth = oAlt.strokeWidth;
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
    copyPaste(oNeu, oAlt, dx, dy) {
        oNeu = super.copyPaste(oNeu, oAlt, dx, dy);
        oNeu.fill = oAlt.fill;
        return oNeu;
    }
    methodencheck(s) {
        let s1 = super.methodencheck(s);
        let dict = {
            "setzefüllfarbe": "setfill",
            "setfüllfarbe": "setfill",
            "füllfarbesetzen": "setfill",
            "setzefuellfarbe": "setfill",
            "setfuellfarbe": "setfill",
            "fuellfarbesetzen": "setfill",
            "setzefarbe": "setfill",
            "setfarbe": "setfill",
            "farbesetzen": "setfill",
            "setcolor": "setfill",
            "setfill": "setfill"
        };
        if (s1 == "Fehler") {
            if (s in dict) {
                s1 = dict[s];
            } else {
                s1 = "Fehler";
            }
        }
        return s1;
    }
}

class Circle extends ClosedShape {
    constructor(nam, klasse) {
        super(nam, klasse);
        this.radius = 20;
        this.draw();
        this.drawCard();
    }
    getXYZahl() {
        return 2;
    }

    methodencheck(s) {
        let s1 = super.methodencheck(s);
        let dict = {
            "setzeradius": "setradius",
            "radiussetzen": "setradius",
            "setradius": "setradius",
  
            "mittesetzen": "setxy",
            "setzemitte": "setxy",
            "setmitte": "setxy",

            "setmittelpunkt": "setxy",
            "setzemittelpunkt": "setxy",
            "mittelpunktsetzen": "setxy"
        };
        if (s1 == "Fehler") {
            if (s in dict) {
                s1 = dict[s];
            } else {
                s1 = "Fehler";
            }
        }
        return s1;
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('r', this.radius.toString());
        s.setAttribute('cx', this.x.toString());
        s.setAttribute('cy', y(this.y).toString());
        s.setAttribute('opacity', ((this.opacity / 100) * (document.getElementById("opacity").value / 100)).toString());

        return s;
    }

    setRadius(r) {
        this.radius = r;
    }

    setPoints(xy) {
        this.moveTo(xy);
    }

    copyPaste(nam, dx, dy) {
        let o = new Circle(nam, this.klasse);
        o = super.copyPaste(o, this, dx, dy);
        o.radius = this.radius;
        return o;
    }

    scale(f) {
        this.radius = this.radius * f / 100;
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
    getXYZahl() {
        return 4;
    }

    methodencheck(s) {
        let s1 = super.methodencheck(s);
        let dict = {
            "setzebreite": "setwidth",
            "setbreite": "setwidth",
            "breitesetzen": "setwidth",
            "setwidth": "setwidth",

            "setzehöhe": "setheight",
            "sethöhe": "setheight",
            "höhesetzen": "setheight",
        
            "setzehoehe": "setheight",
            "sethoehe": "setheight",
            "hoehesetzen": "setheight",
            "setheight": "setheight",

            "setecken": "setpoints",
            "eckensetzen": "setpoints",
            "setzeecken": "setpoints",
        
            "setzepunkte": "setpoints",
            "setpunkte": "setpoints",
            "punktesetzen": "setpoints",
            "setcorners":"setpoints",
            "setpoints": "setpoints"
        };
        if (s1 == "Fehler") {
            if (s in dict) {
                s1 = dict[s];
            } else {
                s1 = "Fehler";
            }
        }
        return s1;
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('width', this.width.toString());
        s.setAttribute('x', this.x.toString());
        s.setAttribute('opacity', ((this.opacity / 100) * (document.getElementById("opacity").value / 100)).toString());

        if (document.getElementById("yAchse").checked) {
            s.setAttribute('height', this.height.toString());
            s.setAttribute('y', this.y.toString());
        } else {
            let yneu = y(this.y + this.height);
            s.setAttribute('height', this.height.toString());
            s.setAttribute('y', yneu.toString());

        }

        return s;
    }
    setWidth(w) {
        this.width = parseFloat(w);
        if (this.width < 0) {
            this.width = -1 * this.width;
            this.x = this.x - this.width;
        }
    }
    setHeight(h) {
        this.height = parseFloat(h);
        if (this.height < 0) {
            this.height = -1 * this.height;
            this.y = this.y - this.height;
        }

    }
    setPoints(xyxy) {
        let d = xyxy.split(",");
        if (parseFloat(d[0]) > parseFloat(d[2])) { let z = d[0]; d[0] = d[2]; d[2] = z; }
        if (parseFloat(d[1]) > parseFloat(d[3])) { let z = d[1]; d[1] = d[3]; d[3] = z; }

        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
        this.width = parseFloat(d[2]) - parseFloat(d[0]);
        this.height = parseFloat(d[3]) - parseFloat(d[1]);
    }

    copyPaste(nam, dx, dy) {
        let o = new Rect(nam, this.klasse);
        o = super.copyPaste(o, this, dx, dy);
        o.width = this.width;
        o.height = this.height;
        return o;
    }


    scale(f) {
        this.width = this.width * f / 100;
        this.height = this.height * f / 100;
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
    getXYZahl() {
        return 4;
    }

    methodencheck(s) {
        let s1 = super.methodencheck(s);
        let dict = {
            "eckensetzen":"setpoints",
            "setzeecken":"setpoints",
            "setecken":"setpoints",
            "setzepunkte": "setpoints",
            "setpunkte": "setpoints",
            "punktesetzen": "setpoints",
            "setcorners":"setpoints",
            "setpoints": "setpoints"
        };
        if (s1 == "Fehler") {
            if (s in dict) {
                s1 = dict[s];
            } else {
                s1 = "Fehler";
            }
        }
        return s1;
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        s.setAttribute('id', this.nam);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('x1', this.x.toString());
        s.setAttribute('y1', y(this.y).toString());
        s.setAttribute('x2', (this.x + this.dx).toString());
        s.setAttribute('y2', y(this.y + this.dy).toString());
        s.setAttribute('opacity', ((this.opacity / 100) * (document.getElementById("opacity").value / 100)).toString());

        return s;
    }

    setPoints(xyxy) {
        let d = xyxy.split(",");
        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
        this.dx = parseFloat(d[2]) - this.x;
        this.dy = parseFloat(d[3]) - this.y;
    }

    moveTo(xy) {
        let d = xy.split(",");
        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
    }

    moveX(dx) {
        this.x = parseFloat(this.x) + parseFloat(dx);
    }
    moveY(dy) {
        this.y = parseFloat(this.y) + parseFloat(dy);
    }

    copyPaste(nam, dx, dy) {
        let o = new Line(nam, this.klasse);
        o = super.copyPaste(o, this, dx, dy);
        o.dx = this.dx;
        o.dy = this.dy;

        return o;
    }


    scale(f) {
        this.dx = this.dx * f / 100;
        this.dy = this.dy * f / 100;
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
    getXYZahl() {
        return 6;
    }

    methodencheck(s) {
        let s1 = super.methodencheck(s);
        let dict = {
            "setzepunkte": "setpoints",
            "setpunkte": "setpoints",
            "punktesetzen": "setpoints",
            "eckensetzen": "setpoints",
            "setzeecken": "setpoints",
            "setecken": "setpoints",
            "setcorners":"setpoints",
            "setpoints": "setpoints"
        };
        if (s1 == "Fehler") {
            if (s in dict) {
                s1 = dict[s];
            } else {
                s1 = "Fehler";
            }
        }
        return s1;
    }

    setPoints(xyxy) {
        let d = xyxy.split(",");
        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
        this.dx1 = parseFloat(d[2]) - this.x;
        this.dy1 = parseFloat(d[3]) - this.y;
        this.dx2 = parseFloat(d[4]) - this.x;
        this.dy2 = parseFloat(d[5]) - this.y;
    }

    moveTo(xy) {
        let d = xy.split(",");
        this.x = parseFloat(d[0]);
        this.y = parseFloat(d[1]);
    }
    moveX(dx) {
        this.x = parseFloat(this.x) + parseFloat(dx);
    }
    moveY(dy) {
        this.y = parseFloat(this.y) + parseFloat(dy);
    }

    svg() {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        s.setAttribute('id', this.nam);
        s.setAttribute('fill', this.fill);
        s.setAttribute('stroke', this.stroke);
        s.setAttribute('stroke-width', this.strokeWidth);

        s.setAttribute('points', this.x.toString() + "," + y(this.y).toString() + ","
            + (this.x + this.dx1).toString() + "," + y(this.y + this.dy1).toString() + ","
            + (this.x + this.dx2).toString() + "," + y(this.y + this.dy2).toString());

        s.setAttribute('opacity', ((this.opacity / 100) * (document.getElementById("opacity").value / 100)).toString());
        return s;
    }

    copyPaste(nam, dx, dy) {

        let o = new Triangle(nam, this.klasse);
        o = super.copyPaste(o, this, dx, dy);
        o.dx1 = this.dx1;
        o.dy1 = this.dy1;
        o.dx2 = this.dx2;
        o.dy2 = this.dy2;
        return o;
    }

    scale(f) {
        this.dx1 = this.dx1 * f / 100;
        this.dy1 = this.dy1 * f / 100;
        this.dx2 = this.dx2 * f / 100;
        this.dy2 = this.dy2 * f / 100;
    }

}

class Group {
    constructor(nam, klasse) {
        this.nam = nam;
        this.klasse = klasse;
        this.kinder = new Array();
        this.x = 0;
        this.y = 0;
    }

    methodencheck(s) {
        let s1 = "Fehler";
        let dict = {
            "schlucke": "add",
            "fügezu": "add",
            "fuegezu": "add",
            "hinzufügen": "add",
            "hinzufuegen": "add",
            "addiere":"add",
            "add": "add"
        };

        if (s in dict) {
            return dict[s];
        } else {
            for (let i=0;i<this.kinder.length;i++){
                s1 = this.kinder[i].methodencheck(s);
                if (s1 == "Fehler") {
                  i=this.kinder.length+1;
                }
            }
            return s1;
        }
    }

    checkAttribut(linie, attr) {
        error(linie, "Bei Objekten der Klasse Gruppe kannst du keine Attribute-Werte zuweisen.");
        return false;
    }


    add(parameter) {
        let p = parameter.split(",");
        p.forEach(n => {
            let o;
            for (let i = 0; i < objekte.length; i++) {
                if (objekte[i].nam.toUpperCase() == n.toUpperCase()) {
                    o = objekte[i];
                }
            }
            if (typeof o == "undefined") {
                error("", "Das Objekt " + n + " kenne ich nicht. Ich kann es nicht zur Gruppe " + this.nam + " hinzufügen.");
            } else if (o.constructor.name == "Group") {
                error("", "Zur Gruppe " + this.nam + " kann keine weitere Gruppe " + n + " hinzugefügt werden!");
            } else {
                if (!this.kinder.includes(o)) {
                    this.kinder.push(o);
                    this.x = this.kinder[0].x;
                    this.y = this.kinder[0].y;
            
                } else {
                    error("", "Die Gruppe " + this.nam + " enthält schon ein Objekt mit dem Namen " + n + ".");
                }
            }
        });
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



    setX(x) {
        let x0 = this.kinder[0].x;
        this.kinder[0].setX(x);

        let dx = this.kinder[0].x - x0;

        for (let i = 1; i < this.kinder.length; i++) {
            let ziel = (this.kinder[i].x + dx).toString();
            this.kinder[i].setX(ziel);
        }
    }

    setY(y) {
        let y0 = this.kinder[0].y;
        this.kinder[0].setY(y);

        let dy = this.kinder[0].y - y0;

        for (let i = 1; i < this.kinder.length; i++) {
            let ziel = (this.kinder[i].y + dy).toString();
            this.kinder[i].setY(ziel);
        }
    }


    moveTo(xy) {
        let x0 = this.kinder[0].x;
        let y0 = this.kinder[0].y;
        this.kinder[0].moveTo(xy);

        let dx = this.kinder[0].x - x0;
        let dy = this.kinder[0].y - y0;

        for (let i = 1; i < this.kinder.length; i++) {
            let ziel = (this.kinder[i].x + dx).toString() + "," + (this.kinder[i].y + dy).toString();
            this.kinder[i].moveTo(ziel);
        }
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

    scale(f) {
        this.kinder.forEach(element => {
            element.scale(f);
        });

        // Positionen skalieren

        let x0 = this.kinder[0].x;
        let y0 = this.kinder[0].y;
        for (let i = 1; i < this.kinder.length; i++) {
            let dx = this.kinder[i].x - x0;
            let dy = this.kinder[i].y - y0;
            dx = dx * f / 100;
            dy = dy * f / 100;
            this.kinder[i].x = x0 + dx;
            this.kinder[i].y = y0 + dy;
        }
    }

    drawCard() {
        var s = this.nam + ": " + this.klasse.toUpperCase() + "<hr>";  // Name:Klasse
        for (let i = 0; i < this.kinder.length; i++) {
            s = s + this.kinder[i].nam + ":" + atl(this.kinder[i].klasse).toUpperCase() + "<br>";
        }
        let k = document.getElementById("Karte");
        cardFormat(k, s);
    }

    copyPaste(nam, dx, dy) {
        let o = new Group(nam, "Group");
        o.x = this.x;
        o.y = this.y;
        this.kinder.forEach(element => {
            o.kinder.push(element.copyPaste(nam + element.nam, dx, dy));
        });
        return o;
    }


}



