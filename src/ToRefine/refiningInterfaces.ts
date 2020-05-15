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