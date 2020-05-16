"use strict";
exports.__esModule = true;
var fs = require("fs");
var _ = require("lodash");
var utils_1 = require("./utils");
// for test file path
// const keywordObjectDictJsonPath: string
//   = '../../test-data/keywordObjectDictTotalTimeForTest.json';
// const huffPostDataJsonPath: string = '../../test-data/huffPostDataIncludingKeywordsForTest.json';
// const writingKeywordRelationMatrixTotalTimeFilePath =
//   '../../test-data/keywordRelationMatrixTotalTimeForTest.json'
// const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
//   '../../test-data/timeDictAboutKeywordRelationMatrixForTest.json';
// for real file path
var keywordObjectDictJsonPath = '../../result-data/keywordObjectDictTotalTime.json';
var huffPostDataJsonPath = '../../result-data/huffPostDataIncludingKeywords.json';
var writingKeywordRelationMatrixTotalTimeFilePath = '../../result-data/keywordRelationMatrixTotalTime.json';
var writingTimeDictAboutKeywordRelationMatrixFilePath = '../../result-data/timeDictAboutKeywordRelationMatrix.json';
var keywordObjectDict = require(keywordObjectDictJsonPath);
var huffPostData = require(huffPostDataJsonPath);
var timeDictAboutKeywordRelationMatrix = {};
// make time property to timeDict
var timeUnits = utils_1.makeMonthUnitsFromHuffPostData(huffPostData);
console.log('start');
timeUnits.forEach(function (timeUnit) {
    console.log('timeUnit', timeUnit);
    timeDictAboutKeywordRelationMatrix[timeUnit] = getInitialKeywordRelationMatrix(keywordObjectDict);
});
// sparse matrix
// [[weight0(keyword0-keyword0), weight1(keyword0-keyword1), ...]]
// Initialize 2d-array of each value 0.
var keywordRelationMatrixTotalTime = getInitialKeywordRelationMatrix(keywordObjectDict);
// TODO out of memory
console.log('ok!');
// for each keyword and for another each keyword,
_.forEach(keywordObjectDict, function (keywordObjectA) {
    _.forEach(keywordObjectDict, function (keywordObjectB) {
        // make relation the keyword and another keyword
        keywordRelationMatrixTotalTime[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
            makeRelationBetween2Keywords(keywordObjectA, keywordObjectB, huffPostData);
        // for each month, make relation.
        timeUnits.forEach(function (timeUnit) {
            var keywordRelationMatrix1Month = timeDictAboutKeywordRelationMatrix[timeUnit];
            keywordRelationMatrix1Month[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
                makeRelationBetween2Keywords(keywordObjectA, keywordObjectB, huffPostData, timeUnit);
        });
    });
});
// write keywordRelationMatrix.json
fs.writeFileSync(writingKeywordRelationMatrixTotalTimeFilePath, JSON.stringify(keywordRelationMatrixTotalTime));
fs.writeFileSync(writingTimeDictAboutKeywordRelationMatrixFilePath, JSON.stringify(timeDictAboutKeywordRelationMatrix));
/**
 * Make relation value between 2 keywords
 * @param keywordObjectA
 * @param keywordObjectB
 */
function makeRelationBetween2Keywords(keywordObjectA, keywordObjectB, innerHuffPostData, yearMonth) {
    if (yearMonth === void 0) { yearMonth = null; }
    var fMeasureAB = getFMeasureBetween2Words(keywordObjectA, keywordObjectB, innerHuffPostData, yearMonth);
    var fMeasureBA = getFMeasureBetween2Words(keywordObjectB, keywordObjectA, innerHuffPostData, yearMonth);
    var relation = 1 - getHarmonicMeanBetween2(1 - fMeasureAB, 1 - fMeasureBA);
    return relation;
}
/**
 * Get harmonic mean between 2 elements(number).
 * @param number1
 * @param number2
 */
function getHarmonicMeanBetween2(number1, number2) {
    return number1 + number2 !== 0 ? (2 * number1 * number2) / (number1 + number2) : 0;
}
/**
 * get initial keyword reation matrix valued 0
 */
function getInitialKeywordRelationMatrix(innerKeywordObjectDict) {
    console.log('!!!!', Object.keys(innerKeywordObjectDict).length);
    var keywordRelationMatrix = new Array(Object.keys(innerKeywordObjectDict).length).fill([]);
    keywordRelationMatrix.forEach(function (oneKeywordRelation, i) {
        keywordRelationMatrix[i] = new Array(Object.keys(innerKeywordObjectDict).length).fill(0);
    });
    return keywordRelationMatrix;
}
/**
 * Get f-measure Between 2 keywords
 * @param keywordObjectA
 * @param keywordObjectB
 * @param innerHuffPostData
 */
function getFMeasureBetween2Words(keywordObjectA, keywordObjectB, innerHuffPostData, yearMonth) {
    if (yearMonth === void 0) { yearMonth = null; }
    // (tp + fp) is number of retreived posts including keyword1
    // tp is number of retrieved posts including keyword2
    // (tp + fn) is number of all posts including keyword2
    var tpfpAB = getNumberOfRetrievedPostsIncludingKeywords([keywordObjectA.keyword], innerHuffPostData, yearMonth);
    var tpAB = getNumberOfRetrievedPostsIncludingKeywords([keywordObjectA.keyword, keywordObjectB.keyword], innerHuffPostData, yearMonth);
    var tpfnAB = getNumberOfRetrievedPostsIncludingKeywords([keywordObjectB.keyword], innerHuffPostData, yearMonth);
    var recallAB = tpAB / tpfpAB;
    var precisionAB = tpAB / tpfnAB;
    var fMeasureAB = getHarmonicMeanBetween2(precisionAB, recallAB);
    return fMeasureAB;
}
/**
 * get number of retrieved posts including search keywords
 * @param searchingKewords
 * @param innerHuffPostData
 */
function getNumberOfRetrievedPostsIncludingKeywords(searchingKewords, innerHuffPostData, yearMonth) {
    if (yearMonth === void 0) { yearMonth = null; }
    var numberOfRetrievedPostsIncludingKeyword = 0;
    innerHuffPostData.forEach(function (huffPostDatum) {
        if (yearMonth === utils_1.getYearMonthFromStringDate(huffPostDatum.date) || yearMonth === null) {
            var numberOfTrues_1 = 0;
            huffPostDatum.keywordObjects.forEach(function (keywordObject) {
                if (searchingKewords.includes(keywordObject.keyword)) {
                    numberOfTrues_1++;
                }
            });
            if (numberOfTrues_1 === searchingKewords.length) {
                numberOfRetrievedPostsIncludingKeyword++;
            }
        }
    });
    return numberOfRetrievedPostsIncludingKeyword;
}
