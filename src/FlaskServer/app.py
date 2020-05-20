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

timeDictAboutKeywordObjectDict = json.load(codecs.open(
    timeDictAboutKeywordObjectDictFilePath, 'r', 'utf-8-sig'))


@app.route('/', methods=['POST'])
def post():
    print('asdfasdf')
    return jsonify({
        "hello": "hello"
    })


@app.route('/time-dict-about-keyword-object-dict', methods=['GET'])
def getTimeDictAboutKeywordObjectDict():
    return jsonify(timeDictAboutKeywordObjectDict)


if __name__ == '__main__':
    app.run(debug=True)
