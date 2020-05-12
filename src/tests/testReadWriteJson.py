import json

if __name__ == '__main__':
    with open('../../result-data/test.json', encoding='UTF8') as json_file:
        jsonData = json.load(json_file)
        jsonData['writing'] = 'writing'
        with open('../../result-data/testwriting.json', 'w', encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(jsonData, ensure_ascii=False))
