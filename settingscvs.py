import pandas as pd

write_data = pd.DataFrame(columns=['x','y'])
write_data.to_csv('Sentiment_ScoresTOTAL.csv', mode='a')
