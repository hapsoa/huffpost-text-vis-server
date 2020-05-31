from pyspark.sql import SparkSession
import pyspark
from pyspark.sql import Row
import json


spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

huffPostDataFilePath = '../../5w1h-result-data/huffPostDataIncludingKeywords.json'
huffPostData = spark.read.json(
    huffPostDataFilePath, multiLine=True)

fivew1hKeywordsArray = huffPostData.rdd.map(lambda r: r.keywords)


def filterKeywordDicts(rows, queryKeyword):
    flag = False
    for element in rows:
        if queryKeyword == element.keyword:
            flag = True
            break
    return flag


def getRelatedKeywords(queryKeyword):
    fivew1hKeywordsArray.filter(lambda rows: filterKeywordDicts(
        rows, queryKeyword=queryKeyword))
    return ''
