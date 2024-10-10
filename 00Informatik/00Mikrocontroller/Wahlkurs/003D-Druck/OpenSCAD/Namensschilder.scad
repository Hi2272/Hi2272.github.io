// Liste der Namen
namen = ["Max","Muster","Martha","Mathilde","Matthias"];

// Funktion zur Erstellung eines Namensschilds
module namensschild(name) {
        // Rechteckiges Schild mit abgerundeten Ecken
       linear_extrude(height=1)
          rounded_rectangle([80, 18], 2);
      
       translate([0, 0, 1])
            linear_extrude(height = 1)
                text(name, size = 13, halign = "center", valign = "center");
}


// Funktion zur Erstellung eines Rechtecks mit abgerundeten Ecken
module rounded_rectangle(size, radius) {
    minkowski() {
        square(size - [radius * 2, radius * 2], center = true);
        circle(radius);
    }
}

// Namensschilder für alle Namen in der Liste erstellen
for (i = [0:len(namen)-1]) {
    // Berechnung der Position für zwei Spalten
    x = (i % 2) * 90; // 80 mm Breite + 10 mm Abstand
    y = floor(i / 2) * 20; // 18 mm Höhe + 2 mm Abstand
    translate([x, y, 0])
        namensschild(namen[i]);
}

