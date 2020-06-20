from gensim.similarities import MatrixSimilarity
from gensim import corpora
import json
import codecs
import utils
import re

huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
gensimDictionaryInTimeBaseFilePath = '../../5w1h-result-data/gensim-in-time/gensimDictionary'
gensimSimilarityIndexInTimeBaseFilePath = '../../5w1h-result-data/gensim-in-time/similarityIndex'

huffPostData = json.load(codecs.open(huffPostDataFilePath, 'r', 'utf-8-sig'))

# corpus = corpora.MmCorpus('../../lda-ner-result-data/gensimCorpus.mm')
dictionary = corpora.Dictionary.load(
    '../../5w1h-result-data/gensimDictionary.dict')
# load similarity_index
similarityIndex = MatrixSimilarity.load(
    '../../5w1h-result-data/similarityIndex')


def get_top_k_documents_total_time(queryKeywords):
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


# read gensimDictionary and similarityIndex in time
time_dict_about_dictionary = {}
time_dict_about_similarity_index = {}
year_months = utils.make_year_months_from_huff_post_data(huffPostData)
for year_month in year_months:
    dictionary_in_time_file_path = gensimDictionaryInTimeBaseFilePath + '_' + year_month + '.dict'
    similarity_index_in_time_file_path = gensimSimilarityIndexInTimeBaseFilePath + '_' + year_month
    time_dict_about_dictionary[year_month] = corpora.Dictionary.load(dictionary_in_time_file_path)
    time_dict_about_similarity_index[year_month] = MatrixSimilarity.load(similarity_index_in_time_file_path)


# return topKHuffPostData in time


def get_top_k_documents_in_time(query_keywords, year_month):
    print('query_keywords', query_keywords)
    print('year_month', year_month)
    dictionary_in_time = time_dict_about_dictionary[year_month]
    similarity_in_time = time_dict_about_similarity_index[year_month]
    regex = re.compile(year_month)
    huff_post_data_in_time = list(filter(
        lambda huff_post_datum: regex.match(huff_post_datum['date']) is not None,
        huffPostData))

    bow = dictionary_in_time.doc2bow(query_keywords)
    sims = similarity_in_time[bow]

    top_k_huff_post_data = []
    for sim in sims:
        top_k_huff_post_data.append(huff_post_data_in_time[sim[0]])

    return top_k_huff_post_data
