class Shape{
    constructor(nam) {
        this.nam = nam;
        this.klasse="Shape";
        this.x = 50;
        this.y = 50;
        this.fill = 'red';
        this.stroke = 'black';
    }

    draw() {
        document.getElementById("svg").innerHTML = document.getElementById("svg").innerHTML + this.svg();
    }

    drawCard(){
        var attribute = Object.entries(this);
        var s=attribute[0][1]+": "+attribute[1][1]+"<hr>";  // Name:Klasse
        for (i=2;i<attribute.length;i++){
            s=s+attribute[i][0]+": "+attribute[i][1]+"<br>";
        }
        let k=document.getElementById("Karte");
        k.innerHTML=s;
        k.style.borderStyle="solid";
       
    }
    setFill(fill){
        this.fill=fill;
    }

    setStroke(stroke){
        this.stroke=stroke;
    }

    moveX(dx){
        this.x=parseInt(this.x)+parseInt(dx);
    }
    moveY(dy){
        this.y=parseInt(this.y)+parseInt(dy);        
    }
    moveTo(xy){
        let d=xy.split(",");
        this.x=parseInt(d[0]);
        this.y=parseInt(d[1]);
    }
}


class Circle extends Shape {
    constructor(nam) {
            super(nam);
        this.klasse = "Circle";
        this.radius = 20;
        this.draw();
        this.drawCard();
    }

    svg() {
        let s = "<circle id='" + this.nam + "'";
        s = s + " cx='" + this.x.toString() + "' cy='" + this.y.toString() + "' r='" + this.radius.toString() + "'";
        s = s + " fill='" + this.fill + "' stroke='" + this.stroke + "'/>";

        return s;
    }
    
    setRadius(r){
        this.radius=r;
    }

}


class Rect extends Shape{
    constructor(nam) {
        super(nam);
        this.klasse = "Rect";
        this.width = 50;
        this.height = 20;
        this.draw();
        this.drawCard();
    }

    svg() {
        let s = "<rect id='" + this.nam + "'";
        s = s + " x='" + this.x.toString() + "' y='" + this.y.toString() + "' width='" + this.width.toString() + "' height='" + this.height.toString() +"'";
        s = s + " fill='" + this.fill + "' stroke='" + this.stroke + "'/>";
        return s;
    }
    setWidth(w){
        this.width=parseInt(w);
    }    
    setHeight(h){
        this.height=parseInt(h);
    }
}

