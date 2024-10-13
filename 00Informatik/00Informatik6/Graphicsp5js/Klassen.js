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
    
    move(dx,dy){
      this.x=this.x+dx;
      this.y=this.y+dy;
    }

    moveTo(xy) {
      let d = xy.split(",");
      if (d.length != 2) {
          error(-1, "Fehler: Hier sind zwei Parameter-Werte nötig!");
      } else {
          this.x = parseInt(d[0]);
          this.y = parseInt(d[1]);
      }

  }

    
    setStroke(stroke){
      this.stroke=stroke;
    }
    
    setStrokeWeight(sw){
      this.strokeWeight=sw;
    }
    
    draw(){
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
    }

    drawCard() {
        var attribute = Object.entries(this);
        var s="";
        for (i = 0; i < attribute.length-2; i++) {
            s = s + attribute[i][0] + ": " + attribute[i][1] + "<br>";
        }
        s= attribute[attribute.length-1][1] + ": " + attribute[attribute.length-2][1] + "<hr>"+s;  // Name:Klasse
       
        let k = document.getElementById("Karte");
        k.innerHTML = s;
        k.style.borderStyle = "solid";
        k.style.borderRadius="10px";
        k.style.margin="10px";
        k.style.backgroundColor="white";
    }
  }
  
  class closedShape extends Shape{
    constructor(x,y,stroke,strokeWeight,fill){
      super(x,y,stroke,strokeWeight);
      this.fill=fill;
    }
    
    setFill(fill){
      this.fill=fill;
    }
    
    draw(){
      super.draw();
      fill(this.fill);
    }
  }
  
  class Linie extends Shape{
    constructor(x,y,x1,y1,stroke,strokeWeight,fak){
      super(x,y,stroke,strokeWeight);
      this.dx=x1-x;
      this.dy=y1-y;
    }
  
    draw(){
      super.draw();
      line(this.x*fak,this.y*fak,(this.x+this.dx)*fak,(this.y+this.dy)*fak);
    }
    setPoints(xyx1y1){
      let d = xyx1y1.split(",");
      if (d.length != 4) {
          error(-1, "Fehler: Hier sind vier Parameter-Werte nötig: x1,y1,x2,y2!");
      } else {
          this.x = parseInt(d[0]);
          this.y = parseInt(d[1]);
          this.dx=  parseInt(d[2])-this.x;
          this.dy=  parseInt(d[3])-this.y;
      }
    }
  }


  class Kreis extends closedShape{
    constructor(x,y,r,stroke, strokeWeight,fill,fak){
      super(x,y,stroke,strokeWeight,fill);
      this.r=r;
    }
    draw(){
      super.draw();
      circle(this.x*fak,this.y*fak,this.r*fak);
    }

    setRadius(r){
      this.r=r;
    }
  }
  
  class Circle extends Kreis{
    constructor(nam,klasse,fak){
        super(50,50,20,"blue",1,"red",fak);
        this.klasse=klasse;
        this.nam=nam;
    }
}

  class Rechteck extends closedShape{
    constructor(x,y,width,height,stroke, strokeWeight, fill,fak){
      super(x,y,stroke, strokeWeight, fill);
      this.width=width;
      this.height=height;
    }
    draw(){
      super.draw();
      rect(this.x*fak,this.y*fak,this.width*fak,this.height*fak);
    }
    setWidth(w){
      this.width=w;
    }
    setHeight(h){
      this.height=h;
    }

    setPoints(xyx1y1){
      let d = xyx1y1.split(",");
      if (d.length != 4) {
          error(-1, "Fehler: Hier sind vier Parameter-Werte nötig: x1,y1,x2,y2!");
      } else {
          this.x = parseInt(d[0]);
          this.y = parseInt(d[1]);
          this.width=  parseInt(d[2])-this.x;
          this.height=  parseInt(d[3])-this.y;
      }
    }
  }

  class Rect extends Rechteck{
    constructor(nam,klasse,fak){
        super(50,50,20,10,"blue",1,"red",fak);
        this.klasse=klasse;
        this.nam=nam;
    }
  }

  class Dreieck extends closedShape{
  constructor(x,y,x2,y2,x3,y3,stroke, strokeWeight, fill,fak){
      super(x,y,stroke, strokeWeight, fill);
      this.dx2=x2-x;
      this.dy2=y2-y;
      this.dx3=x3-x;
      this.dy3=y3-y;
    }
    draw(){
      super.draw();
      triangle(this.x*fak,this.y*fak,
               (this.x+this.dx2)*fak,
               (this.y+this.dy2)*fak,
               (this.x+this.dx3)*fak,
               (this.y+this.dy3)*fak);
    }
    
    setPoints(xyx1y1){
      let d = xyx1y1.split(",");
      if (d.length != 6) {
          error(-1, "Fehler: Hier sind sechs Parameter-Werte nötig: x1,y1,x2,y2,x3,y3!");
      } else {
          this.x = parseInt(d[0]);
          this.y = parseInt(d[1]);
          this.dx2=  parseInt(d[2])-this.x;
          this.dy2=  parseInt(d[3])-this.y;
          this.dx3=  parseInt(d[4])-this.x;
          this.dy3=  parseInt(d[5])-this.y;
 
        }
    }


  }
  
  class Triangle extends Dreieck{
    constructor(nam,klasse,fak){
        super(50,50,100,50,75,30,"blue",1,"red",fak);
        this.klasse=klasse;
        this.nam=nam;
    }
  }
  