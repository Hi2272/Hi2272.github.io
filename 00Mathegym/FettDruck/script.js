function convert() {

    let basis = document.getElementById("basis")
    let index = document.getElementById("index")
    let exp = document.getElementById("exponent")
    let lsg=document.getElementById("lsg")
    let lsg2=document.getElementById("lsg2")
    let html=document.getElementById("html")


    s=basis.value;
    s=s.replaceAll("(","&#040;");
    s=s.replaceAll(")","&#041;");
    
    exp.value=exp.value.replaceAll("-","−");
    
    
    lsg.value=lsg.value+"¯´(idz~´(<b>"+s+"</b>)¦";
    lsg.value=lsg.value+"´(<b>"+index.value+"</b>)¦";
    lsg.value=lsg.value+"´(<b>"+exp.value+"</b>))";
    
    lsg.value=lsg.value.replaceAll("´(<b></b>)","");

    lsg2.value="<formel>"+lsg.value+"</formel>";
    html.innerHTML=html.innerHTML+"<b>"+s+"<sub>"+index.value+"</sub><sup>"+exp.value+"</sup></b>";
    basis.value="";
    exp.value="";
    index.value="";

}

function copy(id) {
    let loesung = id.value;
    navigator.clipboard.writeText(loesung);
    anzeige("Meldung", "Die Formel wurde in die Zwischenablage kopiert.", 2000, "success");

}

function anzeige(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}

function loeschen(){
    document.getElementById("lsg").value="";
    document.getElementById("lsg2").value="";
    document.getElementById("html").innerHTML="";
}