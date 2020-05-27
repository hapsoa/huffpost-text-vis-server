import fs = require("fs");
import { Fivew1hKeyword } from "./refiningInterfaces";

// read keywordsTextFile
// for test data path
// const keywordsTextFilePath = "../../5w1h-test-data/keywordsTextFile.txt";
// const writingKeywordsJsonPath =
//   "../../5w1h-test-data/huffPostArrayAboutFivew1hKeywords.json";
// for real data path
const keywordsTextFilePath = "../../5w1h-result-data/keywordsTextFile.txt";
const writingKeywordsJsonPath =
  "../../5w1h-result-data/huffPostArrayAboutFivew1hKeywords.json";

const keywordsTexts = fs
  .readFileSync(keywordsTextFilePath)
  .toString()
  .split("\n");

// const keywordsJson: { keyword: string; fivew1h: string }[][] = [];
const keywordsJson: Fivew1hKeyword[][] = [];

keywordsTexts.forEach((keywordsText) => {
  // console.log("keywordsText", keywordsText);
  const keywords: Fivew1hKeyword[] = JSON.parse(keywordsText);
  keywordsJson.push(keywords);
});

// write keywords.json
fs.writeFileSync(writingKeywordsJsonPath, JSON.stringify(keywordsJson));
