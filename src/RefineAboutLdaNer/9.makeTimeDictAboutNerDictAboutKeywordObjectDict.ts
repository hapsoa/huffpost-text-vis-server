import { TimeDictAbout5w1hDictAboutKeywordObjectDict, TimeDictAboutKeywordObjectDict } from './refiningInterfaces';
import _ = require('lodash');
import fs = require('fs');

// read timeDictAboutKeywordObjectDictIncluding5w1h.json
// test file path
// const timeDictAboutKeywordObjectDictIncludingNerFilePath =
//   '../../lda-ner-test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json';
// const writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath =
//   '../../lda-ner-test-data/timeDictAboutNerDictAboutKeywordObjectDict.json';

// real file path
const timeDictAboutKeywordObjectDictIncludingNerFilePath =
  '../../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json';
const writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath =
  '../../lda-ner-result-data/timeDictAboutNerDictAboutKeywordObjectDict.json';

const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = require(timeDictAboutKeywordObjectDictIncludingNerFilePath);

// make variable
const timeDictAboutnerDictAboutKeywordObjectDict: TimeDictAbout5w1hDictAboutKeywordObjectDict = {};

// for each time, for each keywordObject, classify by 5w1h
_.forEach(timeDictAboutKeywordObjectDict, (keywordObjectDict, time) => {
  console.log('time', time);
  timeDictAboutnerDictAboutKeywordObjectDict[time] = {}
  _.forEach(keywordObjectDict, (keywordObject, keyword) => {
    if (!timeDictAboutnerDictAboutKeywordObjectDict[time].hasOwnProperty(keywordObject.ner)) {
      timeDictAboutnerDictAboutKeywordObjectDict[time][keywordObject.ner] = {};
    }
    timeDictAboutnerDictAboutKeywordObjectDict[time][keywordObject.ner][keyword] = keywordObject;
  });
})

// write timeDictAboutW51hDictAboutKeywordObjectDict.json
fs.writeFileSync(writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath,
  JSON.stringify(timeDictAboutnerDictAboutKeywordObjectDict, null, 2));