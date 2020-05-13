import re

regex = re.compile('[^a-zA-Z]')

word1 = 'hello'

m = regex.match('s.sd,f,')

print('m', m)
