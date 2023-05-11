public class Form {

  protected Farbe farbe;
  protected int x, y;

  public Farbe getFarbe() {
    return this.farbe;
  }

  public Form(int x, int y, Farbe farbe) {
    this.x=x;
    this.y=y;
    this.farbe=farbe;
  }

  public void setFarbe(Farbe farbe) {
    this.farbe=farbe;
  }

  public void setX(int x) {
    if (x>width) {
      x=0;
    } else if (x<0) {
      x=width;
    }

    this.x=x;
  }

  public int getX() {
    return this.x;
  }

  public void setY(int y) {
    if (y>height) {
      y=0;
    } else if (y<0) {
      y=height;
    }

    this.y=y;
  }

  public int getY() {
    return this.y;
  }

  public void show() {
    fill(farbe.getRot(), farbe.getGruen(), farbe.getBlau());
  }
}
