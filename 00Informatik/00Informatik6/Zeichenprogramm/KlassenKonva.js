
class Kreis extends Konva.Circle {
    constructor(nam,x1, y1, radius, fill, stroke, strokeWidth, fak) {
        super({
            x: x1 * fak,
            y: y1 * fak,
            radius: radius * fak,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth,
            draggable:true
        });
        this.klasse="Kreis";
        this.nam=nam;
  
    }

}


class Linie extends Konva.Line {
    constructor(nam,x1, y1, x2, y2, stroke, strokeWidth, fak) {
        super({
            points: [x1 * fak, y1 * fak, x2 * fak, y2 * fak],
            stroke,
            strokeWidth,
            draggable:true
        });
        this.klasse="Linie";
        this.nam=nam;
    }

}

class Rechteck extends Konva.Rect {
    constructor(nam,x1, y1, w, h, f, s, sw, fak) {
        super({
            x: x1 * fak,
            y: y1 * fak,
            width: w * fak,
            height: h * fak,
            fill: f,
            stroke: s,
            strokeWidth: sw,
            draggable:true
        });
        this.klasse="Rechteck";
        this.nam=nam;
  
    }
}

class Txt extends Konva.Text {
    constructor(x1, y1, txt, size, fill, fak) {
        super({
            x: x1 * fak,
            y: y1 * fak,
            text: txt,
            fontSize: size,
            fontFamily: 'Calibri',
            fill: fill,
            draggable:true
        })
    }
}

class Dreieck extends Konva.Line{
    constructor(nam,x1, y1, x2, y2, x3, y3, fill, stroke, strokeWidth, fak) {
        super({
            points: [x1 * fak, y1 * fak, x2 * fak, y2 * fak, x3*fak, y3*fak],
            stroke,
            strokeWidth,
            closed:true,
            fill:fill,
            draggable:true,
        });
        this.klasse="Dreieck";
        this.nam=nam;
  
    }
    
}

