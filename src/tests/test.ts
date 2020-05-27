import _ = require("lodash");

const huffPostData = require("../../lda-ner-result-data/huffPostDataIncludingKeywords.json");

console.log("huffPostData.length", huffPostData.length);

// const testData = { 1: 1, 3: 5, 5: 3 };

// const result = _.chain(testData)
//   .map((frequency, alphbetIndex) => {
//     return {
//       alphbetIndex,
//       frequency,
//     };
//   })
//   .sortBy((datum) => -datum.frequency)
//   .splice(0, 2)
//   .value();

// // const result = _.sortBy(testData);

// console.log("result", result);
