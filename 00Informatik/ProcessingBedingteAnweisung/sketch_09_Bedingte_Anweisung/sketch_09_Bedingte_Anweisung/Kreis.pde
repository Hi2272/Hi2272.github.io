public class Kreis extends Form{

  protected int durchmesser;
 
  public Kreis(int x, int y, int durchmesser,Farbe farbe) {
    super(x,y,farbe);
    this.durchmesser=durchmesser;
  }

 
  public void show() {
     super.show();
     circle(this.x, this.y, this.durchmesser);
  }

  public void setDurchmesser(int durchmesser) {
    this.durchmesser=durchmesser;
  }
  public int getDurchmesser() {
    return durchmesser;
  }
}
