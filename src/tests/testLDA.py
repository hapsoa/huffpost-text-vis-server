import gensim
import string
from nltk.tokenize import word_tokenize
import pandas as pd


documents = ["This document is news.", "Another document is post."]

pdDataFrame = pd.DataFrame({'document': documents})

# 특수 문자 제거
pdDataFrame['clean_doc'] = pdDataFrame['document'].str.replace(
    "[^a-zA-Z]", " ")

# 길이가 3이하인 단어는 제거 (길이가 짧은 단어 제거)
pdDataFrame['clean_doc'] = pdDataFrame['clean_doc'].apply(
    lambda x: ' '.join([w for w in x.split() if len(w) > 3]))

# 전체 단어에 대한 소문자 변환
pdDataFrame['clean_doc'] = pdDataFrame['clean_doc'].apply(lambda x: x.lower())


# Each inner array can mean one document(post).
# post will not have puntuations('.') and lowercased and lemmatized.
# example) tokenized_doc = [['this', 'document', 'is', 'news'], ['another', 'document', 'is', 'post']]
tokenized_docs = []

for clean_doc in pdDataFrame['clean_doc']:
    tokenized_docs.append(word_tokenize(clean_doc))

dictionary = gensim.corpora.Dictionary(tokenized_docs)
corpus = [dictionary.doc2bow(text) for text in tokenized_docs]
# print(corpus[1])  # 수행된 결과에서 두번째 뉴스 출력. 첫번째 문서의 인덱스는 0
# print(dictionary[4])

NUM_TOPICS = 2  # 20개의 토픽, k=20
ldamodel = gensim.models.ldamodel.LdaModel(
    corpus, num_topics=NUM_TOPICS, id2word=dictionary, passes=15)

topics = ldamodel.show_topic(0, topn=10)
for topic in topics:
    print(topic)  # ('topicKeyword', 0.7)


# topics = ldamodel.print_topics(num_words=10)
# for topic in topics:
#     print(topic)
