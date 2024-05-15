public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      int zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      while (zahl > 99 || zahl < 2) {
         zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      }
      System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
      for (int teiler = 2; teiler < 11; teiler = teiler + 1) {
         int rest = zahl % teiler;
         if(rest == 0) {
            System.out.println("Sie ist durch " + String.valueOf(teiler) + " teilbar.");
         }
      }
   }
}

new Zahlen();
