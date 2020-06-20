import fs = require("fs");
import {
    KeywordObjectDict,
    HuffPostDatum,
    KeywordObject,
    AlphabetIndexDictAboutKeyword, TimeDictAboutNewKeywordRelationMatrix, NewKeywordRelation,
    // TimeDictAboutKeywordRelationMatrix,
    // KeywordRelation,
} from './refiningInterfaces';
import _ = require("lodash");
import {
    makeYearMonthsFromHuffPostData,
    getYearMonthFromStringDate,
} from "./utils";

// for test file path
// const huffPostDataJsonPath: string =
//     "../../5w1h-test-data/huffPostDataIncludingKeywords.json";
// const keywordObjectDictJsonPath: string =
//     "../../5w1h-test-data/keywordObjectDictTotalTime.json";
// const alphabetIndexDictAboutKeywordFilePath =
//     "../../5w1h-test-data/alphabetIndexDictAboutKeyword.json";
// const writingKeywordRelationMatrixTotalTimeFilePath =
//     "../../5w1h-test-data/newKeywordRelationMatrixTotalTime.json";
// const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
//     "../../5w1h-test-data/timeDictAboutNewKeywordRelationMatrix.json";

// for real file path
const huffPostDataJsonPath: string =
    "../../5w1h-result-data/huffPostDataIncludingKeywords.json";
const keywordObjectDictJsonPath: string =
    "../../5w1h-result-data/keywordObjectDictTotalTime.json";
const alphabetIndexDictAboutKeywordFilePath =
    "../../5w1h-result-data/alphabetIndexDictAboutKeyword.json";
const writingKeywordRelationMatrixTotalTimeFilePath =
    "../../5w1h-result-data/newKeywordRelationMatrixTotalTime.json";
const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
    "../../5w1h-result-data/timeDictAboutNewKeywordRelationMatrix.json";


const huffPostData: HuffPostDatum[] = require(huffPostDataJsonPath);
const keywordObjectDict: KeywordObjectDict = require(keywordObjectDictJsonPath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = require(alphabetIndexDictAboutKeywordFilePath);

console.log("start");

const timeDictAboutKeywordRelationMatrix: TimeDictAboutNewKeywordRelationMatrix = {};

// sparse matrix
// [
//   {2(keyword0-keyword2): 0.76(weight), 5: 0.8, ...},
//   ...
// ]
const timeUnits: string[] = makeYearMonthsFromHuffPostData(huffPostData);
timeUnits.forEach((timeUnit) => {
    console.log("timeUnit", timeUnit);
    timeDictAboutKeywordRelationMatrix[timeUnit] = [];
    for (let i = 0; i < Object.keys(keywordObjectDict).length; i++) {
        timeDictAboutKeywordRelationMatrix[timeUnit].push({});
    }
});
console.log("keywordRelationMatrixTotalTime start");
const keywordRelationMatrixTotalTime: NewKeywordRelation[] = [];
for (let i = 0; i < Object.keys(keywordObjectDict).length; i++) {
    keywordRelationMatrixTotalTime.push({});
}

// for each post, make relation of keyword and another keyword in keywordObjects
huffPostData.forEach((huffPostDatum, huffPostDatumIndex) => {
    const yearMonth: string = getYearMonthFromStringDate(huffPostDatum.date);
    huffPostDatum.keywords.forEach((fivew1hKeyword1) => {
        huffPostDatum.keywords.forEach((fivew1hKeyword2) => {
            // make relation at relationMatrix
            if (fivew1hKeyword1.keyword !== fivew1hKeyword2.keyword) {
                const i = keywordObjectDict[fivew1hKeyword1.keyword].alphabetIndex;
                const j = keywordObjectDict[fivew1hKeyword2.keyword].alphabetIndex;
                // for total time dict
                keywordRelationMatrixTotalTime[i].hasOwnProperty(j)
                    ? (keywordRelationMatrixTotalTime[i][j][huffPostDatumIndex] = true)
                    : (keywordRelationMatrixTotalTime[i][j] = {[huffPostDatumIndex]: true});
                // for 1month time dict
                const keywordRelationMatrix1Month =
                    timeDictAboutKeywordRelationMatrix[yearMonth];
                keywordRelationMatrix1Month[i].hasOwnProperty(j)
                    ? (keywordRelationMatrix1Month[i][j][huffPostDatumIndex] = true)
                    : (keywordRelationMatrix1Month[i][j] = {[huffPostDatumIndex]: true});
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
