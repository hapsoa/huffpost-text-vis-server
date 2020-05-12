# remove punctuation

import string

s = 'Hello. Nice, to meet you. d'

# string.punctuation
result = s.translate(str.maketrans('', '', string.punctuation))
# Hello Nice to meet you d

print(result)
