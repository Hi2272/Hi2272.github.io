var width = window.innerWidth / 2;
var height = window.innerHeight;
var fak = 1.0;

function runden(s) {
    let i = parseInt(parseFloat(s) / fak);
    return (i).toString();
}

function aendern(attrNr) {
    s = document.getElementById("editor").innerHTML;
    s1 = s.split(":");
    nam = s1[0];
    nam = nam.split("<h1>")[1];

    s2 = s.split("<br>");
    wert = s2[attrNr];
    attribut = wert.split(":")[0];

    s2 = s.split("<input ");
    wert = s2[attrNr];
    s2 = wert.split('value="');
    wert = s2[1];
    s2 = wert.split('" ');
    wert = s2[0];
    console.log(nam, attribut, wert);


}

function input(attrNr, disabled, laenge, wert) {
    let s = "<input type='text' size='" + laenge.toString() + "' value='";
    s = s + wert + "' " + disabled + " ";

    s = s + "onclick='aendern(" + attrNr.toString() + ")'";
    s = s + "></input><br>";
    return s;
}

function initEditor(o){
        s = "";
        var attribute = Object.entries(o);
        attribute = attribute[2][1];
        var a = Object.entries(attribute);
        s = s + "<h1>" + o.nam + ":" + o.klasse + "</h1><br>";
        let attrNr = 0;
        a.forEach(function (item, index) {
            switch (item[0]) {
                case "points":
                    let punkte = item[1].toString().split(",");
                    s = s + "x1: " + input(attrNr += 1, 'disabled', 3, runden(punkte[0]));
                    s = s + "y1: " + input(attrNr += 1, 'disabled', 3, runden(punkte[1]));
                    s = s + "x2: " + input(attrNr += 1, 'disabled', 3, runden(punkte[2]));
                    s = s + "y2: " + input(attrNr += 1, 'disabled', 3, runden(punkte[3]));
                    if (punkte.length > 4) {
                        s = s + "x3: " + input(attrNr += 1, 'disabled', 3, runden(punkte[4]));
                        s = s + "y3: " + input(attrNr += 1, 'disabled', 3, runden(punkte[5]));
                    }
                    break;
                case "y":
                case "x": s = s + item[0] + ": " + input(attrNr += 1, 'disabled', 3, runden(item[1]));
                    break;
                case "radius": s = s + "Radius: " + input(attrNr += 1, '', 3, item[1]);
                    break;
                case "fill": s = s + "Füllfarbe: " + input(attrNr += 1, '', 5, item[1]);
                    break;
                case "stroke": s = s + "Linienfarbe: " + input(attrNr += 1, '', 5, item[1]);
                    break;
                case "strokeWidth": s = s + "Linienstärke: " + input(attrNr += 1, '', 5, item[1]);
                    break;
                case "width": s = s + "Breite: " + input(attrNr += 1, '', 3, runden(item[1]));
                    break;
                case "height": s = s + "Höhe: " + input(attrNr += 1, '', 3, runden(item[1]));
                    break;


            }

        });
        document.getElementById('editor').innerHTML = s;
    }

function insert(o) {
    layer.add(o);
    o.on('click', function(){initEditor(o)});
    o.on('dragend',  function(){initEditor(o)});
    o.on('dragmove',  function(){initEditor(o)});
    o.on('dragstart',  function(){initEditor(o)});

}



var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height * 0.85,
});
let fakX = stage.width() / 200;
let fakY = stage.height() / 200;
fak = fakX;
if (fakY < fakX) { fak = fakY; }

var layer = new Konva.Layer();
stage.add(layer);
koordinatensystem(layer, fak);
linie1 = new Linie("linie1", 0, 0, 200, 200, "black", 3, fak);
r1 = new Rechteck("re1", 40, 20, 100, 100, "black", "red", 4, fak);
insert(linie1);
insert(r1);
insert(new Kreis("k1", 100, 100, 40, "blue", "yellow", 5, fak));
d = new Dreieck("d1", 10, 10, 60, 60, 80, 10, "blue", "red", 2, fak)
console.log(d);
insert(d);
