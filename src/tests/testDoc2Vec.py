from gensim.test.utils import common_texts
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.test.utils import get_tmpfile

# print('common_texts[0]', common_texts[0]) # ['human', 'interface', 'computer']

documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(common_texts)]
# print('documents[0]', documents[0]) # TaggedDocument(['human', 'interface', 'computer'], [0])

# make learned doc2vec model
model = Doc2Vec(documents, vector_size=5, window=2, min_count=1, workers=4)

# save doc2vec model
model.save("./my_doc2vec_model")

# load doc2vec model
model = Doc2Vec.load("./my_doc2vec_model")

# infer vector for new document
vector = model.infer_vector(["system", "response"])
# print('vector', vector) # [ 0.07143553  0.02083641  0.01952142 -0.04371511 -0.08409549]

# vectors of learned documuents
vectorsOfLearned = model.docvecs.vectors_docs
print('vectorsOfLearned', vectorsOfLearned)
