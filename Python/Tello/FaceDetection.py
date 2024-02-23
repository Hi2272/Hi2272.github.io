from djitellopy import tello
import cv2
import numpy as np


me=tello.Tello()
me.connect()
print(me.get_battery())

me.streamon()

while True:
    img=me.get_frame_read().frame
    img=cv2.resize(img,(360,240))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1.5, 100)
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            cv2.circle(img, (x, y), r, (0, 255, 0), 4)
            cv2.rectangle(img, (x - 5, y - 5), (x + 5, y + 5), (0, 128, 255), -1)
 
    cv2.imshow("Image",img)
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
    
# Destroy all the windows 
cv2.destroyAllWindows()     