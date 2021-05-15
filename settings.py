import pandas as pd
import numpy as np
import csv
import matplotlib.pyplot as plt

read_data = pd.read_csv('Sentiment_Scores.csv')

print(read_data)

filteredData = []
dataPoints = []
y_vals = []
x_vals = []
with open('Sentiment_Scores.csv', 'r') as f:
    reader = csv.reader(f)
    for column in reader:
        object = {
            'LCCN': column[1],
            'DATE': column[2],
            'POS': column[3],
            'NEG': column[4],
            'NEU': column[5],
            'COMP': column[6],
            'STATE-TIME': column[7],
            'SCORE': 0
        }
        dataPoints.append(object)
columns = dataPoints.pop(0)

for i in dataPoints:
    if float(i['POS']) > float (i['NEG']):
        i['SCORE'] = 1
        filteredData.append(i)
        appObj = float(i['POS'])
        y_vals.append(appObj)
        write_data = pd.DataFrame([appObj])
        write_data.to_csv('Sentiment_ScoresTOTAL.csv', mode='a', header=False)
        #print(float(i['POS']))
    else:
        i['SCORE'] = 2
        filteredData.append(i)
        appObj = -1 * float(i['NEG'])
        y_vals.append(appObj)
        write_data = pd.DataFrame([appObj])
        write_data.to_csv('Sentiment_ScoresTOTAL.csv', mode='a', header=False)
        #print(-1 * float(i['NEG']))
    date = i['DATE']

    x_vals.append(date)

#print(float(dataPoints[0]['POS']))
#print(filteredData[0])
