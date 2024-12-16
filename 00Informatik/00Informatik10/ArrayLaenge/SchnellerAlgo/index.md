 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Ein schnellerer Algorithmus

```Java
   public int getLastIndex(){
        int start=0;
        int ende=art.length;
        int pos=(start+ende)/2;
       
        while (pos!=start){
            if (art[pos]==null){
                ende=pos;
            } else {
                start=pos;
            }
            pos=(start+ende)/2;
        }
        return pos;
    }
```
Untersuche diese Methode für folgendes Feld:
```Java
Artikel[] art = new Artikel[10];
for (int i=0;i<5;i++)
    art[i]=new Artikel(...);
}
```

| Index  | 0       | 1       | 2       | 3       | 4       | 5    | 6    | 7    | 8    | 9    |
|--------|---------|---------|---------|---------|---------|------|------|------|------|------|
| Inhalt | ⇒ Obj. | ⇒ Obj. | ⇒ Obj. | ⇒ Obj. | ⇒ Obj. | null | null | null | null | null |
  
Erstelle hierfür eine Tabelle, in der du die Werte der lokalen Variablen aufschreibst:  

| Durchlauf | start | ende | pos |
|-----------|-------|------|-----|
| 0         |       |      |     |
| 1         |       |      |     |
| 2         |       |      |     |
| 3         |       |      |     |
| 4         |       |      |     |

Leite daraus ab, wie der Algorithmus funktioniert.


[zurück](../../index.html)
   
