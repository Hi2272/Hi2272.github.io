from djitellopy import tello
import cv2
import numpy as np


me=tello.Tello()
me.connect()
print(me.get_battery())


me.streamon()

#me.set_video_direction(me.CAMERA_DOWNWARD)

while True:
    img=me.get_frame_read().frame
    
    cv2.imshow("Image",img)
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
    
# Destroy all the windows 
cv2.destroyAllWindows()     