import json
import codecs
from gensim import corpora
import nltk
from nltk.corpus import stopwords
from pprint import pprint  # pretty-printer
from collections import defaultdict
import re
import pandas as pd
import dateutil.parser as dateutil_parser

# for test file path
# huffPostDataFilePath = '../../5w1h-test-data/rawHuffPostData.json'
# combinedLemmatizedTextsFilePath = '../../5w1h-test-data/combinedLemmatizedTexts.json'
# writingGensimDictionaryBaseFilePath = '../../5w1h-test-data/gensim-in-time/gensimDictionary'
# writingGensimCorpusBaseFilePath = '../../5w1h-test-data/gensim-in-time/gensimCorpus'

# for real file path
huffPostDataFilePath = '../../lda-ner-result-data/rawHuffPostData.json'
combinedLemmatizedTextsFilePath = '../../5w1h-result-data/combinedLemmatizedTexts.json'
writingGensimDictionaryBaseFilePath = '../../5w1h-result-data/gensim-in-time/gensimDictionary'
writingGensimCorpusBaseFilePath = '../../5w1h-result-data/gensim-in-time/gensimCorpus'

huffPostData = json.load(codecs.open(huffPostDataFilePath, 'r', 'utf-8-sig'))
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

time_dict_about_tokenized_texts = {}

# split combinedLemmatizedTexts by time
for i, huffPostDatum in enumerate(huffPostData):
    parsed_date = dateutil_parser.parse(huffPostDatum['date'])
    string_of_month = str(parsed_date.month)
    if len(string_of_month) == 1:
        string_of_month = '0' + str(parsed_date.month)
    year_month = str(parsed_date.year) + '-' + string_of_month

    if year_month not in time_dict_about_tokenized_texts:
        time_dict_about_tokenized_texts[year_month] = []

    time_dict_about_tokenized_texts[year_month].append(tokenizedTexts[i])

# write files each month
for year_month, tokenized_texts_in_time in time_dict_about_tokenized_texts.items():
    # print(year_month, tokenized_texts_in_time)
    dictionaryInTimeFilePath = writingGensimDictionaryBaseFilePath + '_' + year_month + '.dict'
    corpusInTimeFilePath = writingGensimCorpusBaseFilePath + '_' + year_month + '.mm'
    # make dictionary
    dictionary = corpora.Dictionary(tokenized_texts_in_time)
    # store the dictionary, for future reference
    dictionary.save(dictionaryInTimeFilePath)
    corpus = [dictionary.doc2bow(tokenized_text)
              for tokenized_text in tokenized_texts_in_time]
    # store corpus to disk, for later use
    corpora.MmCorpus.serialize(corpusInTimeFilePath, corpus)
