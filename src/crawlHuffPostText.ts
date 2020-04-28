import puppeteer = require('puppeteer');

(async () => {

  let title: string = '';
  let subtitle: string = '';
  let textContent: string = '';
  let date: string = '';

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://www.huffpost.com/entry/new-zealand-coronavirus-ease-restrictions_n_5ea69285c5b6805f9ed0039a');


  const titleElement = await page.$('h1.headline__title');
  title = await titleElement.evaluate(e => e.textContent);

  const subTitleElement = await page.$('.headline__subtitle');
  subtitle = await subTitleElement.evaluate(e => e.textContent);

  const timeDivElement = await page.$('.timestamp > span > span');
  date = await timeDivElement.evaluate(e => e.textContent);

  const textDivTagElements = await page.$$('.content-list-component > p > span');

  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < textDivTagElements.length; i++) {
    const text = await textDivTagElements[i].evaluate(e => e.textContent);
    textContent += text;
  }


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