# -*- coding: utf-8 -*-

from flask import Flask, request
from flask import jsonify
from flask_cors import CORS  # installation command : pip install -U flask-cors
import json
import codecs
import topKDocumentsRetrieval

app = Flask(__name__)
cors = CORS(app)

# test files
# timeDictAboutKeywordObjectDictFilePath = '../../lda-ner-test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json'

# lda-ner files
# timeDictAboutKeywordObjectDictFilePath = '../../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json'
# keywordRelationMatrixTotalTimeFilePath = '../../lda-ner-result-data/keywordRelationMatrixTotalTime.json'
# alphabetIndexDictAboutKeywordFilePath = '../../lda-ner-result-data/alphabetIndexDictAboutKeyword.json'
# 5w1h files
timeDictAboutKeywordObjectDictFilePath = '../../5w1h-result-data/timeDictAboutKeywordObjectDict.json'
keywordRelationMatrixTotalTimeFilePath = '../../5w1h-result-data/keywordRelationMatrixTotalTime.json'
alphabetIndexDictAboutKeywordFilePath = '../../5w1h-result-data/alphabetIndexDictAboutKeyword.json'

timeDictAboutKeywordObjectDict = json.load(codecs.open(
    timeDictAboutKeywordObjectDictFilePath, 'r', 'utf-8-sig'))
keywordRelationMatrixTotalTime = json.load(codecs.open(
    keywordRelationMatrixTotalTimeFilePath, 'r', 'utf-8-sig'))
alphabetIndexDictAboutKeyword = json.load(codecs.open(
    alphabetIndexDictAboutKeywordFilePath, 'r', 'utf-8-sig'))


@app.route('/', methods=['POST'])
def post():
    return jsonify({
        "hello": "hello"
    })


# get top k documents from query keyword in total time
@app.route('/top-k-documents', methods=['POST'])
def get_top_k_documents_total_time():
    query_keywords = request.json
    top_k_huff_post_data = topKDocumentsRetrieval.get_top_k_documents_total_time(
        query_keywords)

    return jsonify(top_k_huff_post_data)


# get top k documents from query keyword in time
@app.route('/top-k-documents-in-time', methods=['POST'])
def get_top_k_documents_in_time():
    # query_keywords = request.json
    request_data = request.json
    query_keywords = request_data['queryKeywords']
    year_month = request_data['yearMonth']

    top_k_huff_post_data = topKDocumentsRetrieval.get_top_k_documents_in_time(query_keywords, year_month)

    return jsonify(top_k_huff_post_data)


if __name__ == '__main__':
    app.run(debug=True)
