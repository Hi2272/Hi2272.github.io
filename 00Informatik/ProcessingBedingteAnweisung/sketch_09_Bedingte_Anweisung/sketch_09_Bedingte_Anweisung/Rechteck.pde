public class Rechteck extends Form {

  protected int b, h;

  public Rechteck(int x, int y, int b, int h, Farbe farbe) {
    super(x, y, farbe);
    this.b=b;
    this.h=h;
  }

  public void show() {
    super.show();
    rect(x, y, b, h);
  }

  public void setB(int b) {
    this.b=b;
  }
  public int getB() {
    return this.b;
  }

  public void setH(int h) {
    this.h=h;
  }

  public int getH() {
    return this.h;
  }
}
