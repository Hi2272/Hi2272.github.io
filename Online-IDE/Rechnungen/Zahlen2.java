public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      String teilbar = "";
      String nichtteilbar = "";
      
      int zahl = Input.readInt("Geben Sie eine Zahl ein:");
      for (int i = 2; i < 11; i++) {
         int rest = zahl % i;
         if(rest == 0) {
            teilbar = teilbar + String.valueOf(i) + ", ";
         } else {
            nichtteilbar = nichtteilbar + String.valueOf(i) + ", ";
         }
      }
      println(zahl + " ist teilbar durch " + teilbar);
      println(zahl + " ist nicht teilbar durch " + nichtteilbar);
       
   }
   

}






new Zahlen();
