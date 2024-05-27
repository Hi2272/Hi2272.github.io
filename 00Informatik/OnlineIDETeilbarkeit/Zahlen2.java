public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      int zahl = Input.readInt("Geben Sie eine Zahl ein:");
      for (int teiler = 2; teiler < 11; teiler = teiler + 1) {
         int rest = zahl % teiler;
         System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
         System.out.println("auf die Teilbarkeit durch " + String.valueOf(teiler) + ".");
         System.out.println("Der Rest beträgt: " + String.valueOf(rest));
      }
   }
  
}

new Zahlen();
