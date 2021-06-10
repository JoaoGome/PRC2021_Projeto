import csv
import json

jsonObjects = []


with open('./SuperheroDataset.csv') as csvFile:
    csv_reader = csv.reader(csvFile, delimiter=",")
    lineCount = 0
    for row in csv_reader:
        if lineCount == 0:
            lineCount += 1

        else:
            dic = {
                    "Name": row[2],
                    "FullName": row[10],
                    "AlterEgos": row[11],
                    "FirstAppearance": row[14],
                    "Creator": row[15],
                  }

            with open('./super_hero_powers.csv') as powersFile:
                powersreader = csv.reader(powersFile,delimiter=",")
                lineCount = 0
                columns = []
                for data in powersreader:
                    if lineCount == 0:
                        for coisa in data:
                            columns.append(coisa.replace(' ','_'))
                        lineCount += 1

                    else:
                        if (data[0] == row[2]):
                            for i  in range(1,len(data)):
                                if data[i] == "True":
                                    dic[f'{columns[i]}'] = "True"

            jsonObjects.append(dic)

print(json.dumps(jsonObjects,indent = 4))