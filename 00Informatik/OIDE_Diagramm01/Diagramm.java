public class Diagramm {

   private int breite, hoehe;
   private World hintergrund;
   private Achse xAchse, yAchse;
   private Balken[] balken;

   public Diagramm(int breite, int hoehe) {
      hintergrund = new World(breite, hoehe);
      this.breite = breite;
      this.hoehe = hoehe;
      
      hintergrund.setBackgroundColor(Color.white);
      xAchse = new Achse(0, hoehe - 10, breite, hoehe - 10);
      yAchse = new Achse(10, 10, 10, hintergrund.getHeight());
      balken = new Balken[10];
      for (int i = 0; i < balken.length; i++) {
       
         balken[i] = new Balken(this.hintergrund,i,i*20+5,balken.length,200);
      } 
      balken[3].setFillColor(Color.green);
   }
}

Diagramm d = new Diagramm(600,400);
