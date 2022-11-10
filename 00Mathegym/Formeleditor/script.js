
    function ausgabeTabelle(){
        let eingabe=document.getElementById("inputTabelle").value;
        eingabe=eingabe.replaceAll(" ","_");
        
        var s=eingabe.split("|");
        var ausg="<formel>´(tab~"+s[0]+"¦";
        for (var i=1;i<s.length;i++){
            ausg=ausg+s[i]+"¦";
        }
        ausg=ausg+"|";
        for (var i=0;i<s.length;i++){
            ausg=ausg+"¦";
        }
        ausg=ausg+")</formel>";
        document.getElementById("output").value=ausg;
        copy();
    }
    
    
    function ausgabe(){
        let eingabe=document.getElementById("input").value;
        eingabe=eingabe.replaceAll("_","▇");
        
        eingabe=eingabe.replaceAll(" ","_");
        
        
        var s=eingabe.split("=");
        
        var ausg="<formel>´(glc~"+s[0]+"=";
        for (var i=1;i<s.length;i++){
            ausg=ausg+s[i]+"|=";
        }
        ausg=ausg.substring(0,ausg.length-2);
        ausg=ausg+")</formel>";
        document.getElementById("output").value=ausg;
        copy();
    }
    
    function anzeige(title, msg, dauer, type) {
        VanillaToasts.create({
            title: title,
            text: msg,
            timeout: dauer,
            type: type,
        });
    }
    
    function copy(){
        let ausg=document.getElementById("output").value;
        navigator.clipboard.writeText(ausg);
        anzeige("Meldung","Die Formel wurde in die Zwischenablage kopiert.",2000,"success");
       
        }
    