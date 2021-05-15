import pandas as pd
import json
import re
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer



######################################################
#Used to format the data into json and get it ready to preprocess for nltk. Inefficient, messy, but usable
text = open('./stateData1833.1850/1833.1850.dataReceivedVirginia.txt', encoding='utf-8').read()
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
    #print(phrase4['date'])
    jsonTextArray.append(phrase4)

##check for code block
#print(jsonTextArray[0]['ocr'])
#this is supposed to remove duplicates
#jsonTextArrayNR = list(set(jsonTextArray))
        #print(jsonTextArray[0]['ocr'])
########################################################
#now we iterate through and get it all ready to format
lowerCaseJsonSA = []
lowerCaseJSON = []
for z in range(len(jsonTextArray)):
    temp = jsonTextArray[z]['ocr'].lower()
    temp2 = temp.translate(str.maketrans(' ',' ', string.punctuation))
    jsonTextArray[z]['ocr'] = temp2
    strForRMDup = json.dumps(jsonTextArray[z])
    lowerCaseJSON.append(strForRMDup)
    lowerCaseJsonSA.append(jsonTextArray[z])
#data cleaned
##AT THE MOMENT, WE ARE NOT ATTACHING DATES TO THESE OBJECTS. THIS COULD BE AN ISSUE, SO WE WOULD CHANGE THAT IN THE CODE BLOCK ABOVE, SO THAT THEY ARE PASSED CONTINUOUSLY.
#check for code block
    #print(lowerCaseJSON[0])
########################################################
#Get rid of duplicates

#lowerCaseJSON = list(set(lowerCaseJSON))

########################################################
tokenized_words = []

for x in range(len(lowerCaseJSON)):
    #print(lowerCaseJSON[x])
    #print(type(json.loads(lowerCaseJSON[x])['ocr']))
    jsonObj = json.loads(lowerCaseJSON[x])
    splitOCR = word_tokenize(jsonObj['ocr'], 'english', )
    jsonObj['ocr'] = splitOCR
    tokenized_words.append(jsonObj)

#print(tokenized_words[0]['date'])
########################################################
##REMOVE stop_words
final_words = []
for w in range(len(tokenized_words)):
    active_words = []
    for g in tokenized_words[w]['ocr']:
        if g not in stopwords.words('english'):
            active_words.append(g)

    tokenized_words[w]['ocr'] = active_words
    final_words.append(tokenized_words[w])
#print(final_words[0])
#########################################################
#MAIN PROBLEMS- CAP ON DATA (500), REPEATED ARTICLES, WHICH MAY THROW RESULTS OFF
def sentiment_analyze(sentiment_text):
    score = SentimentIntensityAnalyzer().polarity_scores(sentiment_text['ocr'])
    print(score)
    pos = score['pos']
    neg = score['neg']
    neu = score['neu']
    comp = score['compound']
    write_data = pd.DataFrame([[sentiment_text['lccn'], sentiment_text['date'], pos, neg, neu, comp, 'VA-1833.1850']])
    write_data.to_csv('Sentiment_Scores.csv', mode='a', header=False)

for t in range(len(lowerCaseJsonSA)):
    sentiment_analyze(lowerCaseJsonSA[t])





#sentiment_analyze(lowerCaseJsonSA[0])
