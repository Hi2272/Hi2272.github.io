public class Steuerung extends Rectangle {
   
   private Ampel ampel;

   public Steuerung() {
      super(300, 200, 100, 100);
      ampel = new Ampel(100, 100, 300);
   }

   public void onMouseDown(double x, double y, int key) {
      ampel.schalten(-1);
      while (ampel.isSchaltend()) {
         
      } 
      SystemTools.pause(3000);
      ampel.schalten(1);
      while (ampel.isSchaltend()) {
         
      } 
      
      print("Fertig");
   }
}

new World(600, 400);
new Steuerung();