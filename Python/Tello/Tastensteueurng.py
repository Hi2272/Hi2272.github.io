import keypressModule as kp

from djitellopy import tello
import time 

import cv2

kp.init()
me = tello.Tello()
me.connect()
print(me.get_battery())

me.streamon()

global img

# Methode zur Reaktion auf Tastendrücke
# gibt Array mit Geschwindigkeitswerten für die sendRCCode Methode zurück
def getKeyBoardInout():
    # Variablen für Geschwindigkeiten: 
    # lr = leftRight
    # fb = forwardBackward
    # ud = upDown
    # yv = yawVelocity

    lr,fb,ud,yv=0,0,0,0  
    speed=50
    
    if kp.getKey("LEFT"): lr=-speed
    elif kp.getKey("RIGHT"): lr=speed

    if kp.getKey("UP"): fb=speed
    elif kp.getKey("DOWN"): fb=-speed
    
    if kp.getKey("w"): ud=speed
    elif kp.getKey("s"): ud=-speed

    if kp.getKey("a"): yv=speed
    elif kp.getKey("d"): yv=-speed

    if kp.getKey("q"): me.land()

    if kp.getKey("e"): me.takeoff()

    if kp.getKey("z"):
        cv2.imwrite(f'/Images/{time.time()}.jpg',img)
        print("Image saved")
        time.sleep(1)
    
    return [lr,fb,ud,yv]


while True:
    values=getKeyBoardInout()
    me.send_rc_control(values[0],values[1],values[2],values[3])
    img=me.get_frame_read().frame
    img=cv2.resize(img,(360,240))
    cv2.imshow("Image",img)
    cv2.waitKey(1)

