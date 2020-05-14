import json
import gensim
from nltk.tokenize import word_tokenize
import pandas as pd
import codecs

if __name__ == '__main__':
    # import huffPostData.json file
    with open('../../test-data/huffPostDataForTest.json', encoding='UTF8') as jsonFile:
        huffPostData = json.load(jsonFile)
        combinedLemmatizedTexts = json.load(codecs.open(
            '../../test-data/combinedLemmatizedTextsForTest.json', 'r', 'utf-8-sig'))

        print('pandas DataFrame start')
        pdDataFrame = pd.DataFrame({'documents': combinedLemmatizedTexts})

        print('start removing special characters')
        # 특수 문자 제거
        pdDataFrame['clean_docs'] = pdDataFrame['documents'].str.replace(
            "[^a-zA-Z]", " ")

        print('start removing short length words')
        # 길이가 3이하인 단어는 제거 (길이가 짧은 단어 제거)
        pdDataFrame['clean_docs'] = pdDataFrame['clean_docs'].apply(
            lambda x: ' '.join([w for w in x.split() if len(w) > 3]))

        # for each post, extract 10 topic keywords
        for (i, clean_doc) in enumerate(pdDataFrame['clean_docs']):
            tokenized_docs = [word_tokenize(clean_doc)]

            # print('tokenized_docs', tokenized_docs)

            dictionary = gensim.corpora.Dictionary(tokenized_docs)
            corpus = [dictionary.doc2bow(text) for text in tokenized_docs]

            ldamodel = gensim.models.ldamodel.LdaModel(
                corpus, num_topics=1, id2word=dictionary, passes=15)

            topics = ldamodel.show_topic(0, topn=10)
            print('i', i)
            huffPostData[i]['keywords'] = []
            # print('huffPostData[i]', huffPostData[i])
            for topic in topics:
                huffPostData[i]['keywords'].append(topic[0])

        with open('../../test-data/huffPostDataIncludingKeywordsForTest.json', 'w', encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(
                huffPostData, ensure_ascii=False))

            # for (i, text) in enumerate(combinedLemmatizedTexts):

            # [
            # 	{
            #     "category": "WORLD NEWS",
            #     "content": " KIEV, Ukraine (AP) — Early results in Ukraine’s presidential election show a comedian with no political experience maintaining his strong lead against the incumbent president in the first round, setting the stage for a runoff in three weeks. With nearly 70 percent of the polling stations counted Monday, Volodymyr Zelenskiy had 30 percent of Sunday’s vote, while incumbent President Petro Poroshenko was a distant second with just over 16 percent. Ex-Prime Minister Yulia Tymoshenko trailed behind with 13 percent. The results were in sync with a top exit poll. The strong showing for the 41-year-old Zelenskiy reflects the public longing for a fresh leader who has no links to the corruption-ridden Ukrainian political elite and can offer a new approach to settling the grinding five-year conflict with Russia-backed separatists in eastern Ukraine. “This is only the first step toward a great victory,” Zelenskiy said after seeing the exit poll findings. The top two candidates advance to a runoff on April 21. Final results in Sunday’s first round are expected to be announced later Monday. Zelenskiy dismissed suggestions that he could pool forces with Tymoshenko to get the backing of her voters in the second round in exchange for forming a coalition following parliamentary elections in the fall. “We aren’t making any deals with anyone,” he said. “We are young people. We don’t want to see all the past in our future, the future of our country.” Like the character he plays in a TV sitcom, a schoolteacher turned president, Zelenskiy made fighting corruption a focus of his candidacy. He proposed a lifetime ban on holding public office for anyone convicted of graft. He also called for direct negotiations with Russia on ending the conflict in eastern Ukraine. The election was marred by allegations of widespread vote buying. Police said they had received more than 2,100 complaints of violations on voting day alone in addition to hundreds of earlier voting fraud claims, including bribery attempts and removing ballots from polling places. Zelenskiy’s headquarters alleged multiple voting and other cheating on the part of Poroshenko’s campaign, but election officials said the vote took place without significant violations. “It is important for us to tell you that no systematic violations took place on either the election day or the night following the election when votes were being counted at the local polling stations,” said Central Election Commission head Tetyana Slipachuk. Poroshenko looked somber as the votes came in, but visibly relieved about surpassing Tymoshenko to advance to the runoff. “I critically and soberly understand the signal that society gave today to the acting authorities,” he said. “It’s a tough lesson for me and my team. It’s a reason for serious work to correct mistakes made over the past years.” It is not clear whether he would or could adjust his campaign enough to meet Zelenskiy’s challenges over the next three weeks. Poroshenko, 53, a confectionery tycoon before he was elected five years ago, saw approval of his governing sink amid Ukraine’s economic woes and a sharp plunge in living standards. Poroshenko campaigned on promises to defeat the rebels in the east and to wrest back control of Crimea, which Russia annexed in 2014 in a move that has drawn sanctions against Russia from the U.S. and the European Union. A military embezzlement scheme that allegedly involved top Poroshenko associates, as well as a factory controlled by the president, dogged Poroshenko before this election. Ultra-right activists shadowed him throughout the campaign, demanding the jailing of the president’s associates accused in the scandal. Poroshenko after the vote hit back at Zelenskiy, describing him as a pawn of self-exiled billionaire businessman Igor Kolomoyskyi, charges that Zelenskiy denies. “Fate pitted me against Kolomoyskyi’s puppet in the runoff,” he said. “We won’t leave a single chance for Kolomoyskyi.” Zelenskiy quickly shot back, saying mockingly that it’s impossible to say whether a corrupt official involved in the military embezzlement scheme was Poroshenko’s puppet, or the other way round. With the lineup for the runoff becoming clear, voters were picking sides. “Poroshenko is taking the country forward,” said Serhiy Poltorachenko, a bank employee. “He made mistakes, but promised to correct them. Poroshenko will win because Ukrainians won’t like to have a clown at the country’s helm.” Petro Demidchenko, a 38-year-old office worker, said he was supporting Zelenskiy even though he is an unknown quantity. “We don’t know what to expect from Zelenskiy, but over the past five years we have found out what to expect from Poroshenko — corruption, soaring prices, continuing war and poverty,” he said.",
            #     "date": "2019-04-01",
            #     "dateIndex": 0,
            #     "subtitle": "The strong showing reflects the public longing for a fresh leader who has no links to the corruption-ridden Ukrainian political elite.",
            #     "title": "Comedian Volodymyr Zelenskiy, Who Plays Ukraine's President On TV, Is Leading Election",
            #     "url": "https://www.huffpost.com/entry/ukraine-comedian-leads-presidential-election-runoff-likely_n_5ca156fbe4b0bc0dacaa8268",
            # 		"keywords": ["keyword1", "keyword2", ...] // topic keywords? or RAKE keywords
            #   },
            # 	...
            # ]
            # write file
