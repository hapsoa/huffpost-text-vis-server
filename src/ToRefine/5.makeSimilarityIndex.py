from gensim import corpora
from gensim.similarities import MatrixSimilarity

# load gensim_dictionary and gensim_corpus
dictionary = corpora.Dictionary.load('../../test-data/gensimDictionary.dict')
corpus = corpora.MmCorpus('../../test-data/gensimCorpus.mm')

# make similarityIndex
similarityIndex = MatrixSimilarity(corpus, num_best=9,
                                   num_features=len(dictionary))

# save similarityIndex
similarityIndex.save('../../test-data/similarityIndexForTest')


# # test query_keywords
# queryKeywords = ['advance', 'april', 'april']

# # make doc2bow
# queryBow = dictionary.doc2bow(queryKeywords)
# print('queryBow', queryBow)

# similarityResult = similarityIndex[queryBow]
# print('similarityResult', similarityResult)
