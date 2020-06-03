from pyspark.sql import SparkSession
import pyspark
from pyspark.sql import Row
import json
import pandas as pd

spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
huffPostData = spark.read.json(
    huffPostDataFilePath, multiLine=True)

# [[Row(fivew1h='who', keyword='play'), ...], ...]
df_fivew1h_keywords_array = huffPostData.rdd.map(lambda r: r.keywords)


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


def reduce_keyword_dicts_by_frequency(keyword_dict1, keyword_dict2):
    for (keyword, frequency) in keyword_dict2.items():
        if keyword not in keyword_dict1:
            keyword_dict1[keyword] = frequency
        else:
            keyword_dict1[keyword] += frequency
    return keyword_dict1


def get_result(fivew1h, df_fivew1h_dicts):
    keyword_dict_of_fivew1h = df_fivew1h_dicts.map(
        lambda fivew1h_dicts: fivew1h_dicts[fivew1h]).reduce(reduce_keyword_dicts_by_frequency)
    keyword_frequency_tuple = sorted(keyword_dict_of_fivew1h.items(), key=lambda key_value: -key_value[1])[0]

    result = {
        "keyword": keyword_frequency_tuple[0],
        "fivew1h": fivew1h,
        "frequency": keyword_frequency_tuple[1]
    }
    return result


def get_related_keywords(query_keywords):
    df_filtered_5w1h_keywords_array = df_fivew1h_keywords_array.filter(lambda rows: filter_keyword_dicts(
        rows, query_keyword=query_keywords[0]))
    # print('df_filtered_5w1h_keywords_array', df_filtered_5w1h_keywords_array.take(2))
    # [[Row(fivew1h='who', keyword='donald'), ...], ...]

    df_fivew1h_dicts = df_filtered_5w1h_keywords_array.map(lambda rows_of_fivew1h_keyword:
                                                           map_function(rows_of_fivew1h_keyword,
                                                                        query_keywords[0])).cache()
    # print('df_fivew1h_dicts', df_fivew1h_dicts.take(2))
    # [{'what': {'electoral': 1, 'college': 1}, 'who': ...}, ...]

    what_result = get_result('what', df_fivew1h_dicts)
    where_result = get_result('where', df_fivew1h_dicts)
    when_result = get_result('when', df_fivew1h_dicts)
    who_result = get_result('who', df_fivew1h_dicts)
    why_result = get_result('why', df_fivew1h_dicts)
    how_result = get_result('how', df_fivew1h_dicts)

    return [what_result, where_result, when_result, who_result, why_result, how_result]


# TODO
def get_related_keywords_fast(query_keywords):
    return []
