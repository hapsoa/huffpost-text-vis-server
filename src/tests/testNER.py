from nltk import word_tokenize, pos_tag, ne_chunk
import nltk
nltk.download('maxent_ne_chunker')
nltk.download('words')

sentence = "James is working at Disney in London"
sentence = pos_tag(word_tokenize(sentence))
print(sentence)  # 토큰화와 품사 태깅을 동시 수행

sentence = ne_chunk(sentence)
print(sentence)  # 개체명 인식
