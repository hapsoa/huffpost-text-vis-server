from gensim.similarities import MatrixSimilarity
from gensim import corpora
import json
import codecs

huffPostDataFilePath = '../../lda-ner-result-data/huffPostDataIncludingKeywords.json'

huffPostData = json.load(codecs.open(huffPostDataFilePath, 'r', 'utf-8-sig'))

# corpus = corpora.MmCorpus('../../lda-ner-result-data/gensimCorpus.mm')
dictionary = corpora.Dictionary.load(
    '../../lda-ner-result-data/gensimDictionary.dict')
# load similarity_index
similarityIndex = MatrixSimilarity.load(
    '../../lda-ner-result-data/similarityIndex')


def getTopKDocuments(queryKeywords):
    bow = dictionary.doc2bow(queryKeywords)
    sims = similarityIndex[bow]
    print('sims', sims)
    # make [(documentIndex, point)]
    # convertedSims = []
    # for sim in sims:
    #     convertedSims.append((int(sim[0]), sim[1]))

    # return convertedSims

    # return huffPostDatum
    topKHuffPostData = []
    for sim in sims:
        topKHuffPostData.append(huffPostData[sim[0]])

    return topKHuffPostData
