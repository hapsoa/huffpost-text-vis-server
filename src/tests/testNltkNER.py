# NLTK NER can only be used in upper case.

from nltk import word_tokenize, pos_tag, ne_chunk
import nltk
# nltk.download('maxent_ne_chunker')
# nltk.download('words')

sentence = "James is working at Disney in London"
posTaggedTokenizedSentence = pos_tag(word_tokenize(sentence))
print('posTagTokenizedSentence', posTaggedTokenizedSentence)  # 토큰화와 품사 태깅을 동시 수행

nerResult = ne_chunk(posTaggedTokenizedSentence)
print(nerResult)  # 개체명 인식
# if Tree object, label() returns 'PERSON', or ...
print('named-entity', nerResult[0].label())
# the word 'James'
print('keyword', nerResult[0].leaves()[0][0])
# 'is/VBZ' to 'VBZ'
print('1', nerResult[1][1])
