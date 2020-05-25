# Make similarity_index code for top K documents retrieval

from gensim import corpora
from gensim.similarities import MatrixSimilarity

# for test file path
gensimDictionaryFilePath = '../../5w1h-test-data/gensimDictionary.dict'
gensimCorpusFilePath = '../../5w1h-test-data/gensimCorpus.mm'
writingSimilarityIndexFilePath = '../../5w1h-test-data/similarityIndex'

# for real file path
# gensimDictionaryFilePath = '../../result-data/gensimDictionary.dict'
# gensimCorpusFilePath = '../../result-data/gensimCorpus.mm'
# writingSimilarityIndexFilePath = '../../result-data/similarityIndex'

# load gensim_dictionary and gensim_corpus
dictionary = corpora.Dictionary.load(gensimDictionaryFilePath)
corpus = corpora.MmCorpus(gensimCorpusFilePath)

# make similarityIndex
similarityIndex = MatrixSimilarity(corpus, num_best=9,
                                   num_features=len(dictionary))

# save similarityIndex
similarityIndex.save(writingSimilarityIndexFilePath)


# # test query_keywords
# queryKeywords = ['advance', 'april', 'april']

# # make doc2bow
# queryBow = dictionary.doc2bow(queryKeywords)
# print('queryBow', queryBow)

# similarityResult = similarityIndex[queryBow]
# print('similarityResult', similarityResult)
