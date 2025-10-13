public class Element{

   private int wert;
   private Element nachfolger;

   public Element(int wert){
      this.wert=wert;
   }

   public Element getNachfolger(){
      return this.nachfolger;
   }

   public void setNachfolger(Element nachfolger){
      this.nachfolger=nachfolger;
   }

   public int getWert(){
      return wert;
   }

   public void setWert(int wert){
      this.wert=wert;
   }
}