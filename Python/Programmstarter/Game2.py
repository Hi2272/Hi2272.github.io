import pygame
import os
import sys
import subprocess

# Initialisiere Pygame
pygame.init()

# Bildschirmgröße
SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080
VISIBLE_BUTTONS = 5

BUTTON_WIDTH = SCREEN_WIDTH/(VISIBLE_BUTTONS+1)
BUTTON_HEIGHT = BUTTON_WIDTH
BUTTON_SPACING = BUTTON_WIDTH/(VISIBLE_BUTTONS+1)
TOTAL_BUTTONS = 10

# Erstelle den Bildschirm
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Game Controller Button Scroll")

# Beispielhafte Programmnamen und Bilddateinamen
program_names = [
    "./Programm1.sh", "./cuyo.sh", "Programm 3", "Programm 4", 
    "Programm 5", "Programm 6", "Programm 7", "Programm 8", 
    "Programm 9", "Programm 10"
]

image_filenames = [
    "bild1.png", "cuyo.png", "bild3.png", "bild4.png", 
    "bild5.png", "bild6.png", "bild7.png", "bild8.png", 
    "bild9.png", "bild10.png"
]

# Lade die Bilder
images = []
for img in image_filenames:
    print(os.path)
    if os.path.exists(img):
        image=pygame.image.load(img)
        image=pygame.transform.scale(image,(BUTTON_WIDTH,BUTTON_HEIGHT))
        images.append(image)

# Haupt-Variablen
current_index = 0

#initialise the joystick module
pygame.joystick.init()
joysticks = []


# Hauptschleife
running = True
moving = False

while running:
   
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.JOYDEVICEADDED:
            joy = pygame.joystick.Joystick(event.device_index)
            joysticks.append(joy)

        elif event.type == pygame.JOYAXISMOTION:
            # Joystick-Achsenbewegung
            if event.axis == 0:  # X-Achse (links/rechts)
                if not moving: 
                    print(event.value)
                    if event.value < -0.002:  # nach links
                        current_index = (current_index - 1) % TOTAL_BUTTONS
                    elif event.value > 0.002:  # nach rechts
                        current_index = (current_index + 1) % TOTAL_BUTTONS
                    moving=True
                elif abs(event.value) <= 0.002:  # Joystick ist nivelliert (neutral)
                    moving = False        
        elif event.type == pygame.JOYBUTTONDOWN:
            if event.button == 0:  # A-Button
                program_name = program_names[(current_index+2)%TOTAL_BUTTONS]
                print(f"Starte {program_name}")  # Hier wird das Programm gestartet
                try:
                    # Das Programm mit subprocess starten
                    subprocess.run([program_name], check=True)
                except FileNotFoundError:
                    print(f"Das Skript {program_name} wurde nicht gefunden.")
                except PermissionError:
                    print(f"Zugriffsfehler: Überprüfe die Berechtigungen des Skripts ({program_name})")
                except subprocess.CalledProcessError as e:
                    print(f"Fehler beim Ausführen des Skripts: {e}")
                except Exception as e:
                    print(f"Unbekannter Fehler: {e}")
    # Zeichne Hintergrund
    screen.fill((250, 250, 200))

    # Zeichne die sichtbaren Buttons
    for i in range(VISIBLE_BUTTONS):

        index = (current_index + i) % TOTAL_BUTTONS
        # print(index)
        img = images[index]
        if (i==2):
            img=pygame.transform.scale(img,(BUTTON_WIDTH*1.1,BUTTON_HEIGHT*1.3))
        img_rect = img.get_rect(center=(BUTTON_WIDTH/2+ BUTTON_SPACING+ (BUTTON_WIDTH + BUTTON_SPACING)*i, (SCREEN_HEIGHT // 2)))
        screen.blit(img, img_rect)

    pygame.display.flip()
    pygame.time.delay(100)

pygame.quit()
sys.exit()
