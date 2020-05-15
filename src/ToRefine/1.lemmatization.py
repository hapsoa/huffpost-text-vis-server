from nltk.corpus import wordnet
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import json
import sys
import nltk
import re
# nltk.download('wordnet')
# nltk.download('averaged_perceptron_tagger')


def get_wordnet_pos(treebank_tag):

    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN


# import json file
if __name__ == '__main__':
    with open('../../result-data/huffPostData.json', encoding='UTF8') as json_file:
        huffPostData = json.load(json_file)

        combinedLemmatizedTexts = []
        wordNetLemmatizer = WordNetLemmatizer()

        # iterate each post to 1)sum texts and 2)lemmatize
        for huffPostDatum in huffPostData:
            # 1)sum texts
            combinedText = huffPostDatum['title'] + ' ' + \
                huffPostDatum['subtitle'] + ' ' + huffPostDatum['content']

            # 2)lemmatize
            words = word_tokenize(combinedText)
            for (i, word) in enumerate(words):
                words[i] = word.lower()
            wordsIncludingPos = pos_tag(words)
            lemmatizedWords = [wordNetLemmatizer.lemmatize(
                w[0], get_wordnet_pos(w[1])) for w in wordsIncludingPos]

            # words to sentence
            # TODO difficult to paste like ',', '""
            # Should we remove ","??
            combinedLemmatizedText = ''
            for lemmatizedWord in lemmatizedWords:
                regex = re.compile('[.!,?]')
                if regex.match(lemmatizedWord) == None:
                    combinedLemmatizedText += ' ' + lemmatizedWord
                else:
                    combinedLemmatizedText += lemmatizedWord

            combinedLemmatizedTexts.append(combinedLemmatizedText)

        # write json file
        with open('../../result-data/combinedLemmatizedTexts.json', 'w', encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(
                combinedLemmatizedTexts, ensure_ascii=False))


# sentence = 'Part of the problem is that tests designed to be very sensitive to any coronavirus antibodies are more likely to detect them, meaning there would be more false positives.'

# # tokenize
# words = word_tokenize(sentence)

# # POS
# wordsIncludingPos = pos_tag(words)


# wordNetLemmatizer = WordNetLemmatizer()
# # words = ['policy', 'doing', 'organization', 'have', 'going',
# #          'love', 'lives', 'fly', 'dies', 'watched', 'has', 'starting']
# # lemmatizedWords = [wordNetLemmatizer.lemmatize(w) for w in words]
# lemmatizedWords = [wordNetLemmatizer.lemmatize(
#     w[0], get_wordnet_pos(w[1])) for w in wordsIncludingPos]
