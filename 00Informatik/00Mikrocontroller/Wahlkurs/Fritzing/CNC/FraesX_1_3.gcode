G21          ; Einheit Millimeter
G90          ; Absolute Koordinaten

; --- Aktuelle X‑Position als Null setzen ---
G92 X0       ; Setzt die momentane X‑Position auf 0 mm (keine Bewegung)

; --- Spindel starten ---
S2000 M3     ; Spindel einschalten, 2000 U/min (rpm)

; ---- langsame Bewegungen ----
G1 Z-2.0 F100   ; Z‑Achse langsam bis -2 mm (Feedrate 100 mm/min)
G1 X10.0 F100   ; X‑Achse langsam 10 mm weit (relativ zu neuem Nullpunkt)

; ---- schnelle Bewegungen ----
G0 Z2.0         ; Z‑Achse schnell bis +2 mm (Rapid‑Move)
G0 X13.0        ; X‑Achse schnell weitere 3 mm (von 10 mm auf 13 mm)

; --- Spindel stoppen ---
M5          ; Spindel aus
M30         ; Programmende
