import cv2
print(cv2.__version__)
from cv2 import Stitcher
stitcher = cv2.Stitcher.create(cv2.Stitcher_SCANS)
stitcher.setConfidenceLevel(0);
img=[]
img.append(cv2.imread("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/Bild1.jpg"))
img.append(cv2.imread("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/Bild2.jpg"))
img.append(cv2.imread("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/Bild3.jpg"))
img.append(cv2.imread("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/Bild4.jpg"))
img.append(cv2.imread("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/Bild5.jpg"))

(_result, pano) = stitcher.stitch(img)
print(_result)
cv2.imshow('pano',pano)
cv2.imwrite("C:/Users/hille/OneDrive - Gymnasium Waldkraiburg/Dokumente/Hi2272.github.io/Python/pano.jpg",pano)
cv2.waitKey(0)
