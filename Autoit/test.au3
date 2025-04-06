; Überprüfen, ob Google Chrome installiert ist
Local $chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
If Not FileExists($chromePath) Then
    MsgBox(0, "Fehler", "Google Chrome ist nicht installiert.")
    Exit
EndIf

; Chrome starten und die Webseite aufrufen
Run('"' & $chromePath & '" "https://www.dsbmobile.de"')
; Warte auf das Fenster, in dem sich die Textfelder befinden
WinWait("dsbmobile.de - Google Chrome")

; Setze den Fokus auf das Fenster
WinActivate("dsbmobile.de - Google Chrome")

; Schreibe in das Textfeld txt1
ControlSetText("dsbmobile.de - Google Chrome", "", "txtUser", "abcd")

; Schreibe in das Textfeld txt2
ControlSetText("dsbmobile.de - Google Chrome", "", "txtPass", "asdsad")


