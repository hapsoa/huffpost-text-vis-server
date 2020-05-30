from pyspark.sql import SparkSession
import numpy as np
import pyspark

sampleResultData = {
    "what": {
        "keyword3": 4,
        "keyword12": 3
    },
    "who": {}
}

queryKeyword = 'president'


def foreachFunction(array):
    for element in array:
        print('element', element.keyword)
    return True


def filterFunction(array, queryKeyword):
    # print('rr', array)
    flag = False
    for element in array:
        if queryKeyword == element.keyword:
            flag = True
            break
    return flag


def foreachFunction2(array, resultData):
    for rowElement in array:
        print('rowElement', rowElement)
        resultData[rowElement['fivew1h']
                   ][rowElement['keyword']] = 1
    # make relation
    print('inner resultData', resultData)


def mapFunction(rows):
    fivew1hDictAboutKeywordDictAboutFrequency = {
        "what": {}, "where": {}, "when": {}, "who": {}, "why": {}, "how": {}
    }
    for rowElement in rows:
        fivew1hDictAboutKeywordDictAboutFrequency[rowElement['fivew1h']
                                                  ][rowElement['keyword']] = 1
    return fivew1hDictAboutKeywordDictAboutFrequency


def reduceFunction(fivew1hDictAboutKeyword1, fivew1hDictAboutKeyword2):
    for (fivew1h, keywordDictAboutFreqency) in fivew1hDictAboutKeyword1.items():
        for (keyword, frequency) in fivew1hDictAboutKeyword2[fivew1h].items():
            keywordDictAboutFreqency[keyword] = frequency
    return fivew1hDictAboutKeyword1


def reduceFunction2(fivew1hDictAboutKeyword1, fivew1hDictAboutKeyword2):
    result = {
        "what": {}, "where": {}, "when": {}, "who": {}, "why": {}, "how": {}
    }

    for (fivew1h, keywordDictAboutFreqency) in fivew1hDictAboutKeyword1.items():
        for (keyword, frequency) in keywordDictAboutFreqency.items():
            result[fivew1h][keyword] = frequency
    for (fivew1h, keywordDictAboutFreqency) in fivew1hDictAboutKeyword2.items():
        for (keyword, frequency) in keywordDictAboutFreqency.items():
            result[fivew1h][keyword] = frequency

    return result


spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

# keywordRelationMatrix = spark.read.json(
#     '../../5w1h-test-data/keywordRelationMatrixTotalTime.json', multiLine=True).cache()
# # keywordRelationMatrix.filter(lambda parameter_list: expression)
# # keywordRelationMatrix.printSchema()
# print(keywordRelationMatrix.take(2))
# keywordRelationMatrix.select()

# realtime making network
huffPostData = spark.read.json(
    '../../5w1h-test-data/huffPostDataIncludingKeywords.json', multiLine=True)
huffPostData.printSchema()
huffPostData.show()
# huffPostData.filter(lambda df: df.title)

rdd = huffPostData.rdd.map(lambda r: r.keywords)


def asdf():


huffPostData.groupBy('keywords').agg()
