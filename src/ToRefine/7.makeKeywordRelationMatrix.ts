import fs = require('fs');
import { KeywordObjectDict, HuffPostDatum, KeywordObject } from './refiningInterfaces';
import _ = require('lodash');

// read keywordWeightDict.json
const keywordObjectDict: KeywordObjectDict = require('../../test-data/keywordObjectDictForTest.json');
// read huffPostDataIncludingKeywords.json
const huffPostData: HuffPostDatum[] = require('../../test-data/huffPostDataIncludingKeywordsForTest.json');

// sparse matrix
// [[weight0(keyword0-keyword0), weight1(keyword0-keyword1), ...]]
// Initialize 2d-array of each value 0.
const keywordRelationMatrix: number[][] = new Array(Object.keys(keywordObjectDict).length).fill([]);
keywordRelationMatrix.forEach((oneKeywordRelation, i) => {
  keywordRelationMatrix[i] = new Array(Object.keys(keywordObjectDict).length).fill(0);
})


// for each keyword and for another each keyword,
_.forEach(keywordObjectDict, keywordObjectA => {
  _.forEach(keywordObjectDict, keywordObjectB => {
    // make relation the keyword and another keyword
    // recall, precision needed (huffPostData needed)

    // (tp + fp) is number of retreived posts including keyword1
    // tp is number of retrieved posts including keyword2
    // (tp + fn) is number of all posts including keyword2
    const fMeasureAB = getFMeasureBetween2Words(keywordObjectA, keywordObjectB, huffPostData);
    // another fMeasure
    const fMeasureBA = getFMeasureBetween2Words(keywordObjectB, keywordObjectA, huffPostData);

    // then make harmonic mean

    // then make relation
    const relation = 1 - getHarmonicMeanBetween2(1 - fMeasureAB, 1 - fMeasureBA);
    keywordRelationMatrix[keywordObjectA.orderIndex][keywordObjectB.orderIndex] = relation;
  });
});

// write keywordRelationMatrix.json
const writingFilePath: string = '../../test-data/keywordRelationMatrixForTest.json'
fs.writeFileSync(writingFilePath, JSON.stringify(keywordRelationMatrix));

/**
 * Get harmonic mean between 2 elements(number).
 * @param number1
 * @param number2
 */
function getHarmonicMeanBetween2(number1: number, number2: number): number {
  return number1 + number2 !== 0 ? (2 * number1 * number2) / (number1 + number2) : 0;
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
  innerHuffPostData: HuffPostDatum[]
): number {
  const tpfpAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectA.keyword], innerHuffPostData);
  const tpAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectA.keyword, keywordObjectB.keyword], innerHuffPostData);
  const tpfnAB: number = getNumberOfRetrievedPostsIncludingKeywords(
    [keywordObjectB.keyword], innerHuffPostData);
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
  innerHuffPostData: HuffPostDatum[]
): number {
  let numberOfRetrievedPostsIncludingKeyword: number = 0;
  innerHuffPostData.forEach(huffPostDatum => {
    let numberOfTrues: number = 0;
    huffPostDatum.keywordObjects.forEach(keywordObject => {
      if (searchingKewords.includes(keywordObject.keyword)) {
        numberOfTrues++;
      }
    });
    if (numberOfTrues === searchingKewords.length) { numberOfRetrievedPostsIncludingKeyword++; }
  });

  return numberOfRetrievedPostsIncludingKeyword;
}

