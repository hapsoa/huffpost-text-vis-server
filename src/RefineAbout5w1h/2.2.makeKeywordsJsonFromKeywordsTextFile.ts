import fs = require("fs");

// read keywordsTextFile
// for test data path
const keywordsTextFilePath = "../../5w1h-test-data/keywordsTextFile.txt";
const writingKeywordsJsonPath = "../../5w1h-test-data/keywords.json";
// for real data path
// const keywordsTextFilePath = "../../5w1h-result-data/keywordsTextFile.txt";
// const writingKeywordsJsonPath = "../../5w1h-result-data/keywords.json";

const keywordsTexts = fs
  .readFileSync(keywordsTextFilePath)
  .toString()
  .split("\n");

// const keywordsJson: { keyword: string; fivew1h: string }[][] = [];
const keywordsJson: any = [];

keywordsTexts.forEach((keywordsText) => {
  // console.log("keywordsText", keywordsText);
  const keywords: { keyword: string; fivew1h: string }[] = JSON.parse(
    keywordsText
  );
  keywordsJson.push(keywords);
});

// write keywords.json
fs.writeFileSync(writingKeywordsJsonPath, JSON.stringify(keywordsJson));
