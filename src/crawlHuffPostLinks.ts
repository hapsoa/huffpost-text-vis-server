

import puppeteer = require('puppeteer');
import fs = require('fs');

(async () => {

  const dateDictAboutLinks: { [date: string]: string[] } = {};
  // const sampleDateDict = {
  //   'www...': {
  //     link: 'www...',
  //     category: 'politics',
  //     title: 'Indian Women ...',
  //     date: '2020-04-27',
  //     subTitle: 'Indian hair is in a complicated, often heartbreaking relationship with the women who own it. We talked to eight women about the importance of hairstyles and culture.'
  //   }
  // }

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
    const linkATagElements = await page.$$('a.card__link.yr-card-headline');


    dateDictAboutLinks[dateString] = [];

    const promises: Promise<string>[] = [];
    for (const linkATagElement of linkATagElements) {
      // @ts-ignore
      promises.push(linkATagElement.evaluate(e => e.href));

      // @ts-ignore
      // const link = await linkATagElement.evaluate(e => e.href);
      // dateDictAboutLinks[dateString].push(link);
    }
    const links = await Promise.all(promises);
    dateDictAboutLinks[dateString] = links;

    // 해당 페이지를 종료한다
    await page.close();

    console.log(dateString, 'done');
    date.setDate(date.getDate() + 1);
    await sleep(2000);
  }


  // console.log('sampleDateDictAboutLinks', dateDictAboutLinks);

  // browser를 종료한다
  await browser.close();

  fs.writeFileSync('result-data/links.json', JSON.stringify(dateDictAboutLinks));
  console.log('process done');
})();


/**
 * object Date to 'OOOO-OO-OO'
 * @param date
 */
function getDateFor8String(date: Date): string {
  const dateString = date.toLocaleDateString();

  const dateStringPieces = dateString.split('-');

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