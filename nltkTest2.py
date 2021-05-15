import pandas as pd
import json
import re
import string
######################################################
#Used to format the data into json and get it ready to preprocess for nltk. Inefficient, messy, but usable
text = open('./stateData1776.1790/1776.1790.dataReceivedPennsylvania.txt', encoding='utf-8').read()
textArray = text.split('}{')
textArray[0] = textArray[0].replace('{', '')
textArray[-1] = textArray[-1].replace('}', '')
#take care of extra bracket ^^^^^
jsonTextArray = []
for i in range(len(textArray)):
    phrase = '{' + textArray[i] + '}'
    phrase2 = phrase.split('"ocr":"')
    phrase2[1] = phrase2[1].replace(":", "")
    phrase3 = '"ocr":"'.join(phrase2)
    phrase4 = json.loads(phrase3)
    print(phrase4['date'])
    temp = phrase4['ocr'].lower()
    temp2 = temp.translate(str.maketrans(' ',' ', string.punctuation))
    jsonTextArray.append(temp2)


print(jsonTextArray[0]['ocr'])
#this is supposed to remove duplicates
#jsonTextArrayNR = list(set(jsonTextArray))
#print(json.loads(jsonTextArrayNR[0])['ocr'])
#print(jsonTextArray[0]['ocr'])

tokenized_words = []

for x in range(len(jsonTextArray)):
    #print(type(json.loads(lowerCaseJSON[x])['ocr']))
    splitOCR = jsonTextArray[x]['ocr'].split()
    jsonTextArray[x]['ocr'] = splitOCR
    tokenized_words.append(jsonTextArray[x])

print(tokenized_words)
