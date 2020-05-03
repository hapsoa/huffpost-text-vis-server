import puppeteer = require('puppeteer');
import fs = require('fs');
import { HuffPostDatum } from './interfaces';
import { sleep } from './utilForCrawl';

const errorIndexes: number[] = JSON.parse(
  fs.readFileSync('result-data/errorIndexesAboutHuffPostData.json', 'utf8')
);
const huffPostData: HuffPostDatum[] = JSON.parse(
  fs.readFileSync('result-data/huffPostData.json', 'utf8')
);

console.log('errorIndexes', errorIndexes);
const newErrorIndexes: number[] = [];

(async () => {
  const browser = await puppeteer.launch();

  // iteration while all of error contents are solved.
  // while (errorIndexes.length !== 0) {

  // For each errorIndex, crawl again.
  for (const errorIndex of errorIndexes) {
    console.log('errorIndex start', errorIndex);
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
      console.error('the error url is', huffPostDatum.url);
      newErrorIndexes.push(errorIndex);
    }

    huffPostData[errorIndex].content = content;

    await page.close();
    await sleep(2000);
    console.log('errorIndex end', errorIndex);
  }


  //   errorIndexes = newErrorIndexes;
  //   newErrorIndexes = [];
  // }

  await browser.close();
  console.log('process end', huffPostData)

  fs.writeFileSync('result-data/huffPostData.json', JSON.stringify(huffPostData, null, 2));
  fs.writeFileSync('result-data/errorIndexesAboutHuffPostData.json', JSON.stringify(newErrorIndexes));
})();




