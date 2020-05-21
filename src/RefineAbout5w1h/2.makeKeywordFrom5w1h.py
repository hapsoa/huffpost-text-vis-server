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
# writingHuffPostDataIncludingKeywordsFilePath = '../../5w1h-test-data/huffPostDataIncludingKeywords.json'
# real file path
huffPostDataFilePath = '../../lda-ner-result-data/rawHuffPostData.json'
writingHuffPostDataIncludingKeywordsFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
writingErrorIndexesFilePath = '../../5w1h-result-data/keywordMakingErrorIndexes.json'

huffPostData = json.load(codecs.open(
    huffPostDataFilePath, 'r', 'utf-8-sig'))
extractor = MasterExtractor()
wordNetLemmatizer = WordNetLemmatizer()

errorIndexes = []

print('start')

# for each keyword,
# make 5w1h
# make keyword from 5w1h
for (i, huffPostDatum) in enumerate(huffPostData):
    try:

        huffPostDatum['keywords'] = []

        print(i, 'th index start')
        doc = Document(huffPostDatum['title'], huffPostDatum['subtitle'],
                       huffPostDatum['content'], huffPostDatum['date'])
        # doc = Document.from_text(huffPostDatum['content'], huffPostDatum['date'])
        print(i, 'extractor.parse(doc) start')
        doc = extractor.parse(doc)

        print(i, 'doc.get_answers() start')

        answers = doc.get_answers()

        print(i, 'for start')

        for (fivew1h, answer) in answers.items():
            if len(answer) != 0:
                text = answer[0].get_parts_as_text()
                words = word_tokenize(text)
                wordPosTuples = pos_tag(words)

                for wordPosTuple in wordPosTuples:
                    if wordPosTuple[1].startswith('N'):
                        lemmatizedWord = wordNetLemmatizer.lemmatize(
                            wordPosTuple[0].lower())
                        huffPostDatum['keywords'].append({
                            'keyword': lemmatizedWord, 'fivew1h': fivew1h})

    except socket.timeout as err:
        print('socket.timeout', err)
        errorIndexes.append(i)
    except socket.error as err:
        print('socket.error', err)
        errorIndexes.append(i)
    except Exception as ex:  # 에러 종류
        print('에러가 발생 했습니다', ex)  # ex는 발생한 에러의 이름을 받아오는 변수
        errorIndexes.append(i)


# how to make keywords' relation?
# keyword1 and keyword2 from 5w1h by same news.

# write huffPostDataIncludingKeywords.json
with open(writingHuffPostDataIncludingKeywordsFilePath, 'w', encoding='UTF-8-sig') as outfile, open(writingErrorIndexesFilePath, 'w', encoding='UTF-8-sig') as outfile2:
    outfile.write(json.dumps(
        huffPostData, ensure_ascii=False))
    outfile2.write(json.dumps(
        errorIndexes, ensure_ascii=False))
