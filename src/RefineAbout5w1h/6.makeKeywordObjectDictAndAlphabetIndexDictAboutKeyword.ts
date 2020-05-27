import fs = require("fs");
import _ = require("lodash");
import {
  HuffPostDatum,
  KeywordObjectDict,
  TimeDictAboutKeywordObjectDict,
  AlphabetIndexDictAboutKeyword,
} from "./refiningInterfaces";
import {
  makeMonthUnitsFromHuffPostData,
  getYearMonthFromStringDate,
} from "./utils";

// for test file path
// const readingHuffPostDataIncludingKeywordsJsonPath =
//   "../../5w1h-test-data/huffPostDataIncludingKeywords.json";
// const writingKeywordObjectDictTotalTimeJsonPath =
//   "../../5w1h-test-data/keywordObjectDictTotalTime.json";
// const writingTimeDictAboutKeywordObjectDictEachTimeJsonPath =
//   "../../5w1h-test-data/timeDictAboutKeywordObjectDict.json";
// const writingAlphabetIndexDictAboutKeywordFilePath =
//   "../../5w1h-test-data/alphabetIndexDictAboutKeyword.json";

// for real file path
const readingHuffPostDataIncludingKeywordsJsonPath =
  "../../5w1h-result-data/huffPostDataIncludingKeywords.json";
const writingKeywordObjectDictTotalTimeJsonPath =
  "../../5w1h-result-data/keywordObjectDictTotalTime.json";
const writingTimeDictAboutKeywordObjectDictEachTimeJsonPath =
  "../../5w1h-result-data/timeDictAboutKeywordObjectDict.json";
const writingAlphabetIndexDictAboutKeywordFilePath =
  "../../5w1h-result-data/alphabetIndexDictAboutKeyword.json";

// read huffPostDataIncludingKeywords.json
const huffPostData: HuffPostDatum[] = require(readingHuffPostDataIncludingKeywordsJsonPath);

const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = {};
const keywordObjectDictTotalTime: KeywordObjectDict = {};
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = {};

// make keywordObjectDict each time
// const times: string[] = ['2019-04', ..., '2020-03'];
const timeUnits: string[] = makeMonthUnitsFromHuffPostData(huffPostData);
// console.log('timeUnits', timeUnits);
timeUnits.forEach((timeUnit) => {
  timeDictAboutKeywordObjectDict[timeUnit] = {};
});

// for each post, put keywordWeightDict to keywords and weights.
huffPostData.forEach((huffPostDatum) => {
  huffPostDatum.keywords.forEach((five51hKeyword) => {
    // at total time
    if (keywordObjectDictTotalTime.hasOwnProperty(five51hKeyword.keyword)) {
      keywordObjectDictTotalTime[five51hKeyword.keyword].frequency += 1;
    } else {
      keywordObjectDictTotalTime[five51hKeyword.keyword] = {
        keyword: five51hKeyword.keyword,
        frequency: 1,
        alphabetIndex: -1,
        fivew1h: five51hKeyword.fivew1h,
      };
    }

    // at each month
    const yearMonth = getYearMonthFromStringDate(huffPostDatum.date);
    const keywordObjectDict1Month = timeDictAboutKeywordObjectDict[yearMonth];
    if (keywordObjectDict1Month.hasOwnProperty(five51hKeyword.keyword)) {
      keywordObjectDict1Month[five51hKeyword.keyword].frequency += 1;
    } else {
      keywordObjectDict1Month[five51hKeyword.keyword] = {
        keyword: five51hKeyword.keyword,
        frequency: 1,
        alphabetIndex: -1,
        fivew1h: five51hKeyword.fivew1h,
        yearMonth,
      };
    }
  });
});

// set alphabet orderIndex to keywordObjectDict of total time.
_.chain(keywordObjectDictTotalTime)
  .sortBy((keywordObject) => keywordObject.keyword)
  .forEach((keywordObject, orderIndex) => {
    keywordObject.alphabetIndex = orderIndex;
    alphabetIndexDictAboutKeyword[orderIndex] = keywordObject.keyword;
  })
  .value();

// set alphabet orderIndex to keywordObjectDict each month.
_.forEach(timeDictAboutKeywordObjectDict, (keywordObjectDict1Month) => {
  _.forEach(keywordObjectDict1Month, (keywordObject) => {
    keywordObject.alphabetIndex =
      keywordObjectDictTotalTime[keywordObject.keyword].alphabetIndex;
  });
});

// write keywordWeightDict.json
fs.writeFileSync(
  writingKeywordObjectDictTotalTimeJsonPath,
  JSON.stringify(keywordObjectDictTotalTime, null, 2)
);
fs.writeFileSync(
  writingTimeDictAboutKeywordObjectDictEachTimeJsonPath,
  JSON.stringify(timeDictAboutKeywordObjectDict, null, 2)
);
fs.writeFileSync(
  writingAlphabetIndexDictAboutKeywordFilePath,
  JSON.stringify(alphabetIndexDictAboutKeyword, null, 2)
);
