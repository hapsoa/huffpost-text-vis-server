import {
  KeywordRelation,
  AlphabetIndexDictAboutKeyword,
  KeywordObjectDict,
  RelatedKeywordObject,
  RelatedKeywordObjectDict,
  KeywordObject,
  TimeDictAboutKeywordRelationMatrix,
  TimeDictAboutKeywordObjectDict,
  HuffPostDatum,
  TimeDictAboutRelatedKeywordObjectDict,
} from "./refiningInterfaces";
import _ = require("lodash");
import { makeNerTo5w1h, makeYearMonthsFromHuffPostData } from "./utils";

const testData = require("../5w1h-test-data/rawHuffPostData.json");

// const keywordObjectDictTotalTimeFilePath =
//   "../lda-ner-result-data/keywordObjectDictIncludingNerTotalTime.json";
// const timeDictAboutKeywordObjectDictFilePath =
//   "../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json";
// const keywordRelationMatrixTotalTimeFilePath =
//   "../lda-ner-result-data/keywordRelationMatrixTotalTime.json";
// const timeDictAboutKeywordRelationMatrixFilePath =
//   "../lda-ner-result-data/timeDictAboutKeywordRelationMatrix.json";
// const alphabetIndexDictAboutKeywordFilePath =
//   "../lda-ner-result-data/alphabetIndexDictAboutKeyword.json";
// const huffPostDataFilePath = "../lda-ner-result-data/rawHuffPostData.json";
const keywordObjectDictTotalTimeFilePath =
  "../5w1h-result-data/keywordObjectDictTotalTime.json";
const timeDictAboutKeywordObjectDictFilePath =
  "../5w1h-result-data/timeDictAboutKeywordObjectDict.json";
const keywordRelationMatrixTotalTimeFilePath =
  "../5w1h-result-data/keywordRelationMatrixTotalTime.json";
const timeDictAboutKeywordRelationMatrixFilePath =
  "../5w1h-result-data/timeDictAboutKeywordRelationMatrix.json";
const alphabetIndexDictAboutKeywordFilePath =
  "../5w1h-result-data/alphabetIndexDictAboutKeyword.json";
const huffPostDataFilePath =
  "../5w1h-result-data/huffPostDataIncludingKeywords.json";

const timeDictAboutKeywordObjectDict: TimeDictAboutKeywordObjectDict = require(timeDictAboutKeywordObjectDictFilePath);
const keywordRelationMatrixTotalTime: KeywordRelation[] = require(keywordRelationMatrixTotalTimeFilePath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = require(alphabetIndexDictAboutKeywordFilePath);
const keywordObjectDictTotalTime: KeywordObjectDict = require(keywordObjectDictTotalTimeFilePath);
const timeDictAboutKeywordRelationMatrix: TimeDictAboutKeywordRelationMatrix = require(timeDictAboutKeywordRelationMatrixFilePath);
const huffPostData: HuffPostDatum[] = require(huffPostDataFilePath);

export function getKeywordObjectDictTotalTime() {
  return keywordObjectDictTotalTime;
}

export function getTimeDictAboutKeywordObjectDict() {
  return timeDictAboutKeywordObjectDict;
}

export function getRelatedKeywordsInTotalTime(
  queryKeyword: string
): RelatedKeywordObjectDict {
  const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  // find related keywords of query_keyword
  const keywordRelation: KeywordRelation =
    keywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];

  const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
    keywordRelation,
    (frequency, keywordAlphabetIndex) => {
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = keywordObjectDictTotalTime[keyword];
      return {
        keyword,
        relatedFrequency: frequency,
        alphabetIndex: keywordObject.alphabetIndex,
        fivew1h: keywordObject.fivew1h,
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "other"];

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

export function getTimeDictAboutRelatedKeywordObjectDictInEachTime(
  queryKeyword: string
): TimeDictAboutRelatedKeywordObjectDict {
  const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
  const queryKeywordAlphabetIndex: number = queryKeywordObject.alphabetIndex;

  const yearMonths = makeYearMonthsFromHuffPostData(huffPostData);
  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "other"];

  const timeDictAboutRelatedKeywordObjectDict: TimeDictAboutRelatedKeywordObjectDict = {};

  _.forEach(yearMonths, (yearMonth) => {
    // find related keywords of query_keyword
    const keywordRelation: KeywordRelation =
      timeDictAboutKeywordRelationMatrix[yearMonth][queryKeywordAlphabetIndex];
    keywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];
    const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
      keywordRelation,
      (frequency, keywordAlphabetIndex) => {
        const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
        const keywordObject = keywordObjectDictTotalTime[keyword];
        return {
          keyword,
          alphabetIndex: keywordObject.alphabetIndex,
          relatedFrequency: frequency,
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
    timeDictAboutKeywordRelationMatrix[yearMonth][
      queryKeywordObject.alphabetIndex
    ];

  const relatedKeywordObjects: RelatedKeywordObject[] = _.map(
    keywordRelation,
    (frequency, keywordAlphabetIndex) => {
      const keyword = alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
      const keywordObject = timeDictAboutKeywordObjectDict[yearMonth][keyword];

      return {
        keyword: alphabetIndexDictAboutKeyword[keywordAlphabetIndex],
        alphabetIndex: Number(keywordAlphabetIndex),
        relatedFrequency: frequency,
        fivew1h: keywordObject.fivew1h,
      };
    }
  );

  // get top frequent keywordObject at each 5w1h
  const fivew1hs: string[] = ["who", "where", "when", "what", "how", "other"];

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
