let bsp = "<h1>Beispielcode</h1>";
bsp += "Dieser Code ist ein typischer <b>HTML</b>-Code.<br>";
bsp += "Untersuche, wie die Zeilen umgebrochen und der Text <b>fett</b> gesetzt wird.";

let ausg = document.getElementById("HTML");
let eing = document.getElementById("Code");

document.getElementById("btn").onclick = function () {
    codeToText();
}

function codeToText() {
    var txt = eing.value;
    ausg.innerHTML = txt;
}

document.getElementById("Zahlencode").onchange = function () {
    var code = document.getElementById("Zahlencode").value; 
    if (code === "532") {
        document.getElementById("Bild").setAttribute("src", "SchatzkisteOffen.jpg");
        let txt="Im Inneren der Kiste findest du nur einen Zettel:<br>";
        txt += "\"So ein Pech - Da war wohl wieder einer schneller als du.<br>";
        txt+="Viel Erfolg beim nächsten Mal!\"<br>";

        document.getElementById("Text").innerHTML=txt;
    } else {
        alert("Falscher Code! Versuche es noch einmal.");
    }   
}


