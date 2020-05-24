import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import {
  getTimeDictAboutKeywordObjectDict,
  getRelatedKeywordsInTotalTime,
  getTimeDictAboutRelatedKeywordObjectDictInEachTime,
  getKeywordObjectDictTotalTime,
} from "./processFunctions";
import {
  QueryKeyword,
  RelatedKeywordObject,
  RelatedKeywordObjectDict,
  TimeDictAboutRelatedKeywordObjectDict,
} from "./refiningInterfaces";
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World! Node server");
});

app.get(
  "/time-dict-about-keyword-object-dict",
  (req: express.Request, res: express.Response) => {
    const timeDictAboutKeywordObjectDict = getTimeDictAboutKeywordObjectDict();
    res.send(timeDictAboutKeywordObjectDict);
  }
);

app.post(
  "/related-keywords",
  (
    req: express.Request<any, any, QueryKeyword, any>,
    res: express.Response
  ) => {
    console.log("related-keywords req!", req.body.queryKeyword);

    const queryKeyword: string = req.body.queryKeyword;
    const keywordObjectDictTotalTime = getKeywordObjectDictTotalTime();
    const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
    const relatedKeywordObjectDictInTotalTime: RelatedKeywordObjectDict = getRelatedKeywordsInTotalTime(
      queryKeyword
    );
    const timeDictAboutRelatedKeywordObjectDict: TimeDictAboutRelatedKeywordObjectDict = getTimeDictAboutRelatedKeywordObjectDictInEachTime(
      queryKeyword
    );

    // send top k documents. this can be done by flask server.

    res.send({
      queryKeywordObject,
      relatedKeywordObjectDictInTotalTime,
      timeDictAboutRelatedKeywordObjectDict,
    });
  }
);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
