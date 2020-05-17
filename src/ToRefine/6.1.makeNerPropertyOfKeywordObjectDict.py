import json
import codecs
from nltk.tokenize import sent_tokenize
import re
from nltk import word_tokenize, pos_tag, ne_chunk
import nltk
from nltk import Tree

# test file path
keywordObjectDictTotalTimeFilePath = '../../test-data/keywordObjectDictTotalTimeForTest.json'
invertedIndexFilePath = '../../test-data/invertedIndexForTest.json'
combinedLemmatizedTextFilePath = '../../test-data/combinedLemmatizedTextsForTest.json'
writingKeywordObjectDictIncludingNer = '../../test-data/keywordObjectDictIncludingNerForTest.json'

# read data
keywordObjectDictTotalTime = json.load(codecs.open(
    keywordObjectDictTotalTimeFilePath, 'r', 'utf-8-sig'))
invertedIndex = json.load(codecs.open(
    invertedIndexFilePath, 'r', 'utf-8-sig'))
combinedLemmatizedTexts = json.load(codecs.open(
    combinedLemmatizedTextFilePath, 'r', 'utf-8-sig'))


# For each keyword, find sentence including the keyword.
for (keyword, postings) in invertedIndex.items():
    document = combinedLemmatizedTexts[postings[0]]
    sentences = sent_tokenize(document)
    findingSentenceIndex = None
    regex = re.compile(keyword)
    for (sentenceIndex, sentence) in enumerate(sentences):
        if (regex.search(sentence) != None):
            findingSentenceIndex = sentenceIndex
            break

    # print('findingSentenceIndex', findingSentenceIndex, keyword, postings[0])
    wantingSentence = sentences[findingSentenceIndex]
    print('wantingSentence', wantingSentence)
    # NER
    posTaggedTokenizedSentence = pos_tag(word_tokenize(wantingSentence))
    nerArray = ne_chunk(posTaggedTokenizedSentence)
    for candidateOfNER in nerArray:
        # print('candidateOfNER', candidateOfNER)
        # if candidateOfNER is NE, candidateOfNER is Tree Object.
        # 'candidateOfNER.leaves()[0][0]' means keyword.
        if type(candidateOfNER) == Tree:
            print('candidateOfNER.leaves()[0][0]',
                  candidateOfNER.leaves()[0][0])
            if candidateOfNER.leaves()[0][0] == keyword:
                keywordObjectDictTotalTime[keyword]['NER'] = candidateOfNER.label(
                )
        elif candidateOfNER[0] == keyword:
            print('candidateOfNER', candidateOfNER)
            keywordObjectDictTotalTime[keyword]['NER'] = candidateOfNER[1]

# write keywordObjectDictIncludingNER
with open(writingKeywordObjectDictIncludingNer, 'w', encoding='UTF-8-sig') as outfile:
    outfile.write(json.dumps(
        keywordObjectDictTotalTime, ensure_ascii=False))
