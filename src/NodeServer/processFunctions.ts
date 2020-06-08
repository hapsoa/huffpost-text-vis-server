import {
  AlphabetIndexDictAboutKeyword,
  HuffPostDatum,
  KeywordObject,
  KeywordObjectDict,
  NewKeywordRelation,
  RelatedKeywordObject,
  RelatedKeywordObjectDict,
  TimeDictAboutKeywordObjectDict,
  TimeDictAboutNewKeywordRelationMatrix,
  TimeDictAboutRelatedKeywordObjectDict,
} from "./refiningInterfaces";
import {makeYearMonthsFromHuffPostData} from "./utils";
import {SunburstDatum} from "./spvInterfaces";
import _ = require("lodash");

const testData = require("../5w1h-test-data/rawHuffPostData.json");


const keywordObjectDictTotalTimeFilePath =
  "../5w1h-result-data/keywordObjectDictTotalTime.json";
const timeDictAboutKeywordObjectDictFilePath =
  "../5w1h-result-data/timeDictAboutKeywordObjectDict.json";
// const keywordRelationMatrixTotalTimeFilePath =
//     "../5w1h-result-data/keywordRelationMatrixTotalTime.json";
const newKeywordRelationMatrixTotalTimeFilePath =
  "../5w1h-result-data/newKeywordRelationMatrixTotalTime.json";
// const timeDictAboutKeywordRelationMatrixFilePath =
//     "../5w1h-result-data/timeDictAboutKeywordRelationMatrix.json";
const timeDictAboutNewKeywordRelationMatrixFilePath =
  "../5w1h-result-data/timeDictAboutNewKeywordRelationMatrix.json";
const alphabetIndexDictAboutKeywordFilePath =
  "../5w1h-result-data/alphabetIndexDictAboutKeyword.json";
const huffPostDataFilePath =
  "../5w1h-result-data/huffPostDataIncludingKeywords.json";

