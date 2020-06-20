test_array = [1, 2, 3, 4, 5]

result = filter(lambda item: item % 2 == 0, test_array)
print('result', list(result))
