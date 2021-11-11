/**
 * 
 * @param {*} formel Formelcode ohne Hoch/tiefstellung :3 für hochgestellte 3
 * @param {*} size  Schriftgröße
 * @param {*} x Koordinate
 * @param {*} y Koordinate
 * @returns verschiebbare Gruppe mit Formel, 
 * die beim Dragend die Funktion dragend(e) aufruft
 */

function formel(formel,size,x,y) {

    function lbl(txt,x,y,tief){
     var label = new Konva.Label({
        x: x,
        y: y+tief,
        opacity: 1,
      });

      label.add(
        new Konva.Tag({
        })
      );
      if (dx=0){
          fontSize=size;
        } else {
            fontSize=size*0.6;
        }
      label.add(
        new Konva.Text({
          text: txt,
          fontFamily: 'Calibri',
          fontSize: fontSize,
          padding: 0,
          fill: 'black',
        })
      );
      return label;
    }

    const group = new Konva.Group();
    var dy=0;      
    for (i=0;i<formel.length;i++){
       
        var s=formel[i];  
        
        if (isNaN(s)){
            if (s=="+"||s=="-"){
                dy=-1*size*0.25;
            } else if (s==":"){
                dy=-1*size*0.25;i++;s=formel[i];
            }else {
               dy=0;
            }
        }else{
            if (i==formel.length-1){ // letzte Zahl immer tiefgestellt
                dy=size*0.25;
            } else if ((formel[i+1]=="+"||formel[i+1]=="-")&&dy==size*0.25){
                dy=-1*size*0.25;
            } else {
            dy=size*0.25;
            }
        }
        var txt=lbl(s,x,y,dy)
        group.add(txt);
        x=txt.x()+txt.width();
        
     } 
     group.draggable(true);
     group.on('dragend', function (e) {
        dragend(e);
     });
     
    return group;
  }


var width=window.innerWidth;
var height=window.innerHeight;

var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
    });

    var layer = new Konva.Layer();
        
          
    var f = formel("Fe:3+ H2SO4   SO42-  HSO4-" ,30,50,50);
    
    layer.add(f);
    
    stage.add(layer);

    /*
    Ausgabe von Text in toast 
    */

    function dragend(e){
        var obj=e.target;
        console.log(obj.x()+" "+obj.y());

    }

    function ausgabe(title, msg, dauer, type) {
        VanillaToasts.create({
            title: title,
            text: msg,
            timeout: dauer,
            type: type,
        });
    }


