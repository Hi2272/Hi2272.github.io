import pygame
# Öffnet Pygame Window mit 400x400 Pixeln
# Dieses Fenster muss angeklickt werden,
# damit die Tastendrücke registriert werden.

def init():
    pygame.init()
    win=pygame.display.set_mode((400,400))
# Wird aufgerufen, wenn eine bestimmte Taste gedrückt wird
# gibt True aus, wenn nicht, sonst wahr

def getKey(keyName):
    ans=False
    for eve in pygame.event.get(): pass
    keyInput=pygame.key.get_pressed()
    myKey=getattr(pygame,'K_{}'.format(keyName))
    if keyInput[myKey]:
        ans=True
    pygame.display.update()

    return ans


def main():
    print(getKey("a"))

if __name__=='__main__':
    init()
    while True:
        main()