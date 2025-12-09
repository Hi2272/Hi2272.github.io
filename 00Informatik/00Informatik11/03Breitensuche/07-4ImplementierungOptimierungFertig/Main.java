World w = new World(500, 800);
w.setBackgroundColor(Color.white);

Graph g = new Graph(7);

g.addKnoten(new Knoten(0,"M", 100, 300));
g.addKnoten(new Knoten(1,"MÜ", 440, 450));
g.addKnoten(new Knoten(2,"Wkb", 290, 500));
g.addKnoten(new Knoten(3,"RO", 110, 730));
g.addKnoten(new Knoten(4,"LA", 300, 200));
g.addKnoten(new Knoten(5,"N", 70, 70));
g.addKnoten(new Knoten(6,"W", 200, 600));

g.drawKanten();

println(g.breitenSuche(g.getKnoten("Wkb"), g.getKnoten("N")));