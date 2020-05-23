# -*- coding: utf-8 -*-

from flask import Flask, request
from flask import jsonify
from flask_cors import CORS  # installation command : pip install -U flask-cors
import json
import codecs

app = Flask(__name__)
cors = CORS(app)

# test files
# timeDictAboutKeywordObjectDictFilePath = '../../lda-ner-test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json'

# real files
timeDictAboutKeywordObjectDictFilePath = '../../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json'
keywordRelationMatrixTotalTimeFilePath = '../../lda-ner-result-data/keywordRelationMatrixTotalTime.json'
alphabetIndexDictAboutKeywordFilePath = '../../lda-ner-result-data/alphabetIndexDictAboutKeyword.json'

timeDictAboutKeywordObjectDict = json.load(codecs.open(
    timeDictAboutKeywordObjectDictFilePath, 'r', 'utf-8-sig'))
keywordRelationMatrixTotalTime = json.load(codecs.open(
    keywordRelationMatrixTotalTimeFilePath, 'r', 'utf-8-sig'))
alphabetIndexDictAboutKeyword = json.load(codecs.open(
    alphabetIndexDictAboutKeywordFilePath, 'r', 'utf-8-sig'))


@app.route('/', methods=['POST'])
def post():
    print('asdfasdf')
    return jsonify({
        "hello": "hello"
    })


@app.route('/time-dict-about-keyword-object-dict', methods=['GET'])
def getTimeDictAboutKeywordObjectDict():
    return jsonify(timeDictAboutKeywordObjectDict)


@app.route('/keyword-relation-matrix-total-time', methods=['GET'])
def getKeywordRelationMatrixTotalTime():
    return jsonify(keywordRelationMatrixTotalTime)


@app.route('/alphabet-index-dict-about-keyword', methods=['GET'])
def getAlphabetIndexDictAboutKeyword():
    return jsonify(alphabetIndexDictAboutKeyword)


if __name__ == '__main__':
    app.run(debug=True)
