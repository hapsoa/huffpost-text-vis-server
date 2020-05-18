# It can be done well in Upper case. I want lowercase.

import json
import codecs
import re
from nltk.tokenize import sent_tokenize
from nltk import pos_tag
# import nltk
# from nltk import Tree
import spacy
import en_core_web_sm

# test file path
# keywordObjectDictTotalTimeFilePath = '../../test-data/keywordObjectDictTotalTimeForTest.json'
# invertedIndexFilePath = '../../test-data/invertedIndexForTest.json'
# combinedLemmatizedTextFilePath = '../../test-data/combinedLemmatizedTextsForTest.json'
# writingKeywordObjectDictIncludingNer = '../../test-data/keywordObjectDictIncludingNerForTest.json'

# real file path
keywordObjectDictTotalTimeFilePath = '../../result-data/keywordObjectDictTotalTime.json'
invertedIndexFilePath = '../../result-data/invertedIndex.json'
combinedLemmatizedTextFilePath = '../../result-data/combinedLemmatizedTexts.json'
writingKeywordObjectDictIncludingNer = '../../result-data/keywordObjectDictIncludingNer.json'

# read data
keywordObjectDictTotalTime = json.load(codecs.open(
    keywordObjectDictTotalTimeFilePath, 'r', 'utf-8-sig'))
invertedIndex = json.load(codecs.open(
    invertedIndexFilePath, 'r', 'utf-8-sig'))
combinedLemmatizedTexts = json.load(codecs.open(
    combinedLemmatizedTextFilePath, 'r', 'utf-8-sig'))

# NER model
nlp = en_core_web_sm.load()

# For each keyword, find sentence including the keyword.
for (keyword, postings) in invertedIndex.items():
    document = combinedLemmatizedTexts[postings[0]]
    regexOfKeyword = re.compile(keyword)

    # spacy NER
    # if the keyword has NE, put NE
    # else if the keyword don't have NE, put POS of the keyword
    namedEntities = nlp(document)
    # print('namedEntities', namedEntities)
    for namedEntity in namedEntities.ents:
        if regexOfKeyword.search(namedEntity.text) != None:
            keywordObjectDictTotalTime[keyword]['ner'] = namedEntity.label_
            break
    if 'ner' not in keywordObjectDictTotalTime[keyword]:
        keywordObjectDictTotalTime[keyword]['ner'] = pos_tag([keyword])[0][1]


# write keywordObjectDictIncludingNER
with open(writingKeywordObjectDictIncludingNer, 'w', encoding='UTF-8-sig') as outfile:
    outfile.write(json.dumps(
        keywordObjectDictTotalTime, ensure_ascii=False))
