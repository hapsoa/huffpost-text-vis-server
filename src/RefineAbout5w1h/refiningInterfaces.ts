export interface HuffPostDatum {
  url: string;
  category: string;
  date: string;
  dateIndex: number;
  title: string;
  subtitle: string;
  content: string;
  keywords: { keyword: string, fivew1h: number }[];
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

export interface TimeDictAboutKeywordRelationMatrix {
  [time: string]: number[][];
}

export interface Fivew1hDictAboutKeywordObjectDict {
  [fivew1h: string]: KeywordObjectDict
}

export interface TimeDictAbout5w1hDictAboutKeywordObjectDict {
  [time: string]: Fivew1hDictAboutKeywordObjectDict
}

export interface AlphabetIndexDictAboutKeyword {
  [alphabetIndex: number]: string;
}