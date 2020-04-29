import puppeteer = require('puppeteer');

(async () => {

  let title: string = '';
  let subtitle: string = '';
  let textContent: string = '';
  let date: string = '';

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://www.huffpost.com/entry/airplane-droplets-gif_n_5ea8fa50c5b6123a17642e53');


  // const titleElement = await page.$('h1.headline__title');
  // const subTitleElement = await page.$('.headline__subtitle');
  // const timeDivElement = await page.$('.timestamp > span > span');
  // const textDivTagElements = await page.$$('.content-list-component > p');

  const resultsOfGettingElements = await Promise.all([
    page.$('h1.headline__title'),
    page.$('.headline__subtitle'),
    page.$('.timestamp > span > span'),
    page.$$('.content-list-component > p')
  ])
  const titleElement = resultsOfGettingElements[0];
  const subTitleElement = resultsOfGettingElements[1];
  const timeDivElement = resultsOfGettingElements[2];
  const textDivTagElements = resultsOfGettingElements[3];

  title = await titleElement.evaluate(e => e.textContent);
  subtitle = await subTitleElement.evaluate(e => e.textContent);
  date = await timeDivElement.evaluate(e => e.textContent);

  const promises = textDivTagElements.map(textDivTagElement => textDivTagElement.evaluate(e => e.textContent));
  const texts = await Promise.all(promises);

  for (const text of texts) {
    textContent += text;
  }

  // tslint:disable-next-line: prefer-for-of
  // for (let i = 0; i < textDivTagElements.length; i++) {
  // const text = await textDivTagElements[i].evaluate(e => e.textContent);
  // textContent += text;
  // }


  const document = {
    title, subTitle: subtitle, textContent, date
  }

  console.log('document', document);

  await page.close();

  await browser.close();

  // 최종 documents
  const dateDictAboutDocuments = {
    '2020-04-23': ['documentObject1', 'documentObject2']
  }

  const sampleDocumentDict = {
    'www...': {
      link: 'www...',
      date: '2020-04-27T023132',
      title: '...',
      subTitle: '...',
      content: '...'
    }
  }


})();