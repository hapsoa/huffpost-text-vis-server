from rake_nltk import Rake

# Uses stopwords for english from NLTK, and all puntuation characters.
r = Rake()

r.extract_keywords_from_text('text to process')

# To get keyword phrases ranked highest to lowest.
result = r.get_ranked_phrases()

print(result)
