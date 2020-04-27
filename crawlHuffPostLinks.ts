

import puppeteer = require('puppeteer');

(async () => {

  const sampleDateDictAboutLinks = {
    '2020-04-26': []
  };

  // browser를 만든다
  const browser = await puppeteer.launch(
    // { headless: false }
  );

  // browser에 page를 만든다
  const page = await browser.newPage();
  // 해당 url로 이동한다
  await page.goto('https://www.huffpost.com/archive/2020-04-26');


  // 링크를 찾는다. <a>에 있다. 해당 href를 찾아서 변수에 저장한다.
  const linkATagElements = await page.$$('a.card__link');



  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < linkATagElements.length; i++) {
    // @ts-ignore
    const link = await linkATagElements[i].evaluate(e => e.href);
    sampleDateDictAboutLinks['2020-04-26'].push(link);
  }

  console.log('sampleDateDictAboutLinks', sampleDateDictAboutLinks);





  // 페이지를 새로 이동한다.

  // 해당 페이지를 종료한다
  await page.close();


  // browser를 종료한다
  await browser.close();
})();

console.log('hi test');