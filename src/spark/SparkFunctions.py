from pyspark.sql import SparkSession
import pyspark
from pyspark.sql import Row
import json

spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
huffPostData = spark.read.json(
    huffPostDataFilePath, multiLine=True)

fivew1hKeywordsArray = huffPostData.rdd.map(lambda r: r.keywords)


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


def reduce_function(keyword_dict1, keyword_dict2):
    for (keyword, frequency) in keyword_dict2.items():
        if keyword not in keyword_dict1:
            keyword_dict1[keyword] = frequency
        else:
            keyword_dict1[keyword] += frequency
    return keyword_dict1


def get_related_keywords(query_keywords):
    filtered_5w1h_keywords_array = fivew1hKeywordsArray.filter(lambda rows: filter_keyword_dicts(
        rows, query_keyword=query_keywords[0]))

    fivew1h_dicts = filtered_5w1h_keywords_array.map(lambda rows_of_fivew1h_keyword:
                                                     map_function(rows_of_fivew1h_keyword, query_keywords[0]))

    keyword_dicts_of_what = fivew1h_dicts.map(
        lambda fivew1h_dict: fivew1h_dict['what'])

    result_of_what = keyword_dicts_of_what.reduce(reduce_function)

    return result_of_what
