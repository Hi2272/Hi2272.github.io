public class Fach {

   private int[] kleineLN;
   private int[] grosseLN;
   private String name;
   private String kurz;
   private int gewichtung;

   public Fach(String name, String kurz, int gewichtung) {
      this.kleineLN = new int[10];
      this.grosseLN = new int[4];
      this.name = name;
      this.kurz = kurz;
      this.gewichtung = gewichtung;

      kleineLN[0] = 3;
      kleineLN[1] = 5;
      kleineLN[2] = 2;
      grosseLN[0] = 2;
   }

   public void neuerLN(int[] feld,int note){
      int anzahl=getAnzahl(feld);
      if (anzahl<feld.length){
         feld[anzahl]=note;
      } else {
         println("Fehler: "+feld.toString()+" ist voll.");
      }
   }

   public void neuerGrosserLN(int note){
      neuerLN(this.grosseLN);
   }   

   publci void neuerKleinerLN(int note){
      neuerLN(this.kleineLN);
   }
   
   public double getGesMw() {
      double mwKlein = getMwKlein();
      double mwGross = getMwGroß();
      double mw;
      if(mwGross != 0) {
         mw = (mwGross * this.gewichtung + mwKlein) / (1 + this.gewichtung);
      } else {
         mw = mwKlein;
      }
      return mw;
   }
   public int getNote() {
      double mw = getGesMw();
      int note = Math.floor(mw);
      double nachKomma = mw - note;
      if(nachKomma <= 0.5) {
         return note;
      } else {
         return note+1;
      }
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

   public double getMwKlein() {
      return getMw(kleineLN);
   }

   public double getMwGroß() {
      return getMw(grosseLN);
   }



   public String toString() {
      return name + ": " + getGesMw() + "  " + getNote();
   }
}

