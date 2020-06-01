# -*- coding: utf-8 -*-

from flask import Flask, request
from flask import jsonify
from flask_cors import CORS  # installation command : pip install -U flask-cors
import json
import codecs
import SparkFunctions

app = Flask(__name__)
cors = CORS(app)


@app.route('/', methods=['POST'])
def post():
    print('flask server for spark')
    return jsonify({
        "hello": "hello"
    })


@app.route('/related-keywords', methods=['POST'])
def make_related_keywords():
    result_of_what = SparkFunctions.get_related_keywords(request.json)
    return jsonify(result_of_what)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
