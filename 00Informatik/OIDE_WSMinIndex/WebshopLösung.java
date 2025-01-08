public class Webshop {

    private Artikel[] art;
 
 
    public Webshop() {
       this.art = new Artikel[100];
       for (int i = 0; i < 5; i++) {
          this.art[i] = new Artikel(i, "Turnschuh", Math.round(59.95 + Math.random() * 100) + 0.95);
       }
    }
 
    public int getLaenge() {
       int i = 0;
       while (art[i] != null && i < art.length) {
          i = i + 1;
       }
       return i;
    }
    
    public void printAlles() {
       for (int i = 0; i < getLaenge(); i++) {
          this.art[i].drucken();
       }
    }
 
    public int getIndexOfCheapest() {
       int index = 0;
       for (int i = 0; i < getLaenge(); i++) {
          if(art[i].getPreis() < art[index].getPreis()) {
             index = i;
          }
       }
       return index;
    }
 
    public void printBilligstes() {
       art[getIndexOfCheapest()].drucken();
    }
 }
 
 Webshop w = new Webshop();
 w.printAlles();
 println("--------------");
 w.printBilligstes();