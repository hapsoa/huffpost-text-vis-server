import re

regex = re.compile('[^a-zA-Z]')

word1 = 'hello'

# match() is detecting from start. return None when not matched.
m = regex.match('s.sd,f,')

print('m', m)


# remove puntuation OOOO.
