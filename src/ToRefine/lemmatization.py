from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import json
import sys
import nltk

# nltk.download('wordnet')
# nltk.download('averaged_perceptron_tagger')

from nltk.corpus import wordnet


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


sentence = 'Part of the problem is that tests designed to be very sensitive to any coronavirus antibodies are more likely to detect them, meaning there would be more false positives.'

# tokenize
words = word_tokenize(sentence)

# POS
wordsIncludingPos = pos_tag(words)


wordNetLemmatizer = WordNetLemmatizer()
# words = ['policy', 'doing', 'organization', 'have', 'going',
#          'love', 'lives', 'fly', 'dies', 'watched', 'has', 'starting']
# lemmatizedWords = [wordNetLemmatizer.lemmatize(w) for w in words]
lemmatizedWords = [wordNetLemmatizer.lemmatize(
    w[0], get_wordnet_pos(w[1])) for w in wordsIncludingPos]


# make json
jsonDumps = json.dumps(lemmatizedWords, ensure_ascii=False)

print(jsonDumps)
sys.stdout.flush()
