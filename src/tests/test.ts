import _ = require("lodash");

// const testString = "pt/2pm";
const testString = "a.m.";

const result = testString.replace(/[^a-zA-Z0-9]/g, "");
console.log("testString", testString);
console.log("result", result);
