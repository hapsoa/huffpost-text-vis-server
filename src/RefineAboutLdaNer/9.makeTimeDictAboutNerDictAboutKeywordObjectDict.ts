import { TimeDictAbout5w1hDictAboutKeywordObjectDict } from './refiningInterfaces';
import _ = require('lodash');

// read timeDictAboutKeywordObjectDictIncluding5w1h.json
// test file path
const timeDictAboutKeywordObjectDictIncludingW51hFilePath =
  '../../test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json';

const timeDictAboutKeywordObjectDictIncludingW51h = require(timeDictAboutKeywordObjectDictIncludingW51hFilePath);

// make variable
const timeDictAbout5w1hDictAboutKeywordObjectDict: TimeDictAbout5w1hDictAboutKeywordObjectDict = {};

// for each time, for each keywordObject, classify by 5w1h
_.forEach(timeDictAboutKeywordObjectDictIncludingW51h, (keywordObjectDict, time) => {
  console.log('time', time);
  _.forEach(keywordObjectDict, (keywordObject, keyword) => {
    //
  });
})


// write timeDictAboutW51hDictAboutKeywordObjectDict.json