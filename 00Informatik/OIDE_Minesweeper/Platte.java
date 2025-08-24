public class Platte extends Kachel {

   private int nachbarn;
   private boolean aufgedeckt;
   
   public Platte(Spielfeld feld, int x, int y, int b, int h) {
      super(feld, x, y, b, h);
      this.nachbarn = 0;
      aufgedeckt = false; 

   }

   public void setNachbarn(int i) {
      this.nachbarn = i;
   }
   public int getNachbarn() {
      return nachbarn;
   }

   public void aufdecken() {
      if(!aufgedeckt) {
         TextField t = new TextField(x * breite, y * hoehe, breite - 3, 30, String.valueOf(nachbarn));
         aufgedeckt = true;
      if(nachbarn > 0) {
            t.setFillColor(Color.yellow, 0.3);
         }
         if(nachbarn == 0) {
            t.setFillColor(Color.green, 0.3);
            
            for (int i = -1; i <= 1; i++) {
               if(feld.isInGrid(x + i, y - 1)) { feld.getKachel(x + i, y - 1).aufdecken(); }
               if(feld.isInGrid(x + i, y + 1)) { feld.getKachel(x + i, y + 1).aufdecken(); }
            }
            if(feld.isInGrid(x - 1, y)) { feld.getKachel(x - 1, y).aufdecken(); }
            if(feld.isInGrid(x + 1, y)) { feld.getKachel(x + 1, y).aufdecken(); }
         }
      }
   }

   
   public void onMouseDown(double x, double y, int key) {
      if(key == 0) {
 
         aufdecken();
      } else if(key == 2) {
         if(!markiert) {
            setFillColor(Color.orange);
            markiert = true;

         } else {
            setFillColor(Color.lightgrey);
            markiert=false;
         }
      }
   }  
}