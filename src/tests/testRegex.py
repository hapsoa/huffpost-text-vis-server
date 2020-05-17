import re

regex = re.compile('[^a-zA-Z]')

word1 = 'hello'

testWord = 's.sd,f,'

# match() is detecting from start. return None when not matched.
matchResult = regex.match(testWord)
print('matchResult', matchResult)
searchResult = regex.search(testWord)
print('searchResult', searchResult)

# remove puntuation OOOO.
