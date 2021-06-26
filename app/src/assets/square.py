from PIL import Image

image = Image.open('imagens/Taylor Swift.jpeg')
(x,y) = image.size
print( (x,y) )

tam = min(x,y)

new_image = image

if y != tam:
    # crop((left, top, right, bottom))
    new_image = image.crop((0, 0, x, tam))
if x != tam:
    cortar = (x-y)/2
    new_image = image.crop((cortar, 0, (x-cortar), y))

print( new_image.size )

new_image.save('teste.jpeg')