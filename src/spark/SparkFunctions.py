from pyspark.sql import SparkSession
import pyspark
from pyspark.sql import Row
import json

spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
huffPostData = spark.read.json(
    huffPostDataFilePath, multiLine=True)

df_fivew1h_keywords_array = huffPostData.rdd.map(lambda r: r.keywords)


# print('df_fivew1h_keywords_array', df_fivew1h_keywords_array.take(2))
# [[Row(fivew1h='who', keyword='play'), ...], ...]

def filter_keyword_dicts(rows, query_keyword):
    flag = False
    for element in rows:
        if query_keyword == element.keyword:
            flag = True
            break
    return flag


def map_function(rows_of_fivew1h_keyword, query_keyword):
    fivew1h_dict_about_keyword_dict_about_frequency = {
        "what": {}, "where": {}, "when": {}, "who": {}, "why": {}, "how": {}
    }
    for rowElement in rows_of_fivew1h_keyword:
        if rowElement['keyword'] != query_keyword:
            if rowElement['keyword'] not in fivew1h_dict_about_keyword_dict_about_frequency[rowElement['fivew1h']]:
                fivew1h_dict_about_keyword_dict_about_frequency[rowElement['fivew1h']
                ][rowElement['keyword']] = 1
            else:
                fivew1h_dict_about_keyword_dict_about_frequency[rowElement['fivew1h']
                ][rowElement['keyword']] += 1
    return fivew1h_dict_about_keyword_dict_about_frequency


# def map_function2(fivew1h):
#     return fivew1h_dicts.map(
#         lambda fivew1h_dict: fivew1h_dict[fivew1h])


def reduce_function(keyword_dict1, keyword_dict2):
    for (keyword, frequency) in keyword_dict2.items():
        if keyword not in keyword_dict1:
            keyword_dict1[keyword] = frequency
        else:
            keyword_dict1[keyword] += frequency
    return keyword_dict1


def get_related_keywords(query_keywords):
    df_filtered_5w1h_keywords_array = df_fivew1h_keywords_array.filter(lambda rows: filter_keyword_dicts(
        rows, query_keyword=query_keywords[0]))
    # print('df_filtered_5w1h_keywords_array', df_filtered_5w1h_keywords_array.take(2))
    # [[Row(fivew1h='who', keyword='donald'), ...], ...]

    df_fivew1h_dicts = df_filtered_5w1h_keywords_array.map(lambda rows_of_fivew1h_keyword:
                                                           map_function(rows_of_fivew1h_keyword, query_keywords[0]))
    # print('df_fivew1h_dicts', df_fivew1h_dicts.take(2))
    # [{'what': {'electoral': 1, 'college': 1}, 'who': ...}, ...]

    fivew1hs = ['what', 'who', 'where', 'when', 'why', 'how']
    fivew1h_list_of_df_keyword_dicts = list(map(lambda fivew1h: df_fivew1h_dicts.map(
        lambda fivew1h_dict: fivew1h_dict[fivew1h]), fivew1hs))

    results = list(
        map(lambda df_keyword_dicts: df_keyword_dicts.reduce(reduce_function), fivew1h_list_of_df_keyword_dicts))
    # [{"keyword1": 3, ...}, ...]
    return results

    # keyword_dicts_of_what = df_fivew1h_dicts.map(
    #     lambda fivew1h_dict: fivew1h_dict['what'])
    # result_of_what = keyword_dicts_of_what.reduce(reduce_function)

    # print(5, result_of_what)
    # return result_of_what
