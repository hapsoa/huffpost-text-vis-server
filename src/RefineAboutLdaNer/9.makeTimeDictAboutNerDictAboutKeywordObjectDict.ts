import {
  TimeDictAboutNerDictAboutKeywordObjectDict,
  TimeDictAboutKeywordObjectDict,
} from "./refiningInterfaces";
import _ = require("lodash");
import fs = require("fs");

// read timeDictAboutKeywordObjectDictIncluding5w1h.json
// test file path
const timeDictAboutKeywordObjectDictIncludingNerFilePath =
  "../../lda-ner-test-data/timeDictAboutKeywordObjectDictIncludingNerForTest.json";
const writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath =
  "../../lda-ner-test-data/timeDictAboutNerDictAboutKeywordObjectDict.json";

// real file path
// const timeDictAboutKeywordObjectDictIncludingNerFilePath =
//   "../../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json";
// const writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath =
//   "../../lda-ner-result-data/timeDictAboutNerDictAboutKeywordObjectDict.json";

const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = require(timeDictAboutKeywordObjectDictIncludingNerFilePath);

// make variable
const timeDictAboutnerDictAboutKeywordObjectDict: TimeDictAboutNerDictAboutKeywordObjectDict = {};

// for each time, for each keywordObject, classify by ner
_.forEach(timeDictAboutKeywordObjectDict, (keywordObjectDict, time) => {
  timeDictAboutnerDictAboutKeywordObjectDict[time] = {};
  _.forEach(keywordObjectDict, (keywordObject, keyword) => {
    if (!timeDictAboutnerDictAboutKeywordObjectDict[time][keywordObject.ner]) {
      timeDictAboutnerDictAboutKeywordObjectDict[time][keywordObject.ner] = {};
    }
    timeDictAboutnerDictAboutKeywordObjectDict[time][keywordObject.ner][
      keyword
    ] = keywordObject;
  });
});

// write timeDictAboutW51hDictAboutKeywordObjectDict.json
fs.writeFileSync(
  writingTimeDictAboutNerDictAboutKeywordObjectDictFilePath,
  JSON.stringify(timeDictAboutnerDictAboutKeywordObjectDict, null, 2)
);