const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = require(timeDictAboutKeywordObjectDictFilePath);
// const keywordRelationMatrixTotalTime: KeywordRelation[] = require(keywordRelationMatrixTotalTimeFilePath);
const newKeywordRelationMatrixTotalTime: NewKeywordRelation[] = require(newKeywordRelationMatrixTotalTimeFilePath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = require(alphabetIndexDictAboutKeywordFilePath);
const keywordObjectDictTotalTime: KeywordObjectDict = require(keywordObjectDictTotalTimeFilePath);
// const timeDictAboutKeywordRelationMatrix: TimeDictAboutKeywordRelationMatrix = require(timeDictAboutKeywordRelationMatrixFilePath);
const timeDictAboutNewKeywordRelationMatrix: TimeDictAboutNewKeywordRelationMatrix = require(timeDictAboutNewKeywordRelationMatrixFilePath);
const huffPostData: HuffPostDatum[] = require(huffPostDataFilePath);

export function getKeywordObjectDictTotalTime() {
  return keywordObjectDictTotalTime;
}

export function getTimeDictAboutKeywordObjectDict() {
  return timeDictAboutKeywordObjectDict;
}

export function getNewRelatedKeywordsInTotalTime(
  queryKeyword: string
): RelatedKeywordObjectDict {
  const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  // find related keywords of query_keyword
  const keywordRelation: NewKeywordRelation =
    newKeywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];

  const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
    keywordRelation,
    (dictForFrequency, keywordAlphabetIndex) => {
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = keywordObjectDictTotalTime[keyword];
      return {
        keyword,
        relatedFrequency: Object.keys(dictForFrequency).length,
        alphabetIndex: keywordObject.alphabetIndex,
        fivew1h: keywordObject.fivew1h,
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "why"];

  const topRelatedKeywordObjectDict: RelatedKeywordObjectDict = {};
  _.forEach(fivew1hs, (fivew1h) => {
    const topRelatedKeywordObject = _.chain(relatedKeywordObjects)
      .filter(
        (relatedKeywordObject) => relatedKeywordObject.fivew1h === fivew1h
      )
      .maxBy(
        (filteredRelatedKeywordObject) =>
          filteredRelatedKeywordObject.relatedFrequency
      )
      .value();

    if (topRelatedKeywordObject) {
      topRelatedKeywordObjectDict[
        topRelatedKeywordObject.keyword
        ] = topRelatedKeywordObject;
    }
  });

  return topRelatedKeywordObjectDict;
}

export function getRelatedKeywordsForSpv(
  queryKeyword: string
): SunburstDatum[] {
  const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  // find related keywords of query_keyword
  const keywordRelation: NewKeywordRelation =
    newKeywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];

  const relatedKeywordObjects: SunburstDatum[] = _.map(
    keywordRelation,
    (dictForFrequency, keywordAlphabetIndex) => {
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = keywordObjectDictTotalTime[keyword];
      return {
        keyword,
        relatedFrequency: Object.keys(dictForFrequency).length,
        fivew1h: keywordObject.fivew1h
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "why"];

  const sunburstData: SunburstDatum[] = [];
  _.forEach(fivew1hs, (fivew1h) => {
    const topRelatedKeywordObject = _.chain(relatedKeywordObjects)
      .filter(
        (relatedKeywordObject) => relatedKeywordObject.fivew1h === fivew1h
      )
      .maxBy(
        (filteredRelatedKeywordObject) =>
          filteredRelatedKeywordObject.relatedFrequency
      )
      .value();

    if (topRelatedKeywordObject) {
      sunburstData.push(topRelatedKeywordObject);
    }
  });

  // return topRelatedKeywordObjectDict;
  return sunburstData
}


export function getRelatedKeywordsForSpvInUpgrade(
  currentQueryKeyword: string, pastQueryKeywords: string[]
): SunburstDatum[] {
  const queryKeywordObject = keywordObjectDictTotalTime[currentQueryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  // find related keywords of query_keyword
  const keywordRelation: NewKeywordRelation =
    newKeywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];
  const pastQueryKeywordRelations: NewKeywordRelation[]
    = _.map(pastQueryKeywords, pastQueryKeyword => {
    const pastQueryKeywordObject = keywordObjectDictTotalTime[pastQueryKeyword];
    return newKeywordRelationMatrixTotalTime[pastQueryKeywordObject.alphabetIndex];
  });
  console.log('pastQueryKeywordRelations.length', pastQueryKeywordRelations.length);


  // make candidates of relatedKeyword
  const relatedKeywordObjects: SunburstDatum[] = _.map(
    keywordRelation,
    (huffPostIndexDict, keywordAlphabetIndex) => {
      // related keyword
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = keywordObjectDictTotalTime[keyword];

      // pastQueryKeyword
      // how to check relatedKeyword comparing to pastQueryKeywords
      let relatedFrequency: number = 0;
      _.forEach(huffPostIndexDict, (booleanTrue, huffPostIndex) => {
        // If huffPostIndex is all in pastQueryKeywordRelation, then frequency++
        let hasHuffPostInAllPastQueryKeywords: boolean = true;
        _.forEach(pastQueryKeywordRelations, pastQueryKeywordRelation => {
          const huffPostIndexDict2 = pastQueryKeywordRelation[Number(keywordAlphabetIndex)];
          if (huffPostIndexDict2 &&
            !huffPostIndexDict2.hasOwnProperty(Number(huffPostIndex))) {
            hasHuffPostInAllPastQueryKeywords = false;
            return false;
          }
        });

        if (hasHuffPostInAllPastQueryKeywords) relatedFrequency++;

      });


      return {
        keyword,
        // relatedFrequency: Object.keys(huffPostIndexDict).length,
        relatedFrequency,
        fivew1h: keywordObject.fivew1h
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "why"];

  const sunburstData: SunburstDatum[] = [];
  _.forEach(fivew1hs, (fivew1h) => {
    const topRelatedKeywordObject = _.chain(relatedKeywordObjects)
      .filter(
        (relatedKeywordObject) => relatedKeywordObject.fivew1h === fivew1h
      )
      .maxBy(
        (filteredRelatedKeywordObject) =>
          filteredRelatedKeywordObject.relatedFrequency
      )
      .value();

    if (topRelatedKeywordObject) {
      sunburstData.push(topRelatedKeywordObject);
    }
  });

  // return topRelatedKeywordObjectDict;
  return sunburstData
}


export function getTimeDictAboutRelatedKeywordObjectDictInEachTime(
  queryKeyword: string
): TimeDictAboutRelatedKeywordObjectDict {
  const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  const yearMonths = makeYearMonthsFromHuffPostData(huffPostData);
  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "why"];

  const timeDictAboutRelatedKeywordObjectDict: TimeDictAboutRelatedKeywordObjectDict = {};

  _.forEach(yearMonths, (yearMonth) => {
    // find related keywords of query_keyword
    const keywordRelation: NewKeywordRelation =
      timeDictAboutNewKeywordRelationMatrix[yearMonth][queryKeywordAlphabetIndex];
    // newKeywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];
    const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
      keywordRelation,
      (dictForFrequency, keywordAlphabetIndex) => {
        const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
        const keywordObject = keywordObjectDictTotalTime[keyword];
        return {
          keyword,
          alphabetIndex: keywordObject.alphabetIndex,
          relatedFrequency: Object.keys(dictForFrequency).length,
          fivew1h: keywordObject.fivew1h,
        };
      }
    );

    const topRelatedKeywordObjectDict: RelatedKeywordObjectDict = {};
    _.forEach(fivew1hs, (fivew1h) => {
      const topRelatedKeywordObject = _.chain(relatedKeywordObjects)
        .filter(
          (relatedKeywordObject) => relatedKeywordObject.fivew1h === fivew1h
        )
        .maxBy(
          (filteredRelatedKeywordObject) =>
            filteredRelatedKeywordObject.relatedFrequency
        )
        .value();

      if (topRelatedKeywordObject) {
        topRelatedKeywordObjectDict[
          topRelatedKeywordObject.keyword
          ] = topRelatedKeywordObject;
      }
    });

    timeDictAboutRelatedKeywordObjectDict[
      yearMonth
      ] = topRelatedKeywordObjectDict;
  });

  return timeDictAboutRelatedKeywordObjectDict;
}

export function getRelatedKeywordsInTime(
  queryKeywordObject: KeywordObject,
  yearMonth: string
): RelatedKeywordObjectDict {
  const keywordRelation =
    timeDictAboutNewKeywordRelationMatrix[yearMonth][
      queryKeywordObject.alphabetIndex
      ];

  const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
    keywordRelation,
    (dictForFrequency, keywordAlphabetIndex) => {
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = timeDictAboutKeywordObjectDict[yearMonth][keyword];

      return {
        keyword: alphabetIndexDictAboutKeyword[keywordAlphabetIndex],
        alphabetIndex: Number(keywordAlphabetIndex),
        relatedFrequency: Object.keys(dictForFrequency).length,
        fivew1h: keywordObject.fivew1h,
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "why"];

  const topRelatedKeywordObjectDict: RelatedKeywordObjectDict = {};
  _.forEach(fivew1hs, (fivew1h) => {
    const topRelatedKeywordObject = _.chain(relatedKeywordObjects)
      .filter(
        (relatedKeywordObject) => relatedKeywordObject.fivew1h === fivew1h
      )
      .maxBy(
        (filteredRelatedKeywordObject) =>
          filteredRelatedKeywordObject.relatedFrequency
      )
      .value();

    if (topRelatedKeywordObject) {
      topRelatedKeywordObjectDict[
        topRelatedKeywordObject.keyword
        ] = topRelatedKeywordObject;
    }
  });

  return topRelatedKeywordObjectDict;
}
