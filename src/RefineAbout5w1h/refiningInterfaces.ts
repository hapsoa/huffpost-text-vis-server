export type Fivew1h = "who" | "where" | "when" | "what" | "why" | "how";

export interface HuffPostDatum {
    url: string;
    category: string;
    date: string;
    dateIndex: number;
    title: string;
    subtitle: string;
    content: string;
    keywords: Fivew1hKeyword[];
}

export interface InvertedIndex {
    [keywordInDictionary: string]: number[];
}

export interface KeywordObject {
    keyword: string;
    frequency: number;
    alphabetIndex: number; // alphabet order index
    fivew1h: string;
    yearMonth?: string;
}

export interface KeywordObjectDict {
    [keyword: string]: KeywordObject;
}

export interface TimeDictAboutKeywordObjectDict {
    [time: string]: KeywordObjectDict;
}

export interface KeywordRelation {
    [keywordIndex: number]: number; // frequency
}

export interface TimeDictAboutKeywordRelationMatrix {
    [yearMonth: string]: KeywordRelation[];
}

export interface NewKeywordRelation {
    [keywordIndex: number]: {
        [huffPostIndex: number]: true;
    }
}

export interface TimeDictAboutNewKeywordRelationMatrix {
    [yearMonth: string]: NewKeywordRelation[];
}


export interface Fivew1hDictAboutKeywordObjectDict {
    [fivew1h: string]: KeywordObjectDict;
}

export interface TimeDictAbout5w1hDictAboutKeywordObjectDict {
    [time: string]: Fivew1hDictAboutKeywordObjectDict;
}

export interface AlphabetIndexDictAboutKeyword {
    [alphabetIndex: number]: string;
}

export interface Fivew1hKeyword {
    keyword: string;
    fivew1h: Fivew1h;
}
