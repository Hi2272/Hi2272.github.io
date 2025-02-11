import pygame
import os
import sys

# Initialisiere Pygame
pygame.init()

# Bildschirmgröße
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
BUTTON_WIDTH = 150
BUTTON_HEIGHT = 150
BUTTON_SPACING = 20
VISIBLE_BUTTONS = 4
TOTAL_BUTTONS = 10

# Erstelle den Bildschirm
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Game Controller Button Scroll")

# Beispielhafte Programmnamen und Bilddateinamen
program_names = [
    "Programm 1", "Programm 2", "Programm 3", "Programm 4", 
    "Programm 5", "Programm 6", "Programm 7", "Programm 8", 
    "Programm 9", "Programm 10"
]

image_filenames = [
    "bild1.png", "bild2.png", "bild3.png", "bild4.png", 
    "bild5.png", "bild6.png", "bild7.png", "bild8.png", 
    "bild9.png", "bild10.png"
]

# Lade die Bilder
images = []
for img in image_filenames:
    print(os.path)
    if os.path.exists(img):
        images.append(pygame.image.load(img))
        print(f"Bild '{img}' geladen.")

    else:
        print(f"Bild '{img}' nicht gefunden.")

# Haupt-Variablen
current_index = 0

# Hauptschleife
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.JOYAXISMOTION:
            # Joystick-Achsenbewegung
            if event.axis == 0:  # X-Achse (links/rechts)
                if event.value < -0.5:  # nach links
                    current_index = (current_index - 1) % TOTAL_BUTTONS
                elif event.value > 0.5:  # nach rechts
                    current_index = (current_index + 1) % TOTAL_BUTTONS
        elif event.type == pygame.JOYBUTTONDOWN:
            if event.button == 0:  # A-Button
                program_name = program_names[current_index]
                print(f"Starte {program_name}")  # Hier wird das Programm gestartet

    # Zeichne Hintergrund
    screen.fill((150, 150, 150))

    # Zeichne die sichtbaren Buttons
    for i in range(VISIBLE_BUTTONS):
        index = (current_index + i) % TOTAL_BUTTONS
        img = images[index]
        img_rect = img.get_rect(center=(SCREEN_WIDTH // 2+ (i - 1) * (BUTTON_WIDTH + BUTTON_SPACING), (SCREEN_HEIGHT // 2) ))
        screen.blit(img, img_rect)

    pygame.display.flip()
    pygame.time.delay(100)

pygame.quit()
sys.exit()
