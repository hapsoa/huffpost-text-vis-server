export interface HuffPostDatum {
  url: string,
  category: string,
  date: string,
  dateIndex: number,
  title: string,
  subtitle: string,
  content: string,
  keywordObjects: { keyword: string, weight: number }[]
}

export interface InvertedIndex {
  [keywordInDictionary: string]: number[];
}

export interface KeywordObject {
  keyword: string;
  frequency: number;
  weight: number;
  alphabetIndex: number; // alphabet order index
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

export interface AlphabetIndexDictAboutKeyword {
  [alphabetIndex: number]: string;
}