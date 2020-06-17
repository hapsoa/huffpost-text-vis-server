export type Fivew1h = "who" | "where" | "when" | "what" | "why" | "how";

export interface HuffPostDatum {
  url: string;
  category: string;
  date: string;
  dateIndex: number;
  title: string;
  subtitle: string;
  content: string;
  keywordObjects: Fivew1hKeyword[];
}

export interface InvertedIndex {
  [keywordInDictionary: string]: number[];
}

export interface KeywordObject {
  keyword: string;
  frequency: number;
  alphabetIndex: number; // alphabet order index
  fivew1h: Fivew1h;
  yearMonth?: string;
}

export interface RelatedKeywordObject {
  keyword: string;
  relatedFrequency: number;
  alphabetIndex: number; // alphabet order index
  fivew1h: string;
}

export interface KeywordObjectDict {
  [keyword: string]: KeywordObject;
}

export interface TimeDictAboutKeywordObjectDict {
  [time: string]: KeywordObjectDict;
}

// export interface KeywordRelation {
//   [keywordIndex: number]: number; // frequency
// }

// export interface TimeDictAboutKeywordRelationMatrix {
//   [yearMonth: string]: KeywordRelation[];
// }

export interface KeywordRelation {
  [keywordIndex: number]: {
    [huffPostIndex: number]: true;
  }
}

export interface TimeDictAboutKeywordRelationMatrix {
  [yearMonth: string]: KeywordRelation[];
}

export interface AlphabetIndexDictAboutKeyword {
  [alphabetIndex: string]: string;
}

export interface QueryKeyword {
  queryKeyword: string;
}

export interface RelatedKeywordObjectDict {
  [relatedKeyword: string]: RelatedKeywordObject;
}

export interface TimeDictAboutRelatedKeywordObjectDict {
  [yearMonth: string]: RelatedKeywordObjectDict;
}

export interface Fivew1hKeyword {
  keyword: string;
  fivew1h: Fivew1h;
}

export interface CombinationOfRelatedKeywordsTotalTime {
  queryKeywordObject: KeywordObject;
  relatedKeywordObjectDictInTotalTime: RelatedKeywordObjectDict;
  timeDictAboutRelatedKeywordObjectDict: TimeDictAboutRelatedKeywordObjectDict;
}

export interface CombinationOfRelatedKeywords {
  queryKeywordObject: KeywordObject;
  relatedKeywordObjectDict: RelatedKeywordObjectDict;
}