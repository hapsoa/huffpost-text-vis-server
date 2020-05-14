import json
import codecs

if __name__ == '__main__':
    combinedLemmatizedTexts = json.load(
        codecs.open('../../result-data/combinedLemmatizedTexts.json', 'r', 'utf-8-sig'))

    combinedLemmatizedTextsForTest = [
        combinedLemmatizedTexts[0], combinedLemmatizedTexts[1], combinedLemmatizedTexts[2]]

    with open('../../result-data/combinedLemmatizedTextsForTest.json', 'w', encoding='UTF-8-sig') as outfile:
        outfile.write(json.dumps(
            combinedLemmatizedTextsForTest, ensure_ascii=False))
