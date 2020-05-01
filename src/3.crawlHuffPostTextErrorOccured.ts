import puppeteer = require('puppeteer');
import fs = require('fs');
import { HuffPostDatum } from './interfaces';
import { sleep } from './utilForCrawl';

let errorIndexes: number[] = JSON.parse(
  fs.readFileSync('result-data/errorIndexesAboutHuffPostData.json', 'utf8')
);
const huffPostData: HuffPostDatum[] = JSON.parse(
  fs.readFileSync('result-data/huffPostData.json', 'utf8')
);

console.log('errorIndexes', errorIndexes);
let newErrorIndexes: number[] = [];

(async () => {
  const browser = await puppeteer.launch();

  // iteration while all of error contents are solved.
  while (errorIndexes.length !== 0) {

    // For each errorIndex, crawl again.
    for (const errorIndex of errorIndexes) {
      const huffPostDatum = huffPostData[errorIndex];
      let content: string = '';

      const page = await browser.newPage();

      try {
        await page.goto(huffPostDatum.url);

        // get content
        let textDivTagElements = await page.$$('.content-list-component p');

        if (textDivTagElements.length === 0) {
          textDivTagElements = await page.$$('.cli-text p');
          if (textDivTagElements.length === 0) {
            console.error('the url can be accessed. but can not crawl content', huffPostDatum.url);
            newErrorIndexes.push(errorIndex);
            console.log('errorIndexes', errorIndexes);
          }
        }

        const textPromises = textDivTagElements
          .map(textDivTagElement => textDivTagElement.evaluate(e => e.textContent));
        const contentTexts = await Promise.all(textPromises);
        for (const text of contentTexts) {
          content = content + ' ' + text;
        }

      } catch (error) {
        console.error('error made', error);
        newErrorIndexes.push(errorIndex);
        console.log('errorIndexes', errorIndexes);
      }

      huffPostData[errorIndex].content = content;

      await page.close();
      await sleep(2000);
    }


    errorIndexes = newErrorIndexes;
    newErrorIndexes = [];
  }

  await browser.close();
  console.log('process end', huffPostData)

  fs.writeFileSync('result-data/perfectHuffPostData.json', JSON.stringify(huffPostData, null, 2));
})();




