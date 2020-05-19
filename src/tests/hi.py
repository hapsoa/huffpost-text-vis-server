import sys
import json

hello = {
    "goodDay": 'good'
}
jsonDumps = json.dumps(hello, ensure_ascii=False)

print(jsonDumps)
sys.stdout.flush()
