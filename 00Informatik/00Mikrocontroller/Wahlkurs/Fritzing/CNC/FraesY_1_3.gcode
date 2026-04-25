G21          ; Einheit Millimeter
G90          ; Absolute Koordinaten

; --- Aktuelle Y‑Position als Null setzen ---
G92 Y0       ; Setzt die momentane Y‑Position auf 0 mm (keine Bewegung)

; --- Spindel starten ---
S2000 M3     ; Spindel einschalten, 2000 U/min (rpm)

; ---- langsame Bewegungen ----
G1 Z-2.0 F100   ; Z‑Achse langsam bis -2 mm (Feedrate 100 mm/min)
G1 Y10.0 F100   ; Y‑Achse langsam 10 mm weit (relativ zum neuen Nullpunkt)

; ---- schnelle Bewegungen ----
G0 Z2.0         ; Z‑Achse schnell bis +2 mm (Rapid‑Move)
G0 Y13.0        ; Y‑Achse schnell weitere 3 mm (von 10 mm auf 13 mm)

; --- Spindel stoppen ---
M5          ; Spindel aus
M30         ; Programmende
