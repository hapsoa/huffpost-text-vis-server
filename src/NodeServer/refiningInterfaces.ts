export interface HuffPostDatum {
  url: string;
  category: string;
  date: string;
  dateIndex: number;
  title: string;
  subtitle: string;
  content: string;
  keywordObjects: { keyword: string; weight: number }[];
}

export interface InvertedIndex {
  [keywordInDictionary: string]: number[];
}

export interface KeywordObject {
  keyword: string;
  frequency: number;
  weight: number;
  alphabetIndex: number; // alphabet order index
  ner: string;
}

export interface KeywordObjectDict {
  [keyword: string]: KeywordObject;
}

export interface TimeDictAboutKeywordObjectDict {
  [time: string]: KeywordObjectDict;
}

export interface NerDictAboutKeywordObjectDict {
  [fivew1h: string]: KeywordObjectDict;
}

export interface TimeDictAboutNerDictAboutKeywordObjectDict {
  [time: string]: NerDictAboutKeywordObjectDict;
}

export interface AlphabetIndexDictAboutKeyword {
  [alphabetIndex: string]: string;
}

export interface KeywordRelation {
  [keywordIndex: number]: number;
}

export interface TimeDictAboutKeywordRelationMatrix {
  [yearMonth: string]: KeywordRelation[];
}

export interface QueryKeyword {
  queryKeyword: string;
}
