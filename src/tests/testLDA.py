import gensim
import string
from nltk.tokenize import word_tokenize

# Each inner array can mean one document(post).
# post will not have puntuations('.') and lemmatized.
# tokenized_doc = [['Hello', '.', 'Nice', 'to',
#                   'meet', 'you', '.'], ['Yes', ',', 'I', 'am', '.'], ['I', 'like', 'fruits', '.']]

tokenized_doc = []
sentence = 'Part of the problem is that tests designed to be very sensitive to any coronavirus antibodies are more likely to detect them, meaning there would be more false positives.'
words = word_tokenize(sentence)

print('words', words)

tokenized_doc.append(words)


dictionary = gensim.corpora.Dictionary(tokenized_doc)
corpus = [dictionary.doc2bow(text) for text in tokenized_doc]
# print(corpus[1])  # 수행된 결과에서 두번째 뉴스 출력. 첫번째 문서의 인덱스는 0
print(dictionary[4])

NUM_TOPICS = 2  # 20개의 토픽, k=20
ldamodel = gensim.models.ldamodel.LdaModel(
    corpus, num_topics=NUM_TOPICS, id2word=dictionary, passes=15)


topics = ldamodel.print_topics(num_words=10)
for topic in topics:
    print(topic)

topics = ldamodel.show_topic(0, topn=10)
for topic in topics:
    print(topic)

