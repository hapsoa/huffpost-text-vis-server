import {
  KeywordRelation,
  AlphabetIndexDictAboutKeyword,
  KeywordObjectDict,
} from "./refiningInterfaces";
import _ = require("lodash");

const testData = require("../5w1h-test-data/rawHuffPostData.json");

const keywordObjectDictTotalTimeFilePath =
  "../lda-ner-result-data/keywordObjectDictIncludingNerTotalTime.json";
const timeDictAboutKeywordObjectDictFilePath =
  "../lda-ner-result-data/timeDictAboutKeywordObjectDictIncludingNer.json";
const keywordRelationMatrixTotalTimeFilePath =
  "../lda-ner-result-data/keywordRelationMatrixTotalTime.json";
const alphabetIndexDictAboutKeywordFilePath =
  "../lda-ner-result-data/alphabetIndexDictAboutKeyword.json";

const timeDictAboutKeywordObjectDict: KeywordRelation[] = require(timeDictAboutKeywordObjectDictFilePath);
const keywordRelationMatrixTotalTime: KeywordRelation[] = require(keywordRelationMatrixTotalTimeFilePath);
const alphabetIndexDictAboutKeyword: AlphabetIndexDictAboutKeyword = require(alphabetIndexDictAboutKeywordFilePath);
const keywordObjectDictTotalTime: KeywordObjectDict = require(keywordObjectDictTotalTimeFilePath);

export function showTestData() {
  return testData;
}

export function getTimeDictAboutKeywordObjectDict() {
  return timeDictAboutKeywordObjectDict;
}

export function getRelatedKeywordsInTotalTime(queryKeyword: string): string[] {
  const queryKeywordAlphabetIndex: number =
    keywordObjectDictTotalTime[queryKeyword].alphabetIndex;

  // find related keywords of query_keyword
  const keywordRelation =
    keywordRelationMatrixTotalTime[queryKeywordAlphabetIndex];

  const relatedKeywords = _.map(
    keywordRelation,
    (frequency, keywordAlphabetIndex) => {
      return alphabetIndexDictAboutKeyword[keywordAlphabetIndex];
    }
  );

  return relatedKeywords;
}
