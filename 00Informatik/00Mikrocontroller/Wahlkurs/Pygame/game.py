import sys
import pygame as pg

pg.init()
pg.joystick.init()

# Fenster erstellen
WIDTH, HEIGHT = 800, 600
screen = pg.display.set_mode((WIDTH, HEIGHT))
pg.display.set_caption("Gamepad Test")

clock = pg.time.Clock()

# Joystick verbinden
joystick = None
count=0

while joystick is None:
    if pg.joystick.get_count() > 0:
        joystick = pg.joystick.Joystick(0)
        joystick.init()
        print("Joystick erkannt:", joystick.get_name())
    else:
        count=count+1
        if count==1:
            print("Kein Joystick erkannt.")
        for event in pg.event.get():
            if event.type == pg.QUIT:
                running = False
            elif event.type == pg.JOYDEVICEADDED:
                # Initialize the newly added device
                joystick = pg.joystick.Joystick(event.device_index)
                print("Joystick erkannt:", joystick.get_name())

# Punkt und Zeichenspur
position = pg.Vector2(WIDTH // 2, HEIGHT // 2)
trail = [position.copy()]

speed = 250
running = True

while running:
    delta_time = clock.tick(60) / 1000

    for event in pg.event.get():
        if event.type == pg.QUIT:
            running = False

        # Mit der Leertaste kann die Zeichnung gelöscht werden
        if event.type == pg.KEYDOWN and event.key == pg.K_SPACE:
            trail = [position.copy()]

        # Joystick-Button 0 löscht ebenfalls die Zeichnung
        if event.type == pg.JOYBUTTONDOWN and event.button == 0:
            trail = [position.copy()]

    # Bewegungsrichtung bestimmen
    direction = pg.Vector2(0, 0)

    if joystick is not None:
        x_axis = joystick.get_axis(0)
        y_axis = joystick.get_axis(1)
        print(f"x: {x_axis} y: {y_axis}")

        # Kleine ungewollte Bewegungen ignorieren
        deadzone = 0.00001

        if abs(x_axis) > deadzone:
            direction.x = x_axis
            print(f"x: {x_axis} y: {y_axis}")

        if abs(y_axis) > deadzone:
            direction.y = y_axis
            print(f"x: {x_axis} y: {y_axis}")

    # Diagonale Bewegung normalisieren
    if direction.length() > 1:
        direction = direction.normalize()

    # Punkt bewegen
    position += direction * speed * delta_time

    # Punkt innerhalb des Fensters halten
    position.x = max(5, min(WIDTH - 5, position.x))
    position.y = max(5, min(HEIGHT - 5, position.y))

    # Neue Position zur Zeichenspur hinzufügen
    if position.distance_to(trail[-1]) > 1:
        trail.append(position.copy())

    # Bildschirm zeichnen
    screen.fill((20, 20, 30))

    # Linien zeichnen
    if len(trail) > 1:
        pg.draw.lines(
            screen,
            (80, 200, 255),
            False,
            trail,
            4
        )

    # Punkt zeichnen
    pg.draw.circle(
        screen,
        (255, 80, 80),
        (int(position.x), int(position.y)),
        8
    )

    pg.display.flip()

pg.quit()
sys.exit()
