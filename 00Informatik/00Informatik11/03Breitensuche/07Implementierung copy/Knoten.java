public class Knoten extends Circle {
   private String name;
   private Text txt;
   private boolean visited;

   public Knoten(String name, int x, int y) {
      super(x, y, 50);
      this.name = name;
      int laenge = name.length();
      this.visited = false;
      setFillColor(Color.bisque);
      setBorderColor(Color.darkblue);
      txt = new Text(x - laenge * 10, y - 25, 30, name);
      txt.setFillColor(Color.black);
     }

   public boolean isVisited() {
      return visited;
   }
   public void setVisited(boolean visited) {
      this.visited = visited;
   }

   public String getName() {
      return name;
   }
  
}