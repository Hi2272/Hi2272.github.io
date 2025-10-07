public class Knoten extends Circle {
   String name;
   Text txt;
   
   public Knoten(String name, int x, int y) {
      super(x, y, 50);
      this.name = name;
      int laenge = name.length();
      setFillColor(Color.bisque);
      setBorderColor(Color.darkblue);
      txt = new Text(x - laenge * 10, y - 25, 30, name);
      txt.setFillColor(Color.black);
   }

   public String getName() {
      return name;
   }
  
}