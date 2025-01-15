public class Liste {

   private Element nachFolger;

   public Liste() {
   }

   public int getLaenge(){
      Element aktuell=nachfolger;
      int laenge=0;
      while (aktuell.getNachfolger()!=null){
         aktuell=aktuel.getNachfolger();
         laenge=laenge+1;
      }
      return laenge;
   }

   public void add(int wert){
      this.nachfolger=new Element(wert);
   }

}

Liste l=new Liste();
println(l.getLaenge());
l.add(20);
println(l.getLaenge());

