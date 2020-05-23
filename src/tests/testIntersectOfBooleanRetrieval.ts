import { InvertedIndex } from "../RefineAboutLdaNer/refiningInterfaces";

// read invertedIndex.json
const invertedIndex: InvertedIndex = require("../../test-data/invertedIndexForTest.json");

// read vectors.json
const documentVectorsFilePath: string =
  "../../test-data/documentVectorsForTest.json";
const documentVectors: number[][] = require(documentVectorsFilePath);

// query keywords (vector)
const keywordsForQuery: string[] = ["from", "common"];

// boolean retrieval intersection of multiple keywords
// then postings will be retrieved.
const retrievedDocuments = intersect2WordsOfBooleanRetrieval(
  keywordsForQuery,
  invertedIndex
);
console.log("retrievedDocuments", retrievedDocuments);

/**
 * intersect with 2 keywords in Boolean Retrieval
 * @param keywords
 * @param innerInvertedIndex
 */
function intersect2WordsOfBooleanRetrieval(
  keywords: string[],
  innerInvertedIndex: InvertedIndex
): number[] {
  // keyword1's postingsList
  const postingsList1: number[] = innerInvertedIndex[keywords[0]];

  // keyword2's postingsList
  const postingsList2: number[] = innerInvertedIndex[keywords[1]];

  console.log("postingsList1", postingsList1);
  console.log("postingsList2", postingsList2);

  const answer: number[] = [];

  let p1Index: number = 0;
  let p2Index: number = 0;
  while (p1Index < postingsList1.length && p2Index < postingsList2.length) {
    if (postingsList1[p1Index] === postingsList2[p2Index]) {
      answer.push(postingsList1[p1Index]);
      p1Index++;
      p2Index++;
    } else if (postingsList1[p1Index] < postingsList2[p2Index]) {
      p1Index++;
    } else {
      p2Index++;
    }
  }

  return answer;
}

// TODO
/**
 * intersect with multiple keywords of Boolean Retrieval
 * @param keywords
 * @param innerInvertedIndex
 */
function intersectOfBooleanRetrieval(
  keywords: string[],
  innerInvertedIndex: InvertedIndex
): number[] {
  return [];
}
