import fs = require('fs');
import { KeywordObjectDict, HuffPostDatum, KeywordObject, AlphabetIndexDictAboutKeyword } from './refiningInterfaces';
import _ = require('lodash');
import { makeMonthUnitsFromHuffPostData, getYearMonthFromStringDate } from './utils';

interface KeywordRelation {
  [keywordIndex: number]: number;
}

interface TimeDictAboutKeywordRelationMatrix {
  [yearMonth: string]: KeywordRelation[]
}

// for test file path
const huffPostDataJsonPath: string = '../../test-data/huffPostDataIncludingKeywordsForTest.json';
const keywordObjectDictJsonPath: string
  = '../../test-data/keywordObjectDictTotalTimeForTest.json';
const alphabetIndexDictAboutKeywordFilePath =
  '../../test-data/alphabetIndexDictAboutKeywordForTest.json';
const writingKeywordRelationMatrixTotalTimeFilePath =
  '../../test-data/keywordRelationMatrixTotalTimeForTest.json'
const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
  '../../test-data/timeDictAboutKeywordRelationMatrixForTest.json';

// for real file path
// const keywordObjectDictJsonPath: string
//   = '../../result-data/keywordObjectDictTotalTime.json';
// const huffPostDataJsonPath: string = '../../result-data/huffPostDataIncludingKeywords.json';
// const writingKeywordRelationMatrixTotalTimeFilePath =
//   '../../result-data/keywordRelationMatrixTotalTime.json';
// const writingTimeDictAboutKeywordRelationMatrixFilePath: string =
//   '../../result-data/timeDictAboutKeywordRelationMatrix.json';


const huffPostData: HuffPostDatum[] = require(huffPostDataJsonPath);
const keywordObjectDict: KeywordObjectDict = require(keywordObjectDictJsonPath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword
  = require(alphabetIndexDictAboutKeywordFilePath);

const timeDictAboutKeywordRelationMatrix: TimeDictAboutKeywordRelationMatrix = {};

// make time property to timeDict
const timeUnits: string[] = makeMonthUnitsFromHuffPostData(huffPostData);
timeUnits.forEach(timeUnit => {
  timeDictAboutKeywordRelationMatrix[timeUnit] =
    new Array(Object.keys(keywordObjectDict).length).fill({});
})

// sparse matrix
// [
//   {2(keyword0-keyword2): 0.76(weight), 5: 0.8, ...},
//   ...
// ]
// Initialize 2d-array of each value 0.
const keywordRelationMatrixTotalTime: KeywordRelation[] =
  new Array(Object.keys(keywordObjectDict).length).fill({});

const minimumRelation: number = 0.1
// TODO for each keyword and for another each keyword,
_.forEach(keywordObjectDict, keywordObjectA => {
  _.forEach(keywordObjectDict, keywordObjectB => {
    // make relation the keyword and another keyword
    const relation: number = makeRelationBetween2Keywords(keywordObjectA, keywordObjectB, huffPostData);
    if (relation > minimumRelation) {
      keywordRelationMatrixTotalTime[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
        relation;
    }

    // for each month, make relation.
    timeUnits.forEach(timeUnit => {
      const keywordRelationMatrix1Month = timeDictAboutKeywordRelationMatrix[timeUnit]
      const relationInMonth: number
        = makeRelationBetween2Keywords(keywordObjectA, keywordObjectB, huffPostData, timeUnit);
      if (relationInMonth > minimumRelation) {
        keywordRelationMatrix1Month[keywordObjectA.alphabetIndex][keywordObjectB.alphabetIndex] =
          relationInMonth;
      }
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
  keywordObjectB: KeywordObject,
  innerHuffPostData: HuffPostDatum[],
  yearMonth: string | null = null
): number {
  const fMeasureAB = getFMeasureBetween2Words(keywordObjectA, keywordObjectB, innerHuffPostData, yearMonth);
  const fMeasureBA = getFMeasureBetween2Words(keywordObjectB, keywordObjectA, innerHuffPostData, yearMonth);
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
  console.log('!!!!', Object.keys(innerKeywordObjectDict).length)
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

