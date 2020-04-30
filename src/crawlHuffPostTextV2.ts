import puppeteer = require('puppeteer');

(async () => {

  let title: string = '';
  let subtitle: string = '';
  let content: string = '';
  let date: string = '';

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  // await page.goto('https://www.huffpost.com/entry/airplane-droplets-gif_n_5ea8fa50c5b6123a17642e53');
  await page.goto('https://www.huffpost.com/entry/royal-baby-name-predictions-meghan-markle_l_5ca37911e4b0c3297960dae1');

  const resultsOfGettingElements = await Promise.all([
    page.$('h1.headline__title'),
    page.$('.headline__subtitle'),
    page.$('.timestamp > span > span'),
    // page.$$('.content-list-component p')
    page.$$('.cli-text p')
  ]);
  const titleElement = resultsOfGettingElements[0];
  const subTitleElement = resultsOfGettingElements[1];
  const timeDivElement = resultsOfGettingElements[2];
  const textDivTagElements = resultsOfGettingElements[3];

  console.log('textDivTagElements.length', textDivTagElements.length);

  // const resultsOfEvaluation = await Promise.all([
  //   titleElement.evaluate(e => e.textContent),
  //   subTitleElement.evaluate(e => e.textContent),
  //   timeDivElement.evaluate(e => e.textContent)
  // ]);
  // title = resultsOfEvaluation[0];
  // subtitle = resultsOfEvaluation[1];
  // date = resultsOfEvaluation[2];

  const textPromises = textDivTagElements
    .map(textDivTagElement => textDivTagElement.evaluate(e => e.textContent));
  const contentTexts = await Promise.all(textPromises);
  for (const text of contentTexts) {
    content += text;
  }

  const document = {
    title, subtitle, content, date
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