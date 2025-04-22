   public class Mine extends Kachel {
      
   public Mine(Spielfeld feld, int x, int y, int b, int h) {
      super(feld, x, y, b, h);
         

   }
   public void onMouseDown(double x, double y, int key) {
      if(key == 0) {
         setFillColor(Color.red);
         for (int i = 0; i < feld.getKachel().length; i++) {
            if(feld.isMine(i)) {
               feld.getKachel(i).setFillColor(Color.red);
            
            }
         }
         TextField t = new TextField(100, 100, 400, 50, "GAME OVER");
         stopActing();
         
      } else if(key == 2) {
         if(!markiert) {
            setFillColor(Color.orange);
            markiert = true;

         } else {
            setFillColor(Color.lightgrey);
            markiert = false;
         }
      }
 
   }
}
   