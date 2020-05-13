import pandas as pd


documents = ["This document is news.", "Another document is post."]

dataFrame = pd.DataFrame({'document': documents})

# 특수 문자 제거
dataFrame['clean_doc'] = dataFrame['document'].str.replace("[^a-zA-Z]", " ")

# 길이가 3이하인 단어는 제거 (길이가 짧은 단어 제거)
dataFrame['clean_doc'] = dataFrame['clean_doc'].apply(
    lambda x: ' '.join([w for w in x.split() if len(w) > 3]))

# 전체 단어에 대한 소문자 변환
dataFrame['clean_doc'] = dataFrame['clean_doc'].apply(lambda x: x.lower())

# print(dataFrame['clean_doc'])

for datum in dataFrame['clean_doc']:
    print(datum)
