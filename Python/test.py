import cv2

# Laden Sie die Bilder
image1 = cv2.imread('/home/rainer/Dokumente/Hi2272.github.io/Python/bild1.jpg')
cv2.imshow("1",image1)
cv2.waitKey(0)
image2 = cv2.imread('/home/rainer/Dokumente/Hi2272.github.io/Python/bild2.jpg')
cv2.imshow("2",image2)
cv2.waitKey(0)

image3 = cv2.imread('/home/rainer/Dokumente/Hi2272.github.io/Python/bild3.jpg')
cv2.imshow("3",image3)
cv2.waitKey(0)

# Erstellen Sie eine Liste der Bilder
images = [image1, image2, image3]

# Erstellen Sie einen Stitcher
stitcher = cv2.Stitcher_create() 

# Stitchen Sie die Bilder
status, stitched_image = stitcher.stitch(images)
print(status)
# Zeigen Sie das gestitchte Bild an
cv2.imshow("Stitched Image", stitched_image)
cv2.waitKey(0)