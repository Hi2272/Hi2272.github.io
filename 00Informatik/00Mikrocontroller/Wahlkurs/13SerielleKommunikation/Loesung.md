<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">
<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Daten an den Arduino senden
## zeichencodierung
|Zeichen|Code|
|---|---|
|1|49|
|2|50|
|3|51|
|4|**52**|
|...||
|A|65|
|B|66|
|...||
|a|97|
|b|98|
|...||
|**RETURN**|**10**|
Die Zeichen werden als ASCII-Codes (**A**merican **S**tandard **C**ode for **I**nformation **I**nterchange) gesendet. Jedes Zeichen entspricht hierbei einem Zahlencode.  
Die Nachricht wird jeweils durch den Code **10** abgeschlossen.
### Aufgabenstellung
Ändere dein Programm so ab, dass
1. Die Zeichen nur dann ausgegeben werden, wenn der Code nicht 10 ist.
2. Anstelle des ASCII-Codes die eingegebenen Zeichen dargestellt werden.  
   Verwende hierzu die Funktion **char(zeichen)**.


[weiter](Loesung2.html)  
[zurück](../index.html)
