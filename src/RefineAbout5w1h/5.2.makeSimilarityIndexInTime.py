"""
Make similarity_index in time for top K documents retrieval
"""

import json
import codecs
from gensim import corpora
from gensim.similarities import MatrixSimilarity
import utils

# for real file path
huffPostDataFilePath = '../../lda-ner-result-data/rawHuffPostData.json'
gensimDictionaryBaseFilePath = '../../5w1h-result-data/gensim-in-time/gensimDictionary'
gensimCorpusBaseFilePath = '../../5w1h-result-data/gensim-in-time/gensimCorpus'
writingSimilarityIndexBaseFilePath = '../../5w1h-result-data/gensim-in-time/similarityIndex'

huffPostData = json.load(codecs.open(huffPostDataFilePath, 'r', 'utf-8-sig'))
year_months = utils.make_year_months_from_huff_post_data(huffPostData)

print('year_months', year_months)

# read dictionary and corpus in times
for year_month in year_months:
    dictionary_in_time_file_path = gensimDictionaryBaseFilePath + '_' + year_month + '.dict'
    corpus_in_time_file_path = gensimCorpusBaseFilePath + '_' + year_month + '.mm'

    dictionary = corpora.Dictionary.load(dictionary_in_time_file_path)

    corpus = corpora.MmCorpus(corpus_in_time_file_path)

    # make similarityIndex
    similarityIndex = MatrixSimilarity(corpus, num_best=10,
                                       num_features=len(dictionary))

    similarityIndex.save(writingSimilarityIndexBaseFilePath + '_' + year_month)
