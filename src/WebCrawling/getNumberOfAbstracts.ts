import fs = require('fs');

const abstracts = JSON.parse(fs.readFileSync('result-data/postAbstracts.json', 'utf8'));

console.log(abstracts.length);