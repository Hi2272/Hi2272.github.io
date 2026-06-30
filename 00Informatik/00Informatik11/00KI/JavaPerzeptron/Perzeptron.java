public class Perzeptron {
    // Gewichte
   private float[] w;
    // Schwellenwert für die Heaviside‑Funktion
   private float teta;
    // Lernrate
   private float alpha;

    /**
     * Konstruktor: initialisiert die Gewichte mit zufälligen Float‑Werten
     *
     * @param dimension Anzahl der Eingabedimensionen (Länge von x)
     * @param teta      Schwellenwert für die Aktivierungsfunktion
     * @param alpha     Lernrate
     */
   public Perzeptron(int dimension, float teta, float alpha) {
      this.teta = teta;
      this.alpha = alpha;
      this.w = new float[dimension];
      for (int i = 0; i < dimension; i++) {
            // Zufällige Werte im Intervall [-1, 1)
         this.w[i] = Random.randdouble(-1.0, 1.0);
      }
   }

    /**
     * Klassifiziert einen Eingabevektor x.
     *
     * @param x Eingabevektor (muss dieselbe Länge wie w haben)
     * @return true, wenn Σ w_i·x_i ≥ teta, sonst false
     */
   public boolean klassifiziere(float[] x) {
      float sum = 0f;
      for (int i = 0; i < w.length; i++) {
         sum += w[i] * x[i];
      }
      return sum >= teta; // Heaviside‑Aktivierung
   }

    /**
     * Lernt aus einem Beispiel (x, label).
     *
     * @param x     Eingabevektor
     * @param label gewünschtes Label (true = 1, false = 0)
     */
   public void lerne(float[] x, boolean label) {
      boolean output = klassifiziere(x);
        // Zielwert: 1 für true, 0 für false
      int target = label ? 1 : 0;
      int prediction = output ? 1 : 0;
      int error = target - prediction; // Fehler (kann -1, 0 oder 1 sein)

        // Gewichte anpassen: w_i ← w_i + α·error·x_i
      for (int i = 0; i < w.length; i++) {
         w[i] =w[i]+ alpha * error * x[i];
      }
      teta = teta + alpha * error;
     
   }

   public void drawLine() {
      float m = -1 * w[0] / w[1];
      float b = teta / w[1];
      println(m + " " + b);
      Line linie = new Line(0, 0 * m + b, 300, 300 * m + b);
      linie.setBorderWidth(1);
   }

    /** Hilfsmethode zum Anzeigen der aktuellen Gewichte (optional). */
   @Override
   public String toString() {
      String s = "teta=" + String.valueOf(teta) + ", alpha=" + String.valueOf(alpha) + "w: ";
      for (int i = 0; i < w.length; i++) {
         s = s + " " + String.valueOf(w[i]);
      } 
      return s;
   }
}
