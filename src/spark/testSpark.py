from pyspark.sql import SparkSession
import numpy as np
import pyspark

spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

# keywordRelationMatrix = spark.read.json(
#     '../../5w1h-test-data/keywordRelationMatrixTotalTime.json').cache()

# huffPostData = spark.read.json(
#     '../../5w1h-test-data/huffPostDataIncludingKeywords.json')

testData = spark.read.json('./testFile.json')

testData.printSchema()

print(testData.take(1))

# print(keywordRelationMatrix.first())

# keywordRelationMatrix.filter(lambda parameter_list: expression)

# keywordRelationMatrix.printSchema()
# print(keywordRelationMatrix.take(7))

# huffPostData.printSchema()

spark.stop()
