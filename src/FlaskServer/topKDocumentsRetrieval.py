from gensim.similarities import MatrixSimilarity
from gensim import corpora

# corpus = corpora.MmCorpus('../../lda-ner-result-data/gensimCorpus.mm')
dictionary = corpora.Dictionary.load(
    '../../lda-ner-result-data/gensimDictionary.dict')

# load similarity_index
similarityIndex = MatrixSimilarity.load(
    '../../lda-ner-result-data/similarityIndex')


def getTopKDocuments(queryKeywords):
    # how to make queryKeywords to bow?
    print('queryKeywords', queryKeywords)
    bow = dictionary.doc2bow(queryKeywords)
    sims = similarityIndex[bow]
    print('sims', sims)
    return ''
