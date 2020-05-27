import json
import codecs
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from Giveme5W1H.extractor.document import Document
from Giveme5W1H.extractor.extractor import MasterExtractor
from nltk.stem import WordNetLemmatizer
import socket

# read huffPostData.json
# test file path
# huffPostDataFilePath = '../../5w1h-test-data/rawHuffPostData.json'
# keywordsTextFilePath = '../../5w1h-test-data/keywordsTextFile.txt'
# writingErrorIndexesFilePath = '../../5w1h-test-data/keywordMakingErrorIndexes.json'
# real file path
huffPostDataFilePath = '../../lda-ner-result-data/rawHuffPostData.json'
keywordsTextFilePath = '../../5w1h-result-data/keywordsTextFile.txt'
writingErrorIndexesFilePath = '../../5w1h-result-data/keywordMakingErrorIndexes.json'

huffPostData = json.load(codecs.open(
    huffPostDataFilePath, 'r', 'utf-8-sig'))
keywordsTextFile = codecs.open(
    keywordsTextFilePath, 'r', 'utf-8-sig')

# find start index by readLengh
startTextFileLength = len(keywordsTextFile.readlines())

extractor = MasterExtractor()
wordNetLemmatizer = WordNetLemmatizer()

errorIndexes = []
print('process start')
with open(keywordsTextFilePath, 'a') as f:
    # f.write('\nasdf')
    for i in range(startTextFileLength, len(huffPostData)):
        # for i in range(startTextFileLength, 22552):
        try:
            print(i, 'th index start')
            huffPostDatum = huffPostData[i]
            keywords = []
            doc = Document(huffPostDatum['title'], huffPostDatum['subtitle'],
                           huffPostDatum['content'], huffPostDatum['date'])
            print(i, 'extractor.parse(doc) start')
            doc = extractor.parse(doc)
            print(i, 'doc.get_answers() start')
            answers = doc.get_answers()

            for (fivew1h, answer) in answers.items():
                if len(answer) != 0:
                    text = answer[0].get_parts_as_text()
                    words = word_tokenize(text)
                    wordPosTuples = pos_tag(words)

                    for wordPosTuple in wordPosTuples:
                        if wordPosTuple[1].startswith('N'):
                            lemmatizedWord = wordNetLemmatizer.lemmatize(
                                wordPosTuple[0].lower())
                            keywords.append({
                                'keyword': lemmatizedWord, 'fivew1h': fivew1h})
            keywordsJsonString = json.dumps(keywords)
            if i != 0:
                keywordsJsonString = '\n' + keywordsJsonString
            f.write(keywordsJsonString)

        except Exception as ex:  # 에러 종류
            print('에러가 발생 했습니다', ex)  # ex는 발생한 에러의 이름을 받아오는 변수
            errorIndexes.append(i)


# how to make keywords' relation?
# keyword1 and keyword2 from 5w1h by same news.

# write huffPostDataIncludingKeywords.json
with open(writingErrorIndexesFilePath, 'w', encoding='UTF-8-sig') as outfile:
    outfile.write(json.dumps(
        errorIndexes, ensure_ascii=False))


# It can read json from text
# TODO print('!', json.loads(keywordsTextFile.readline()))
