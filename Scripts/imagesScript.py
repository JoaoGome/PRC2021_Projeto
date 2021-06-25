import os
from simple_image_download import simple_image_download as simp 
import csv

artists = []
with open('../Datasets/1.csv') as csvFile:
    rowNumber = 0
    csv_reader = csv.reader(csvFile, delimiter=",")

    while rowNumber < 500:
        for row in csv_reader:
            if rowNumber == 0:
                rowNumber += 1

            else:
                artists.append(row[0].strip())
                rowNumber += 1


for a in artists:
    new_file = os.path.join(f'''images/''',f'''{a}.jpeg''')
    try:
        old_file = os.path.join(f'''simple_images/{a.replace(' ','_')}/''',f'''{a}_1.jpeg''')
        os.rename(old_file,new_file)
    except:
        try:
            old_file = os.path.join(f'''simple_images/{a.replace(' ','_')}/''',f'''{a}_1.png''')
            os.rename(old_file,new_file)
        except:     
            pass

    

'''
response = simp.simple_image_download
i = 0
for rep in artists:
    print(i)
    i += 1
    response().download(rep,1)
    '''