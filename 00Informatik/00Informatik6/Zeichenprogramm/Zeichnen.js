function koordinatensystem(layer, fak){
    for (let y = 0; y <= 200; y += 10) {
        layer.add(new Linie(0,y,200,y,'lightgrey',1,fak));
        layer.add(new Txt(0,y,y.toString(),6*fak,'lightgrey',fak));
    }
    layer.add(new Txt(10,190,"y",8*fak,"lightgrey",fak));
    for (let x = 0; x <= 200; x += 10) {
        layer.add(new Linie(x,0,x,200,'lightgrey',1,fak));
        layer.add(new Txt(x,0,x.toString(),6*fak,'lightgrey',fak));
  }
  layer.add(new Txt(190,5,"x",8*fak,"lightgrey",fak));
  
}

function loeschen(layer,fak){
    layer.removeChildren();
    koordinatensystem(layer,fak);
}

