M140 S60 ; Heizbett auf 50°C setzen (asynchron)
M190 S60 ; Warte, bis das Heizbett 50°C erreicht hat (blockierend)

; --- Piepton bei Erreichen der Temperatur ---
M300 S1000 P200 ; Piep: Tonhöhe 1000 Hz, Dauer 200 ms