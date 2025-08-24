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

   public int getAnzahlKleineLN() {
      return getAnzahl(kleineLN);
   }
   
   public int getAnzahlGrosseLN() {
      return getAnzahl(grosseLN);
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
   
   public double getMw(int[] feld) {
      int summe = 0;
      int anz = getAnzahl(feld);
      if(anz > 0) {
         for (int i = 0; i < anz; i++) {
            summe = summe + feld[i]; 
         }
      
         double mw = summe * 1.0 / anz;
         return mw;
      } else {
         return 0;
      }
   }

   public double getMwKleineLN() {
      return getMw(kleineLN);
   }

   public double getMwGrosseLN() {
      return getMw(grosseLN);
   }


   public String toString() {
      return name + ", " + kurz + ", " + getAnzahlKleineLN() + " kleine LN, " + getAnzahlGrosseLN() + " große LN";
   }
}

