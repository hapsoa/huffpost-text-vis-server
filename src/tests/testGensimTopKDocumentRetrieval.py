from gensim.test.utils import common_corpus, common_dictionary
from gensim.similarities import MatrixSimilarity

print('common_corpus', common_corpus)  # bag of words format
print('common_dictionary', common_dictionary)

# query document (BOW format. This can be query keywords)
query = [(1, 2), (5, 1)]

index = MatrixSimilarity(common_corpus, num_best=9,
                         num_features=len(common_dictionary))

# save the similarity_index
# index.save('./similarityIndex')

# load similarity_index
# index = MatrixSimilarity.load('./similarityIndex')

sims = index[query]

print('sims', sims)
