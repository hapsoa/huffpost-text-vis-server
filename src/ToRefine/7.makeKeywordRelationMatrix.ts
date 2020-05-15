import fs = require('fs');
import { KeywordObjectDict, HuffPostDatum } from './refiningInterfaces';
import _ = require('lodash');

// read keywordWeightDict.json
const keywordObjectDict: KeywordObjectDict = require('../../test-data/keywordObjectDictForTest.json');
// read huffPostDataIncludingKeywords.json
const huffPostData: HuffPostDatum[] = require('../../test-data/huffPostDataIncludingKeywordsForTest.json');

// [[keyword1Index, keyword2Index, weight], ...]
const keywordRelationMatrix: number[][] = [];

// for each keyword and for another each keyword,
_.forEach(keywordObjectDict, keywordObject1 => {
  _.forEach(keywordObjectDict, keywordObject2 => {
    // make relation the keyword and another keyword
    // recall, precision needed (huffPostData needed)

    // (tp + fp) is number of retreived posts including keyword1
    // tp is number of retrieved posts including keyword2
    // (tp + fn) is number of all posts including keyword2
    const tpfp: number = getNumberOfRetrievedPostsIncludingKeywords(
      [keywordObject1.keyword], huffPostData);
    const tp: number = getNumberOfRetrievedPostsIncludingKeywords(
      [keywordObject1.keyword, keywordObject2.keyword], huffPostData);
    const tpfn: number = getNumberOfRetrievedPostsIncludingKeywords(
      [keywordObject2.keyword], huffPostData);
    const recall: number = tp / tpfp;
    const precision: number = tp / tpfn;
    const fMeasure: number =
      precision + recall !== 0 ? 2 * (precision * recall) / (precision + recall) : 0;
    console.log('recall', recall);
    console.log('precision', precision);
    console.log('fMeasure', fMeasure);

    // another fMeasure

    // then make harmonic mean

    // then make relation
  });
});

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

// write keywordRelationMatrix.json
const writingFilePath: string = '../../test-data/keywordRelationMatrixForTest.json'
fs.writeFileSync(writingFilePath, JSON.stringify(keywordRelationMatrix, null, 2));