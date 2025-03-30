public class Ampelanlage {
   
   private Verkehrsampel[] vAmpel;
   private Fussgaengerampel[] fAmpel;
   private Taster[] taster;
   private Steuerung steuerung;

   public Ampelanlage(int x, int y, int breite, int hoehe, int anzAmpeln) {
      vAmpel = new Verkehrsampel[anzAmpeln];
      fAmpel = new Fussgaengerampel[anzAmpeln];
      taster = new Taster[anzAmpeln];
      this.steuerung = new Steuerung(this);
    
      for (int i = 0; i < anzAmpeln; i++) {
         vAmpel[i] = new Verkehrsampel(x + i * 2 * breite + 20, y, breite - 10, hoehe, new Color[] { Color.red, Color.yellow, Color.green });
         fAmpel[i] = new Fussgaengerampel(x + i * 2 * breite + breite + 20, y, breite - 10, hoehe, new Color[] { Color.red, Color.green });
         taster[i] = new Taster(steuerung, x + i * 2 * breite + breite + 20, y + hoehe + 20, breite - 5, breite - 5);
      }
   }

   public Verkehrsampel[] getVAmpel() {
      return vAmpel;
   }

   public Fussgaengerampel[] getFAmpel() {
      return fAmpel;
   }
}

new World(600, 500);
new Ampelanlage(10, 10, 100, 300, 2);
