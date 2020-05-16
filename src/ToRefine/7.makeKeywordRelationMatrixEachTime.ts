import fs = require('fs');
import { KeywordObjectDict, HuffPostDatum, KeywordObject, TimeDictAboutKeywordRelationMatrix } from './refiningInterfaces';
import _ = require('lodash');
import { makeMonthUnitsFromHuffPostData, getYearMonthFromStringDate } from './utils';

const keywordObjectDictJsonPath: string
  = '../../test-data/keywordObjectDictTotalTimeForTest.json';
const huffPostDataJsonPath: string = '../../test-data/huffPostDataIncludingKeywordsForTest.json';
const writingKeywordRelationMatrixTotalTimeFilePath =
  '../../test-data/keywordRelationMatrixTotalTimeForTest.json'
const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
  '../../test-data/timeDictAboutKeywordRelationMatrixForTest.json';


const keywordObjectDict: KeywordObjectDict = require(keywordObjectDictJsonPath);
const huffPostData: HuffPostDatum[] = require(huffPostDataJsonPath);

const timeDictAboutKeywordRelationMatrix: TimeDictAboutKeywordRelationMatrix = {};

// make time property to timeDict
const timeUnits: string[] = makeMonthUnitsFromHuffPostData(huffPostData);
timeUnits.forEach(timeUnit => {
  timeDictAboutKeywordRelationMatrix[timeUnit] = getInitialKeywordRelationMatrix(keywordObjectDict);
})

// sparse matrix
// [[weight0(keyword0-keyword0), weight1(keyword0-keyword1), ...]]
// Initialize 2d-array of each value 0.
const keywordRelationMatrixTotalTime: number[][] = getInitialKeywordRelationMatrix(keywordObjectDict);

// for each keyword and for another each keyword,
_.forEach(keywordObjectDict, keywordObjectA => {
  _.forEach(keywordObjectDict, keywordObjectB => {
    // console.log('keywordRelationMatrixTotalTime', keywordRelationMatrixTotalTime);
    // console.log('keywordObjectA.alphabetIndex', keywordObjectA.alphabetIndex);
    // console.log('keywordObjectB.alphabetIndex', keywordObjectB.alphabetIndex);
    // make relation the keyword and another keyword
    keywordRelationMatrixTotalTime[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
      makeRelationBetween2Keywords(keywordObjectA, keywordObjectB);

    // for each month, make relation.
    timeUnits.forEach(timeUnit => {
      const keywordRelationMatrix1Month = timeDictAboutKeywordRelationMatrix[timeUnit]
      keywordRelationMatrix1Month[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
        makeRelationBetween2Keywords(keywordObjectA, keywordObjectB);
    })
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
function makeRelationBetween2Keywords(
  keywordObjectA: KeywordObject,
  keywordObjectB: KeywordObject
): number {
  const fMeasureAB = getFMeasureBetween2Words(keywordObjectA, keywordObjectB, huffPostData);
  const fMeasureBA = getFMeasureBetween2Words(keywordObjectB, keywordObjectA, huffPostData);
  const relation = 1 - getHarmonicMeanBetween2(1 - fMeasureAB, 1 - fMeasureBA);
  return relation;
}

/**
 * Get harmonic mean between 2 elements(number).
 * @param number1
 * @param number2
 */
function getHarmonicMeanBetween2(number1: number, number2: number): number {
  return number1 + number2 !== 0 ? (2 * number1 * number2) / (number1 + number2) : 0;
}


/**
 * get initial keyword reation matrix valued 0
 */
function getInitialKeywordRelationMatrix(innerKeywordObjectDict: KeywordObjectDict): number[][] {
  const keywordRelationMatrix: number[][] = new Array(Object.keys(innerKeywordObjectDict).length).fill([]);
  keywordRelationMatrix.forEach((oneKeywordRelation, i) => {
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
function getFMeasureBetween2Words(
  keywordObjectA: KeywordObject,
  keywordObjectB: KeywordObject,
  innerHuffPostData: HuffPostDatum[],
  yearMonth: string | null = null
): number {
  // (tp + fp) is number of retreived posts including keyword1
  // tp is number of retrieved posts including keyword2
  // (tp + fn) is number of all posts including keyword2
  const tpfpAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectA.keyword], innerHuffPostData, yearMonth);
  const tpAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectA.keyword, keywordObjectB.keyword], innerHuffPostData, yearMonth);
  const tpfnAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectB.keyword], innerHuffPostData, yearMonth);
  const recallAB: number = tpAB / tpfpAB;
  const precisionAB: number = tpAB / tpfnAB;
  const fMeasureAB: number = getHarmonicMeanBetween2(precisionAB, recallAB);

  return fMeasureAB;
}

/**
 * get number of retrieved posts including search keywords
 * @param searchingKewords
 * @param innerHuffPostData
 */
function getNumberOfRetrievedPostsIncludingKeywords(
  searchingKewords: string[],
  innerHuffPostData: HuffPostDatum[],
  yearMonth: string | null = null
): number {
  let numberOfRetrievedPostsIncludingKeyword: number = 0;
  innerHuffPostData.forEach(huffPostDatum => {
    if (yearMonth === getYearMonthFromStringDate(huffPostDatum.date) || yearMonth === null) {
      let numberOfTrues: number = 0;
      huffPostDatum.keywordObjects.forEach(keywordObject => {
        if (searchingKewords.includes(keywordObject.keyword)) {
          numberOfTrues++;
        }
      });
      if (numberOfTrues === searchingKewords.length) { numberOfRetrievedPostsIncludingKeyword++; }
    }
  });

  return numberOfRetrievedPostsIncludingKeyword;
}

