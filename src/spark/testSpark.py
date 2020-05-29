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

resultData = {
    "what": {}, "where": {}, "when": {}, "who": {}, "why": {}, "how": {}
}
queryKeyword = 'trump'


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


def reduceFunction(rows, result, resultData):
    print('rows!!!', rows)
    print('result!!!', result)
    for rowElement in rows:
        result[rowElement['fivew1h']
               ][rowElement['keyword']] = 1
    # make relation
    print('inner resultData', resultData)
    print('inner result', result)
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
# print(rdd.take(2))

# rdd.foreach(foreachFunction)
filtered = rdd.filter(lambda rows: filterFunction(
    rows, queryKeyword=queryKeyword))
# print('filtered', filtered.take(1))

# filtered.foreach(lambda rows: foreachFunction2(rows, resultData=resultData))

result1 = filtered.reduce(
    lambda rows, result: reduceFunction(rows, result, resultData))

# print('resultData', resultData)
# why outer resultData is gone?

print('result1', result1)


spark.stop()
