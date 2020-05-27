// This code is for inverted index for Boolean Retrieval.

import fs = require("fs");
import _ = require("lodash");
import { HuffPostDatum, InvertedIndex } from "./refiningInterfaces";

// for test path
// const readingFilePath: string = '../../5w1h-test-data/huffPostDataIncludingKeywords.json';
// const writingFilePath: string = '../../5w1h-test-data/invertedIndex.json';
// for real path
const readingFilePath: string =
  "../../5w1h-result-data/huffPostDataIncludingKeywords.json";
const writingFilePath: string = "../../5w1h-result-data/invertedIndex.json";

// import huffPostDataIncludingKeywords.json
// tslint:disable-next-line: no-var-requires
const huffPostData: HuffPostDatum[] = require(readingFilePath);

// inverted index variables
const invertedIndex: InvertedIndex = {};

// For each post, 1)put keywords at dictionary and 2)put document index at postingsList
huffPostData.forEach((huffPostDatum, postIndex) => {
  huffPostDatum.keywords.forEach((keywordObject) => {
    if (invertedIndex.hasOwnProperty(keywordObject.keyword)) {
      // if dictionary has keyword, then push posting
      invertedIndex[keywordObject.keyword].push(postIndex);
    } else {
      // if dictionary don't have keyword, then make new dictionary and postingsList. And put posting.
      invertedIndex[keywordObject.keyword] = [postIndex];
    }
  });
});

// write invertedIndex.json
fs.writeFileSync(writingFilePath, JSON.stringify(invertedIndex, null, 2));
