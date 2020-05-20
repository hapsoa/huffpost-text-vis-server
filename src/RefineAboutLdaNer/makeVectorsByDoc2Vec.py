import json
import codecs
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.test.utils import get_tmpfile
from nltk.tokenize import word_tokenize

# read combinedLemmatizedTexts.json
combinedLemmatizedTexts = json.load(codecs.open(
    '../../test-data/combinedLemmatizedTextsForTest.json', 'r', 'utf-8-sig'))

# preprocessing of documents

# tokenize the texts
tokenizedTexts = []

for text in combinedLemmatizedTexts:
    tokenizedTexts.append(word_tokenize(text))

# print('tokenizedTexts', tokenizedTexts)

documents = [TaggedDocument(doc, [i])
             for i, doc in enumerate(tokenizedTexts)]

# make doc2vec model
model = Doc2Vec(documents, vector_size=5, window=2, min_count=1, workers=4)

# save doc2vec model
model.save("../../test-data/doc2vec_model")


vectorsOfLearned = model.docvecs.vectors_docs
# same -> np.array(vectorsOfLearned).tolist()
arrayOfVectors = vectorsOfLearned.tolist()

# write textVectors
with open('../../test-data/documentVectorsForTest.json', 'w', encoding='UTF-8-sig') as outfile:
    outfile.write(json.dumps(
        arrayOfVectors, ensure_ascii=False))
