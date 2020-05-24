import fs = require("fs");
import {
  KeywordObjectDict,
  HuffPostDatum,
  KeywordObject,
  AlphabetIndexDictAboutKeyword,
  TimeDictAboutKeywordRelationMatrix,
  KeywordRelation,
} from "./refiningInterfaces";
import _ = require("lodash");
import {
  makeMonthUnitsFromHuffPostData,
  getYearMonthFromStringDate,
} from "./utils";

// for test file path
// const huffPostDataJsonPath: string = '../../test-data/huffPostDataIncludingKeywordsForTest.json';
// const keywordObjectDictJsonPath: string
//   = '../../test-data/keywordObjectDictTotalTimeForTest.json';
// const alphabetIndexDictAboutKeywordFilePath =
//   '../../test-data/alphabetIndexDictAboutKeywordForTest.json';
// const writingKeywordRelationMatrixTotalTimeFilePath =
//   '../../test-data/keywordRelationMatrixTotalTimeForTest.json'
// const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
//   '../../test-data/timeDictAboutKeywordRelationMatrixForTest.json';

// for real file path
const huffPostDataJsonPath: string =
  "../../lda-ner-result-data/huffPostDataIncludingKeywords.json";
const keywordObjectDictJsonPath: string =
  "../../lda-ner-result-data/keywordObjectDictTotalTime.json";
const alphabetIndexDictAboutKeywordFilePath =
  "../../lda-ner-result-data/alphabetIndexDictAboutKeyword.json";
const writingKeywordRelationMatrixTotalTimeFilePath =
  "../../lda-ner-result-data/keywordRelationMatrixTotalTime.json";
const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
  "../../lda-ner-result-data/timeDictAboutKeywordRelationMatrix.json";

const huffPostData: HuffPostDatum[] = require(huffPostDataJsonPath);
const keywordObjectDict: KeywordObjectDict = require(keywordObjectDictJsonPath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = require(alphabetIndexDictAboutKeywordFilePath);

console.log("start");

const timeDictAboutKeywordRelationMatrix: TimeDictAboutKeywordRelationMatrix = {};

// sparse matrix
// [
//   {2(keyword0-keyword2): 0.76(weight), 5: 0.8, ...},
//   ...
// ]
const timeUnits: string[] = makeMonthUnitsFromHuffPostData(huffPostData);
timeUnits.forEach((timeUnit) => {
  console.log("timeUnit", timeUnit);
  timeDictAboutKeywordRelationMatrix[timeUnit] = [];
  for (let i = 0; i < Object.keys(keywordObjectDict).length; i++) {
    timeDictAboutKeywordRelationMatrix[timeUnit].push({});
  }
});
console.log("keywordRelationMatrixTotalTime start");
const keywordRelationMatrixTotalTime: KeywordRelation[] = [];
for (let i = 0; i < Object.keys(keywordObjectDict).length; i++) {
  keywordRelationMatrixTotalTime.push({});
}

// for each post, make relation of keyword and another keyword in keywordObjects
huffPostData.forEach((huffPostDatum) => {
  const yearMonth: string = getYearMonthFromStringDate(huffPostDatum.date);
  huffPostDatum.keywordObjects.forEach((keywordObject1) => {
    huffPostDatum.keywordObjects.forEach((keywordObject2) => {
      // make relation at relationMatrix
      if (keywordObject1.keyword !== keywordObject2.keyword) {
        const i = keywordObjectDict[keywordObject1.keyword].alphabetIndex;
        const j = keywordObjectDict[keywordObject2.keyword].alphabetIndex;
        // for total time dict
        keywordRelationMatrixTotalTime[i].hasOwnProperty(j)
          ? (keywordRelationMatrixTotalTime[i][j] += 1)
          : (keywordRelationMatrixTotalTime[i][j] = 1);
        // for 1month time dict
        const keywordRelationMatrix1Month =
          timeDictAboutKeywordRelationMatrix[yearMonth];
        keywordRelationMatrix1Month[i].hasOwnProperty(j)
          ? (keywordRelationMatrix1Month[i][j] += 1)
          : (keywordRelationMatrix1Month[i][j] = 1);
      }
    });
  });
});

// write keywordRelationMatrix.json
fs.writeFileSync(
  writingKeywordRelationMatrixTotalTimeFilePath,
  JSON.stringify(keywordRelationMatrixTotalTime)
);
fs.writeFileSync(
  writingTimeDictAboutKeywordRelationMatrixFilePath,
  JSON.stringify(timeDictAboutKeywordRelationMatrix)
);
