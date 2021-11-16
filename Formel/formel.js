const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

  jsonData = JSON.parse(this.responseText);

  /* 
  Titel eintragen
  */

  
  /* 
  Variablen umwandeln 
*/
  var snap = jsonData.snap;
  var copyright = jsonData.copyright;
  var titel=jsonData.titel;
  var untertitel=jsonData.untertitel;
  var positionsmarken = jsonData.positionsmarken;
  var aufgabe=jsonData.aufgabe;
  var kaertchen=jsonData.kaertchen;  
  
  var nummer = 0;




  /**
   * 
   * @param {*} formel Formelcode ohne Hoch/tiefstellung :3 für hochgestellte 3
   * @param {*} size  Schriftgröße
   * @param {*} x Koordinate
   * @param {*} y Koordinate
   * @returns verschiebbare Gruppe mit Formel, 
   * die beim Dragend die Funktion dragend(e) aufruft
   */

  function lbl(txt, x, y, tief,size) {
    var label = new Konva.Label({
      x: x,
      y: y + tief,
      opacity: 1,
    });

    label.add(
      new Konva.Tag({
      })
    );
    if (tief == 0) {
      fontSize = size;
    } else {
      fontSize = size * 0.8;
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


  function formel(formel, x1, y1,size) {

    const group = new Konva.Group({
      x:0,
      y:0
    });
    var x=0;
    var y=0;
    var dy = 0;
    for (i = 0; i < formel.length; i++) {

      var s = formel[i];

      if (isNaN(s)) {
        if (s == "+" || s == "-") {
          dy = -1 * size * 5;
        } else if (s == ":") {
          dy = -1 * size * 5; i++; s = formel[i];
        } else {
          dy = 0;
        }
      } else {
        if (i == formel.length - 1) { // letzte Zahl immer tiefgestellt
          dy = size * 0.5;
        } else if ((formel[i + 1] == "+" || formel[i + 1] == "-") && dy == size * 0.5) {
          dy = -1 * size * 0.5;
        } else {
          dy = size * 0.5;
        }
      }
      var txt = lbl(s, x, y, dy,size)
      group.add(txt);
      x = txt.x() + txt.width();

    }
    group.draggable(true);
    group.on('dragstart', function (e) {
      dragstart(e);
    });


    group.on('dragend', function (e) {
      dragend(e);
    });

    group.x(x1);
    group.y(y1);
    
    return group;
  }


  var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
  });

  var layer = new Konva.Layer();

  var nr=0;
  layer.add(lbl(titel,50,10,0,30));
  layer.add(lbl(untertitel,20,40,0,10));
  layer.add(lbl(aufgabe[nr].text,20,50,0,20));
  var ang=aufgabe[nr].angabe;
  for (var n=0;n<ang.edukte.length;n++){
    console.log(n,ang.edukte.length);
    layer.add(formel(ang.edukte[n],20+80*n,70,30));
    if (n<ang.edukte.length-1){
      layer.add(lbl("+",20+80*n+50,68,0,30));
    }
}
  for (n=0;n<ang.produkte.length;n++){
    layer.add(formel(ang.produkte[n],220+80*n,70,30));
    if (n<ang.produkte.length-1){
      layer.add(lbl("+",320+80*n+50,68,0,30));
    }
  }
  
  function pfeil(x,y,l){
    var tmp=new Konva.Line({
    points:[x,y,x+l,y,x+l-7,y-7,x+l,y,x+l-7,y+7],
    stroke:'black',
    strokeWidth:2,
    });
    return tmp;
  }

    layer.add(pfeil(160,80,40));
  

  stage.add(layer);

  /*
  Funktion, die beim Ende des Ziehens aufgerufen wird
  */

  function dragend(e) {
    var obj = e.target;
    console.log(obj.x() + " " + obj.y());
  }

  function dragstart(e) {
    var obj = e.target;
    console.log(obj.x() + " " + obj.y());
  }

  /*
  Ausgabe von Text in toast 
  */

  function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
      title: title,
      text: msg,
      timeout: dauer,
      type: type,
    });
  }

}
var href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();
