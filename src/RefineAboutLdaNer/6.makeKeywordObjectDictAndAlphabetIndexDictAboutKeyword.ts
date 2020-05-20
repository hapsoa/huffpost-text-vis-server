import fs = require('fs');
import _ = require('lodash');
import { HuffPostDatum, KeywordObjectDict, TimeDictAboutKeywordObjectDict, AlphabetIndexDictAboutKeyword } from './refiningInterfaces';
import { makeMonthUnitsFromHuffPostData, getYearMonthFromStringDate } from './utils';

// for test file path
// const readingHuffPostDataIncludingKeywordsJsonPath
//   = '../../test-data/huffPostDataIncludingKeywordsForTest.json'
// const writingKeywordObjectDictTotalTimeJsonPath
//   = '../../test-data/keywordObjectDictTotalTimeForTest.json';
// const writingTimeDictAboutKeywordObjectDictEachTimeJsonPath
//   = '../../test-data/timeDictAboutKeywordObjectDictForTest.json';
// const writingAlphabetIndexDictAboutKeywordFilePath
//   = '../../test-data/alphabetIndexDictAboutKeywordForTest.json';

// for real file path
const readingHuffPostDataIncludingKeywordsJsonPath
  = '../../result-data/huffPostDataIncludingKeywords.json'
const writingKeywordObjectDictTotalTimeJsonPath
  = '../../result-data/keywordObjectDictTotalTime.json';
const writingTimeDictAboutKeywordObjectDictEachTimeJsonPath
  = '../../result-data/timeDictAboutKeywordObjectDict.json';
const writingAlphabetIndexDictAboutKeywordFilePath
  = '../../result-data/alphabetIndexDictAboutKeyword.json';


// read huffPostDataIncludingKeywords.json
const huffPostData: HuffPostDatum[] = require(readingHuffPostDataIncludingKeywordsJsonPath);


const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = {};
const keywordObjectDictTotalTime: KeywordObjectDict = {};
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = {};

// make keywordObjectDict each time
// const times: string[] = ['2019-04', ..., '2020-03'];
const timeUnits: string[] = makeMonthUnitsFromHuffPostData(huffPostData);
// console.log('timeUnits', timeUnits);
timeUnits.forEach(timeUnit => {
  timeDictAboutKeywordObjectDict[timeUnit] = {};
})

// for each post, put keywordWeightDict to keywords and weights.
huffPostData.forEach(huffPostDatum => {
  huffPostDatum.keywordObjects.forEach(keywordObject => {
    // at total time
    if (keywordObjectDictTotalTime.hasOwnProperty(keywordObject.keyword)) {
      keywordObjectDictTotalTime[keywordObject.keyword].frequency += 1;
      keywordObjectDictTotalTime[keywordObject.keyword].weight += keywordObject.weight;
    } else {
      keywordObjectDictTotalTime[keywordObject.keyword] = {
        keyword: keywordObject.keyword,
        frequency: 1,
        weight: keywordObject.weight,
        alphabetIndex: -1,
        ner: ''
      }
    }

    // at each month
    const yearMonth = getYearMonthFromStringDate(huffPostDatum.date);
    // console.log('yearMonth', yearMonth)
    const keywordObjectDict1Month = timeDictAboutKeywordObjectDict[yearMonth]
    if (keywordObjectDict1Month.hasOwnProperty(keywordObject.keyword)) {
      keywordObjectDict1Month[keywordObject.keyword].frequency += 1;
      keywordObjectDict1Month[keywordObject.keyword].weight += keywordObject.weight;
    } else {
      keywordObjectDict1Month[keywordObject.keyword] = {
        keyword: keywordObject.keyword,
        frequency: 1,
        weight: keywordObject.weight,
        alphabetIndex: -1,
        ner: ''
      }
    }
  });
});

// set alphabet orderIndex to keywordObjectDict of total time.
_.chain(keywordObjectDictTotalTime)
  .sortBy(keywordObject => keywordObject.keyword)
  .forEach((keywordObject, orderIndex) => {
    keywordObject.alphabetIndex = orderIndex;
    alphabetIndexDictAboutKeyword[orderIndex] = keywordObject.keyword;
  })
  .value();

// set alphabet orderIndex to keywordObjectDict each month.
_.forEach(timeDictAboutKeywordObjectDict, keywordObjectDict1Month => {
  _.forEach(keywordObjectDict1Month, keywordObject => {
    keywordObject.alphabetIndex = keywordObjectDictTotalTime[keywordObject.keyword].alphabetIndex;
  });
});


// write keywordWeightDict.json
fs.writeFileSync(writingKeywordObjectDictTotalTimeJsonPath,
  JSON.stringify(keywordObjectDictTotalTime, null, 2));
fs.writeFileSync(writingTimeDictAboutKeywordObjectDictEachTimeJsonPath,
  JSON.stringify(timeDictAboutKeywordObjectDict, null, 2));
fs.writeFileSync(writingAlphabetIndexDictAboutKeywordFilePath,
  JSON.stringify(alphabetIndexDictAboutKeyword, null, 2));






