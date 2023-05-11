public class Lampe extends Kreis{

public Lampe(int x,int y, int durchmesser, Farbe farbe){
  super(x,y,durchmesser,farbe);
}

public void an(){
  show();
}

public void aus(){
  fill(farbe.getRot()/3,farbe.getGruen()/3,farbe.getBlau()/3);
  circle(x,y,durchmesser);
}






  
  
  
}
