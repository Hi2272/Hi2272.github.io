public class Spielfeld {
   
   private Kachel[] kachel;
   private int spalten, zeilen, breite, hoehe, anzMinen;
   
   public Spielfeld(int spalten, int zeilen, int breite, int hoehe, int anzMinen) {
      this.kachel = new Kachel[spalten * zeilen];
      this.spalten = spalten;
      this.zeilen = zeilen;
      this.breite = breite;
      this.hoehe = hoehe;
      this.anzMinen = anzMinen;

      for (int i = 0; i < anzMinen; i++) {
         int nr = Random.randint(0, kachel.length - 1);
         while (kachel[nr] instanceof Mine) {
            nr = Random.randint(0, kachel.length - 1);
         }
         kachel[nr] = new Mine(this, getSpalte(nr), getZeile(nr), breite, hoehe);
      }

      for (int i = 0; i < kachel.length; i++) {
         if(kachel[i] == null) {
            kachel[i] = new Platte(this, getSpalte(i), getZeile(i), breite, hoehe);
         }
      }
  
       

  
      for (int i = 0; i < kachel.length; i++) {
         if(kachel[i] instanceof Platte) {
            kachel[i].setNachbarn(anzNachbarn(i));
         }
      }
      for (int y = 0; y < zeilen; y++) {
         for (int x = 0; x < spalten; x++) {
         
            print(String.valueOf(getKachel(x, y).getNachbarn()) + " ");
         
         }
         println();
      }
   }

   public int anzNachbarn(int nr) {
      int anz = 0;
      int sp = getSpalte(nr);
      int ze = getZeile(nr);
      for (int i = -1; i <= 1; i++) {
         if(isMine(sp + i, ze - 1)) {
            anz = anz + 1;
         }
         if(isMine(sp + i, ze + 1)) {
            anz = anz + 1;
         }
      }
      if(isMine(sp - 1, ze)) {
         anz = anz + 1;
      }
      if(isMine(sp + 1, ze)) {
         anz = anz + 1;
      }
      return anz;
   }
   
   public boolean isInGrid(int x, int y) {
      return(x >= 0 && x < spalten && y >= 0 && y < zeilen);
   }

   public boolean isMine(int x, int y) {
      if(isInGrid(x, y)) {
         return(getKachel(x, y) instanceof Mine);
      }
      return false;
   }

   public boolean isMine(int i) {
      if(i >= 0 && i < kachel.length) {
         return(kachel[i] instanceof Mine);
      }
      return false;
   }
   
   public Kachel getKachel(int x, int y) {
      return this.kachel[x + y * spalten];
   }
    
   public Kachel getKachel(int i) {
      return this.kachel[i];
   }
   
   public Kachel[] getKachel() {
      return this.kachel;
   }

   public int getSpalte(int i) {
      return i % spalten;
   }
   
   public int getZeile(int i) {
      return i / spalten;
   }
}

new Spielfeld(10, 10, 60, 60, 10);