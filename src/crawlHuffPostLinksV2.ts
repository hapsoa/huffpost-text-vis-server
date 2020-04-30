

import puppeteer = require('puppeteer');
import fs = require('fs');

interface PostAbstract {
  url: string,
  category: string,
  date: string,
  title: string,
  subtitle: string
}

(async () => {

  const postAbstracts: PostAbstract[] = [];

  // browser를 만든다
  const browser = await puppeteer.launch(
    // { headless: false }
  );


  // 1년간 반복한다. 2019-04-01 ~ 2020-03-31
  const date = new Date('2019-04-01');
  while (getDateFor8String(date) !== '2020-04-01') {
    // browser에 page를 만든다
    const page = await browser.newPage();

    const dateString = getDateFor8String(date);

    // 해당 url로 이동한다
    await page.goto(`https://www.huffpost.com/archive/${dateString}`);


    // 링크를 찾는다. <a>에 있다. 해당 href를 찾아서 변수에 저장한다.
    const postDivElements = await page.$$('.card__details');

    for (const postDivElement of postDivElements) {

      const resultsOfGettingElement = await Promise.all([
        postDivElement.$('.card__label__text'),
        postDivElement.$('a.card__link.yr-card-headline'),
        postDivElement.$('.card__description')
      ]);
      const categoryDivElement = resultsOfGettingElement[0];
      const titleDivElement = resultsOfGettingElement[1];
      const subtitleDivElement = resultsOfGettingElement[2];


      const resultsOfElementEvaluation = await Promise.all([
        categoryDivElement.evaluate(e => e.textContent),
        titleDivElement.evaluate(e => e.textContent),
        // @ts-ignore
        titleDivElement.evaluate(e => e.href),
        subtitleDivElement.evaluate(e => e.textContent)
      ]);

      const category = resultsOfElementEvaluation[0];
      const title = resultsOfElementEvaluation[1].replace(/\n/gi, '');
      const url = resultsOfElementEvaluation[2];
      const subtitle = resultsOfElementEvaluation[3].replace(/\n/gi, '');

      postAbstracts.push({
        category,
        date: dateString,
        subtitle,
        title,
        url
      });
    }


    // 해당 페이지를 종료한다
    await page.close();

    console.log(dateString, 'done');
    date.setDate(date.getDate() + 1);
    await sleep(2000);
  }


  // console.log('sampleDateDictAboutLinks', dateDictAboutLinks);

  // browser를 종료한다
  await browser.close();

  fs.writeFileSync('result-data/abstract.json', JSON.stringify(postAbstracts));
  console.log('process done');
})();


/**
 * object Date to 'OOOO-OO-OO'
 * @param date
 */
function getDateFor8String(date: Date): string {
  const dateString = date.toLocaleDateString();

  let dateStringPieces = dateString.split('-');
  // when dateString can't splited by '-'
  if (dateStringPieces.length === 1) {
    dateStringPieces = dateString.split('.');
    dateStringPieces = dateStringPieces.map(dateStringPiece => dateStringPiece.trim());
  }

  const year = dateStringPieces[0];
  const month = dateStringPieces[1].length === 1 ? '0' + dateStringPieces[1] : dateStringPieces[1];
  const day = dateStringPieces[2].length === 1 ? '0' + dateStringPieces[2] : dateStringPieces[2];


  return `${year}-${month}-${day}`;
}

/**
 * function to make process sleep temporarily
 * @param ms
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  })
}