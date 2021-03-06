import json
import codecs
from gensim import corpora
import nltk
from nltk.corpus import stopwords
from pprint import pprint  # pretty-printer
from collections import defaultdict
import re
import pandas as pd

# for test file path
# combinedLemmatizedTextsFilePath = '../../5w1h-test-data/combinedLemmatizedTexts.json'
# writingGensimDictionaryFilePath = '../../5w1h-test-data/gensimDictionary.dict'
# writingGensimCorpusFilePath = '../../5w1h-test-data/gensimCorpus.mm'

# for real file path
combinedLemmatizedTextsFilePath = '../../5w1h-result-data/combinedLemmatizedTexts.json'
writingGensimDictionaryFilePath = '../../5w1h-result-data/gensimDictionary.dict'
writingGensimCorpusFilePath = '../../5w1h-result-data/gensimCorpus.mm'

# read combinedLemmatizedTextsForTest.json
combinedLemmatizedTexts = json.load(codecs.open(
    combinedLemmatizedTextsFilePath, 'r', 'utf-8-sig'))

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
dictionary.save(writingGensimDictionaryFilePath)

# if you want load dictionary
# corpora.Dictionary.load('../../test-data/gensimDictionary.dict')

# for each text, make vectorOfBOW
corpus = [dictionary.doc2bow(tokenizedText)
          for tokenizedText in tokenizedTexts]


# store corpus to disk, for later use
corpora.MmCorpus.serialize(writingGensimCorpusFilePath, corpus)

# load corpus
# corpus = corpora.MmCorpus('../../test-data/gensimCorpus.mm')
# list(corpus) => real corpus text data
