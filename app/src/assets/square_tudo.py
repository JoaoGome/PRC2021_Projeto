from PIL import Image
import os


for file in os.scandir('imagens'):

    image = Image.open('imagens/' + file.name)
    (x,y) = image.size

    tam = min(x,y)

    new_image = image

    if y != tam:
        new_image = image.crop((0, 0, x, tam))
    if x != tam:
        cortar = (x-y)/2
        new_image = image.crop((cortar, 0, (x-cortar), y)) 

    print(file.name)
    new_image.save(file.name)