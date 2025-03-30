public class Steuerung {
   
   private Ampelanlage anlage;
   private Verkehrsampel[] vAmpel;
   private Fussgaengerampel[] fAmpel;
   
   public Steuerung(Ampelanlage anlage) {
      this.anlage = anlage;
      vAmpel = anlage.getVAmpel();
      fAmpel = anlage.getFAmpel();
   }

   public void schalten() {
      for (int i = 0; i < vAmpel.length; i++) {
         vAmpel[i].gelb();
      }
      SystemTools.pause(1000);
      for (int i = 0; i < vAmpel.length; i++) {
         vAmpel[i].rot();
      }
      SystemTools.pause(1000);
      for (int i = 0; i < fAmpel.length; i++) {
         fAmpel[i].gruen();
      }
      SystemTools.pause(3000);
      for (int i = 0; i < fAmpel.length; i++) {
         fAmpel[i].rot();
      }
      SystemTools.pause(1000);
      for (int i = 0; i < vAmpel.length; i++) {
         vAmpel[i].gelb();
      }
      SystemTools.pause(1000);
      for (int i = 0; i < vAmpel.length; i++) {
         vAmpel[i].gruen();
      }
      SystemTools.pause(1000);
   }
}

