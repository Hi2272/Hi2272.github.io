public class Fach {
   private int[] kleineLN;
   private int[] grosseLN;
   private String name;
   private String kurz;

   public Fach(String name, String kurz) {
      this.kleineLN = new int[10];
      this.grosseLN = new int[4];
      this.name = name;
      this.kurz = kurz;
      kleineLN[0] = 3;
      kleineLN[1] = 5;
      kleineLN[2] = 2;
   }

   public int getAnzahl(int[] feld) {
      int index = 0;
      while (feld[index] != 0) {
         index = index + 1;
         if(index == feld.length) {
            return index;
         }
      }
      return index;
   }

   public int getAnzahlKleineLN() {
      return getAnzahl(kleineLN);
   }
   
   public int getAnzahlGrosseLN() {
      return getAnzahl(grosseLN);
   }

   public String toString() {
      return name + ", " + kurz + ", " + getAnzahlKleineLN() + " kleine LN, " + getAnzahlGrosseLN() + " große LN";
   }
}

