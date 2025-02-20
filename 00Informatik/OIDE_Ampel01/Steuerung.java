public class Steuerung extends Rectangle {
   
   private Ampel ampel;

   public Steuerung() {
      super(300, 200, 100, 100);
      Color[] farben = { Color.red, Color.yellow, Color.green };
      //Color[] farben = { Color.red, Color.green };
     
      ampel = new Ampel(100, 100, 300,farben);
   }

   public void onMouseDown(double x, double y, int key) {
      ampel.wirdGruen();
      while (ampel.isSchaltend()) { 
      } 

      SystemTools.pause(3000);
      ampel.wirdRot();
      while (ampel.isSchaltend()) {
         
      } 
      
      print("Fertig");
   }
}

new World(600, 400);
new Steuerung();