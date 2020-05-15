import json
import codecs
from gensim import corpora
import nltk
from nltk.corpus import stopwords
from pprint import pprint  # pretty-printer
from collections import defaultdict
import re
import pandas as pd

# read combinedLemmatizedTextsForTest.json
combinedLemmatizedTexts = json.load(codecs.open(
    '../../test-data/combinedLemmatizedTextsForTest.json', 'r', 'utf-8-sig'))

# preprocessing of combinedLemmatizedTexts

pdDataFrame = pd.DataFrame({'documents': combinedLemmatizedTexts})
# 특수 문자 제거
pdDataFrame['clean_docs'] = pdDataFrame['documents'].str.replace(
    "[^a-zA-Z]", " ")
# 길이가 3이하인 단어는 제거 (길이가 짧은 단어 제거)
pdDataFrame['clean_docs'] = pdDataFrame['clean_docs'].apply(
    lambda x: ' '.join([w for w in x.split() if len(w) > 3]))

# remove common words and tokenize
stop_words = set(stopwords.words('english'))

tokenizedTexts = [
    [word for word in document.split() if word not in stop_words]
    for document in pdDataFrame['clean_docs']
]

# remove words that appear only once
frequency = defaultdict(int)
for text in tokenizedTexts:
    for token in text:
        frequency[token] += 1

tokenizedTexts = [
    [token for token in text if frequency[token] > 1]
    for text in tokenizedTexts
]


# make dictionary
dictionary = corpora.Dictionary(tokenizedTexts)

# store the dictionary, for future reference
dictionary.save('../../test-data/gensimDictionary.dict')

# for each text, make vectorOfBOW
corpus = [dictionary.doc2bow(tokenizedText)
          for tokenizedText in tokenizedTexts]

# store corpus to disk, for later use
corpora.MmCorpus.serialize('../../test-data/gensimCorpus.mm', corpus)

# load corpus
# corpus = corpora.MmCorpus('../../test-data/gensimCorpus.mm') # list(corpus) => real corpus text data
