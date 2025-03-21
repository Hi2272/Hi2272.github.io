public class Ampelanlage {
   
   private Verkehrsampel[] vAmpel;
   private Fussgaengerampel[] fAmpel;
   
   public Ampelanlage(int x, int y, int breite, int hoehe, int anzAmpeln) {
      vAmpel = new Verkehrsampel[anzAmpeln];
      fAmpel = new Fussgaengerampel[anzAmpeln];
      for (int i = 0; i < anzAmpeln; i++) {
         vAmpel[i] = new Verkehrsampel(x + i * 2 * breite + 20, y, breite, hoehe, new Color[] { Color.red, Color.yellow, Color.green });
         fAmpel[i] = new Fussgaengerampel(x + i * 2 * breite + breite + 20, y, breite, hoehe, new Color[] { Color.red, Color.green });
      }
   }

   public Verkehrsampel[] getVAmpel(){
      return vAmpel;
   }

   public Fussgaengerampel[] getFAmpel(){
      return fAmpel;
   }
   
}
   new World(600, 400);
   new Ampelanlage(10, 10, 100, 300,2);
