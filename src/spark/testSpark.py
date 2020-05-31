from pyspark.sql import SparkSession
import numpy as np
import pyspark
from pyspark.sql import Row
import json

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

queryKeyword = 'president'


def filterFunction(array, queryKeyword):
    flag = False
    for element in array:
        if queryKeyword == element.keyword:
            flag = True
            break
    return flag


def mapFunction(rows):
    fivew1hDictAboutKeywordDictAboutFrequency = {
        "what": {}, "where": {}, "when": {}, "who": {}, "why": {}, "how": {}
    }
    for rowElement in rows:
        if rowElement['keyword'] != queryKeyword:
            if rowElement['keyword'] not in fivew1hDictAboutKeywordDictAboutFrequency[rowElement['fivew1h']]:
                fivew1hDictAboutKeywordDictAboutFrequency[rowElement['fivew1h']
                                                          ][rowElement['keyword']] = 1
            else:
                fivew1hDictAboutKeywordDictAboutFrequency[rowElement['fivew1h']
                                                          ][rowElement['keyword']] += 1
    return fivew1hDictAboutKeywordDictAboutFrequency


def reduceFunction3(keywordDict1, keywordDict2):
    for (keyword, frequency) in keywordDict2.items():
        if keyword not in keywordDict1:
            keywordDict1[keyword] = frequency
        else:
            keywordDict1[keyword] += frequency
    return keywordDict1


spark = SparkSession.builder.appName("SimpleApp").getOrCreate()


# huffPostDataFilePath = '../../5w1h-test-data/huffPostDataIncludingKeywords.json'
huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'

# realtime making network
huffPostData = spark.read.json(
    huffPostDataFilePath, multiLine=True)
huffPostData.printSchema()
huffPostData.show()

rdd = huffPostData.rdd.map(lambda r: r.keywords)
filtered = rdd.filter(lambda rows: filterFunction(
    rows, queryKeyword=queryKeyword))
fivew1hDicts = filtered.map(mapFunction)
# print('fivew1hDicts', fivew1hDicts.take(1))

keywordDictsOfWhat = fivew1hDicts.map(lambda fivew1hDict: fivew1hDict['what'])
# print('keywordDictsOfWhat.take(1)', keywordDictsOfWhat.take(4))

result = keywordDictsOfWhat.reduce(reduceFunction3)
# print('result', result)

result2 = []
for (keyword, frequency) in result.items():
    result2.append(Row(keyword=keyword, frequency=frequency))


result3 = spark.createDataFrame(result2)

result4 = result3.sort('frequency', ascending=False)
result4.show()

result5 = spark.createDataFrame(result4.head(1)).toPandas().to_json()
print('result5', result5)

result6 = json.loads(result5)
print('reuslt6', result6)

result7 = {
    "keyword": result6['keyword']['0'],
    "frequency": result6['frequency']['0'],
    "fivew1h": "what"
}
print('reuslt7', result7)


spark.stop()
