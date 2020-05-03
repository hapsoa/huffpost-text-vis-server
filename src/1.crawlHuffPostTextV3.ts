import puppeteer = require('puppeteer');
import fs = require('fs');
import { sleep, dateDuration } from './utilForCrawl';

interface HuffPostDatum {
  url: string, // 실제 기사가 있는 링크
  category: string, // 링크 크롤링 할 때 가져오기
  date: string, // 링크 크롤링 할 때
  dateIndex: number, // 기준일 (2019-04-01) 부터 얼마나 지났는지 확인 -> 예전 코드가 있어요
  title: string, // 링크 크롤링 할 때 가져오기
  subtitle: string, // 링크 크롤링 할 때 가져오기
  content: string, // 링크 내부로 들어가서 가져오기
}


(async () => {
  const huffPostData: HuffPostDatum[] = [];
  const erorrIndexes: number[] = [];

  // read postAbstracts.json
  const abstracts: HuffPostDatum[] = JSON.parse(fs.readFileSync('result-data/postAbstracts.json', 'utf8'));

  const browser = await puppeteer.launch();

  for (let i = 0; i < abstracts.length; i++) {

    const abstract = abstracts[i];
    let content: string = '';

    const page = await browser.newPage();

    try {
      // read abstract.url
      await page.goto(abstract.url);

      // get content
      let textDivTagElements = await page.$$('.content-list-component p');

      if (textDivTagElements.length === 0) {
        textDivTagElements = await page.$$('.cli-text p');
        if (textDivTagElements.length === 0) {
          console.error('the url can be accessed. but can not crawl content', abstract.url);
          erorrIndexes.push(i);
          console.log('erorrIndexes', erorrIndexes);
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
      erorrIndexes.push(i);
      console.log('erorrIndexes', erorrIndexes);
    }


    const huffPostDatum: HuffPostDatum = {
      category: abstract.category,
      content,
      date: abstract.date,
      dateIndex: dateDuration(abstracts[0].date, abstract.date),
      subtitle: abstract.subtitle,
      title: abstract.title,
      url: abstract.url
    };
    console.log('huffPostDatum', i, huffPostDatum);
    huffPostData.push(huffPostDatum);



    // create newStructure
    await page.close();
    await sleep(2000);
  }


  await browser.close();

  fs.writeFileSync('result-data/huffPostData.json', JSON.stringify(huffPostData, null, 2));
  fs.writeFileSync('result-data/errorIndexesAboutHuffPostData.json', JSON.stringify(erorrIndexes));




})();