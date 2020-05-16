import fs = require('fs');
import _ = require('lodash');
import { HuffPostDatum, KeywordObjectDict } from './refiningInterfaces';

// read huffPostDataIncludingKeywords.json
const huffPostData: HuffPostDatum[] = require('../../test-data/huffPostDataIncludingKeywordsForTest.json');

// make data structure
const keywordObjectDict: KeywordObjectDict = {};

// for each post, put keywordWeightDict to keywords and weights.
huffPostData.forEach(huffPostDatum => {
  huffPostDatum.keywordObjects.forEach(keywordObject => {
    if (keywordObjectDict.hasOwnProperty(keywordObject.keyword)) {
      keywordObjectDict[keywordObject.keyword].frequency += 1;
      keywordObjectDict[keywordObject.keyword].weight += keywordObject.weight;
    } else {
      keywordObjectDict[keywordObject.keyword] = {
        keyword: keywordObject.keyword,
        frequency: 1,
        weight: keywordObject.weight,
        orderIndex: -1
      }
    }
  });
});

// set alphabet orderIndex to keywordObjectDict.
_.chain(keywordObjectDict)
  .sortBy(keywordObject => keywordObject.keyword)
  .forEach((keywordObject, orderIndex) => {
    keywordObject.orderIndex = orderIndex;
  })
  .value();


// write keywordWeightDict.json
const writingFilePath: string = '../../test-data/keywordObjectDictForTest.json';
fs.writeFileSync(writingFilePath, JSON.stringify(keywordObjectDict, null, 2));
