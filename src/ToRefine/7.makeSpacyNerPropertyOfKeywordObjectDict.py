# It can be done well in Upper case. I want lowercase.

import json
import codecs
import re
from nltk.tokenize import sent_tokenize
from nltk import pos_tag
# import nltk
# from nltk import Tree
import spacy
import en_core_web_sm  # python -m spacy download en_core_web_sm

# test file path
# keywordObjectDictTotalTimeFilePath = '../../test-data/keywordObjectDictTotalTimeForTest.json'
# timeDictAboutKeywordObjectDictFilePath = '../../test-data/timeDictAboutKeywordObjectDictForTest.json'
# invertedIndexFilePath = '../../test-data/invertedIndexForTest.json'
# combinedLemmatizedTextFilePath = '../../test-data/combinedLemmatizedTextsForTest.json'
# writingKeywordObjectDictIncludingNerPath = '../../test-data/keywordObjectDictIncludingNerForTest.json'
# writingTimeDictAboutKeywordObjectDictIncludingNerPath = '../../test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json'

# real file path
keywordObjectDictTotalTimeFilePath = '../../result-data/keywordObjectDictTotalTime.json'
timeDictAboutKeywordObjectDictFilePath = '../../result-data/timeDictAboutKeywordObjectDict.json'
invertedIndexFilePath = '../../result-data/invertedIndex.json'
combinedLemmatizedTextFilePath = '../../result-data/combinedLemmatizedTexts.json'
writingKeywordObjectDictIncludingNerPath = '../../result-data/keywordObjectDictIncludingNer.json'
writingTimeDictAboutKeywordObjectDictIncludingNerPath = '../../result-data/timeDictAboutKeywordObjectDictIncludingNer.json'

# read data
keywordObjectDictTotalTime = json.load(codecs.open(
    keywordObjectDictTotalTimeFilePath, 'r', 'utf-8-sig'))
timeDictAboutKeywordObjectDict = json.load(codecs.open(
    timeDictAboutKeywordObjectDictFilePath, 'r', 'utf-8-sig'))
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
    namedEntityResult = None
    for namedEntity in namedEntities.ents:
        # if namedEntity.text == 'zelenskiy':
        #     print(namedEntity.text, namedEntity.label_)
        if regexOfKeyword.search(namedEntity.text) != None:
            namedEntityResult = namedEntity.label_
            break
    if namedEntityResult == None:
        namedEntityResult = pos_tag([keyword])[0][1]

    keywordObjectDictTotalTime[keyword]['ner'] = namedEntityResult

    # for each timeUnit,
    for (time, keywordObjectDict) in timeDictAboutKeywordObjectDict.items():
        if keyword in keywordObjectDict:
            keywordObjectDict[keyword]['ner'] = namedEntityResult


# write keywordObjectDictIncludingNER
with open(writingKeywordObjectDictIncludingNerPath, 'w', encoding='UTF-8-sig') as outfile, open(writingTimeDictAboutKeywordObjectDictIncludingNerPath, 'w', encoding='UTF-8-sig') as outfile2:
    outfile.write(json.dumps(
        keywordObjectDictTotalTime, ensure_ascii=False))
    outfile2.write(json.dumps(
        timeDictAboutKeywordObjectDict, ensure_ascii=False))
