export interface HuffPostDatum {
  url: string, // 실제 기사가 있는 링크
  category: string, // 링크 크롤링 할 때 가져오기
  date: string, // 링크 크롤링 할 때
  dateIndex: number, // 기준일 (2019-04-01) 부터 얼마나 지났는지 확인 -> 예전 코드가 있어요
  title: string, // 링크 크롤링 할 때 가져오기
  subtitle: string, // 링크 크롤링 할 때 가져오기
  content: string, // 링크 내부로 들어가서 가져오기
}