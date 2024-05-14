import numpy as np
import cv2 as cv
cap = cv.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    # if frame is read correctly ret is True
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    # Our operations on the frame come here
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    
    # detect circles in the image
    circles = cv.HoughCircles(gray, cv.HOUGH_GRADIENT, 1.2, 100)
    if circles is not None: 
        circles = np.round(circles[0,:]).astype("int")
        for (x, y, r) in circles:
              (b,g,r)=frame[x,y]
              cv.circle(frame, (x, y), r, (0, 255, 0), 4)
              cv.circle(frame, (x, y), 2, (255, 0, 0), 4)
              print(b,g,r)
         
    else:
        print("Keine Kreise erkannt")
    cv.imshow('frame', frame)
    if cv.waitKey(1) == ord('q'):
        break
# When everything done, release the capture
cap.release()
cv.destroyAllWindows()
