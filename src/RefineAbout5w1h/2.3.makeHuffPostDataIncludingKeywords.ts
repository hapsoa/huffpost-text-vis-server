import fs = require("fs");
import _ = require("lodash");
import { Fivew1hKeyword, HuffPostDatum } from "./refiningInterfaces";

// test file path
// const huffPostDataFilePath = "../../5w1h-test-data/rawHuffPostData.json";
// const huffPostArrayAboutFivew1hKeywordsFilePath =
//   "../../5w1h-test-data/huffPostArrayAboutFivew1hKeywords.json";
// const writingHuffPostDataIncludingKeywordsFilePath =
//   "../../5w1h-test-data/huffPostDataIncludingKeywords.json";
// real file path
const huffPostDataFilePath = "../../lda-ner-result-data/rawHuffPostData.json";
const huffPostArrayAboutFivew1hKeywordsFilePath =
  "../../5w1h-result-data/huffPostArrayAboutFivew1hKeywords.json";
const writingHuffPostDataIncludingKeywordsFilePath =
  "../../5w1h-result-data/huffPostDataIncludingKeywords.json";

const huffPostArrayAboutFivew1hKeywords: Fivew1hKeyword[][] = require(huffPostArrayAboutFivew1hKeywordsFilePath);
const huffPostData: HuffPostDatum[] = require(huffPostDataFilePath);

_.forEach(huffPostData, (huffPostDatum, i) => {
  // huffPostDatum.keywords = huffPostArrayAboutFivew1hKeywords[i];
  huffPostDatum.keywords = _.filter(
    huffPostArrayAboutFivew1hKeywords[i],
    (fivew1hKeyword) => {
      fivew1hKeyword.keyword = fivew1hKeyword.keyword.replace(
        /[^a-zA-Z0-9]/g,
        ""
      );
      return fivew1hKeyword.keyword.length > 3 ? true : false;
    }
  );
});

fs.writeFileSync(
  writingHuffPostDataIncludingKeywordsFilePath,
  JSON.stringify(huffPostData, null, 2)
);
