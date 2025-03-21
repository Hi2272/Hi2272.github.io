public class Steuerung extends Rectangle {
   
   private Ampelanlage anlage;

   public Steuerung() {
      super(300, 200, 100, 100);
      Color[] farben = { Color.red, Color.yellow, Color.green };
      //Color[] farben = { Color.red, Color.green };
     
      ampel = new Ampel(100, 100, 300,farben);
   }

   public void schalten(){

      Verkehrsampel[] vAmpel=anlage.getVAmpel;
      for (int i=0;i<vAmpel.count;i++){
         for (int j=0;j<3;j++){
            vAmpel[i].schalten(j);
         }
         SystemTools.pause(1000);
        }
        ampel.wirdGruen();
      while (ampel.isSchaltend()) { 
      } 

      SystemTools.pause(3000);
      ampel.wirdRot();
      while (ampel.isSchaltend()) {
         
      } 
      
      print("Fertig");
   

        ampel.wirdGruen();
      while (ampel.isSchaltend()) { 
      } 

      SystemTools.pause(3000);
      ampel.wirdRot();
      while (ampel.isSchaltend()) {
         
      } 
      
      print("Fertig");
   
   }
 
}

new World(600, 400);
new Steuerung();