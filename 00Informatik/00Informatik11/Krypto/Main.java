Caesar c = new Caesar();

for (int i = 1; i < 26; i++) {
   println(i + ": " + c.verschlüsseln("Hallo", i));
}
println("-------------");

for (int i = 1; i < 26; i++) {
   println(i + ": " + c.entschlüsseln("YMZDNDZWZIZDIN", i));
}
println("-------------");


